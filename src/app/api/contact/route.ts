import { NextResponse } from 'next/server';
import dns from 'dns';
import https from 'https';
import nodemailer from 'nodemailer';
import { decrypt } from '@/lib/crypto';

interface ContactRequestBody {
  name?: string;
  email?: string;
  message?: string;
}

const MAX_BODY_BYTES = 20_000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5_000;

// Best-effort, per-instance limiter. Keep it bounded so spoofed addresses cannot
// grow the process indefinitely. Use a shared edge limiter in production.
const ipCache = new Map<string, { count: number; expires: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (ipCache.size >= 1_000) {
    for (const [key, value] of ipCache) {
      if (value.expires <= now) ipCache.delete(key);
    }
    const oldestKey = ipCache.keys().next().value;
    if (ipCache.size >= 1_000 && oldestKey) ipCache.delete(oldestKey);
  }
  const record = ipCache.get(ip);
  if (!record || now > record.expires) {
    ipCache.set(ip, { count: 1, expires: now + 15 * 60 * 1000 });
    return false;
  }
  if (record.count >= 5) {
    return true;
  }
  record.count += 1;
  return false;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanHeader(input: string): string {
  return input.replace(/[\r\n]/g, '').trim();
}

/**
 * Send a Telegram notification about a new contact form submission.
 * Decrypts the bot token at runtime so it's never stored in plain text.
 * Runs fire-and-forget so it doesn't block the email response.
 */
async function sendTelegramNotification(name: string, email: string, message: string): Promise<void> {
  const encryptedToken = process.env.TELEGRAM_BOT_TOKEN_ENCRYPTED;
  const encryptionKey = process.env.TELEGRAM_ENCRYPTION_KEY;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!encryptedToken || !encryptionKey || !chatId) {
    console.warn('Telegram notification skipped: missing configuration');
    return;
  }

  let botToken: string;
  try {
    botToken = decrypt(encryptedToken, encryptionKey);
  } catch (err) {
    console.error('Telegram token decryption failed:', err);
    return;
  }

  const truncatedMessage = message.length > 500 ? message.slice(0, 500) + '…' : message;

  const text = [
    '📬 *New Portfolio Message*',
    '',
    `👤 *Name:* ${escapeMarkdownV2(name)}`,
    `📧 *Email:* ${escapeMarkdownV2(email)}`,
    '',
    '💬 *Message:*',
    escapeMarkdownV2(truncatedMessage),
  ].join('\n');

  const postData = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: 'MarkdownV2',
  });

  return new Promise<void>((resolve) => {
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${botToken}/sendMessage`,
        method: 'POST',
        family: 4, // Force IPv4 to avoid ECONNRESET on IPv6
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 10_000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        res.on('end', () => {
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
            console.error('Telegram API error:', res.statusCode, body);
          }
          resolve();
        });
      },
    );

    req.on('error', (err) => {
      console.error('Telegram notification failed:', err);
      resolve(); // Best-effort — don't reject
    });

    req.on('timeout', () => {
      req.destroy();
      console.error('Telegram notification timed out');
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Escape special characters for Telegram MarkdownV2 format.
 */
function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ success: false, error: 'Request body is too large' }, { status: 413 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
      },
      { status: 429 }
    );
  }

  let name = '';
  let email = '';
  let message = '';

  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ success: false, error: 'Request body is too large' }, { status: 413 });
    }
    const body = JSON.parse(rawBody) as ContactRequestBody;
    if (
      (body.name !== undefined && typeof body.name !== 'string') ||
      (body.email !== undefined && typeof body.email !== 'string') ||
      (body.message !== undefined && typeof body.message !== 'string')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid field types' }, { status: 400 });
    }
    name = body.name || '';
    email = body.email || '';
    message = body.message || '';
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid JSON request body',
      },
      {
        status: 400,
      },
    );
  }

  try {
    if (!name || !email || !message)
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required',
        },
        {
          status: 400,
        },
      );

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { success: false, error: 'One or more fields exceed the allowed length' },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        {
          status: 400,
        },
      );

    const disposableDomains = [
      'tempmail.com',
      'guerrillamail.com',
      '10minutemail.com',
      'mailinator.com',
      'yopmail.com',
      'throwaway.email',
      'fakeinbox.com',
      'maildrop.cc',
      'temp-mail.org',
      'getnada.com',
      'trashmail.com',
      'sharklasers.com',
      'grr.la',
      'mintemail.com',
      'test.com',
      'example.com',
      'fake.com',
      'spam4.me',
      'emailondeck.com',
    ];

    const parts = email.split('@');
    if (parts.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const domain = parts[1].toLowerCase();
    if (disposableDomains.includes(domain))
      return NextResponse.json(
        {
          success: false,
          error: 'Disposable emails are not allowed',
        },
        {
          status: 400,
        },
      );

    const username = parts[0];
    if (username.length < 1 || username.length > 64)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        {
          status: 400,
        },
      );

    // Name validations
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }
    if (!/[a-zA-Z]/.test(trimmedName)) {
      return NextResponse.json(
        { success: false, error: 'Name must contain at least one letter' },
        { status: 400 }
      );
    }

    // Message validations
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 30) {
      return NextResponse.json(
        { success: false, error: 'Please enter a meaningful message (at least 30 characters)' },
        { status: 400 }
      );
    }

    const escapedName = escapeHtml(trimmedName);
    const cleanReplyEmail = cleanHeader(email.trim());
    const escapedMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br>');

    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const contactToEmail = process.env.CONTACT_TO_EMAIL || smtpUser;

    if (!smtpUser || !smtpPassword || !contactToEmail) {
      console.error('SMTP Error: SMTP_USER, SMTP_PASSWORD, or CONTACT_TO_EMAIL is not configured.');
      return NextResponse.json(
        {
          success: false,
          error: 'Server email configuration error.',
        },
        {
          status: 500,
        },
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      lookup: (
        hostname: string,
        options: dns.LookupOneOptions,
        callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void
      ) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
    } as any);

    // Send email and Telegram notification in parallel
    const [emailResult] = await Promise.allSettled([
      transporter.sendMail({
        from: `"Portfolio Contact" <${smtpUser}>`,
        to: contactToEmail,
        replyTo: cleanReplyEmail,
        subject: `New message from ${cleanHeader(trimmedName)}`,
        html: `<p><strong>Name:</strong> ${escapedName}</p><p><strong>Email:</strong> ${escapeHtml(cleanReplyEmail)}</p><p><strong>Message:</strong></p><p>${escapedMessage}</p>`,
      }),
      sendTelegramNotification(trimmedName, cleanReplyEmail, trimmedMessage),
    ]);

    // Email is the critical path — Telegram is best-effort
    if (emailResult.status === 'rejected') {
      throw emailResult.reason;
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error: unknown) {
    console.error('Contact form SMTP error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message. Please try again later.',
      },
      {
        status: 500,
      },
    );
  }
}
