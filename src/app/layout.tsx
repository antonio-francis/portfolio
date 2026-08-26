/**
 * @license
 * Copyright (c) 2026 Antonio Francis. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 * Project: Portfolio
 * Author: Antonio Francis
 */

import { Geist, Geist_Mono, Inter_Tight } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import { siteMetadata } from '@/lib/metadata';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: true,
  display: 'swap',
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: true,
  display: 'swap',
});
// Inter Tight mirrors Apple's SF Pro Display: a clean, bold, tightly-tracked
// sans used for headlines across the site (the "bold iPhone font" look).
const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
  preload: true,
  display: 'swap',
});
export const metadata = siteMetadata;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} antialiased bg-cream`}
      >
        {/* Strip browser-extension attributes (Bitdefender bis_*) before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var a=['bis_skin_checked','bis_register','__processed_8190521b-8672-45e1-9537-cb43277ce324__'];function c(r){a.forEach(function(n){r.querySelectorAll('['+n+']').forEach(function(e){e.removeAttribute(n)})});if(r.documentElement){a.forEach(function(n){if(r.documentElement.hasAttribute(n))r.documentElement.removeAttribute(n)})}}c(document);var o=new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes'&&m.attributeName){var t=m.target;if(a.indexOf(m.attributeName)!==-1)t.removeAttribute(m.attributeName)}if(m.type==='childList'){m.addedNodes.forEach(function(n){if(n.nodeType===1)c({querySelectorAll:n.querySelectorAll.bind(n),documentElement:n})})}})});o.observe(document.documentElement,{attributes:true,attributeFilter:a,subtree:true,childList:true});setTimeout(function(){o.disconnect()},10000)})();`,
          }}
        />
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}

