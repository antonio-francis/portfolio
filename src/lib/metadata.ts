import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteMetadata: Metadata = {
  title: {
    default: 'Antonio Francis - Full Stack Web Developer',
    template: '%s | Antonio Francis',
  },
  description:
    'Full Stack Web Developer specializing in React, Next.js, and digital solutions. I build fast, scalable, results-driven web applications.',
  keywords: [
    'Antonio Francis',
    'Web Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'Next.js',
    'React',
    'JavaScript',
    'Portfolio',
    'India',
    'Kerala',
  ],
  authors: [
    {
      name: 'Antonio Francis',
    },
  ],
  creator: 'Antonio Francis',
  ...(siteUrl
    ? {
        metadataBase: new URL(siteUrl),
        alternates: { canonical: './' },
      }
    : {}),

  openGraph: {
    title: 'Antonio Francis - Full Stack Web Developer',
    description:
      'Portfolio of Antonio Francis, a Full Stack Web Developer specializing in React, Next.js, and premium web experiences.',
    ...(siteUrl ? { url: siteUrl } : {}),
    siteName: 'Antonio Francis Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Antonio Francis - Full Stack Web Developer',
    description:
      'Portfolio of Antonio Francis, a Full Stack Web Developer specializing in React, Next.js, and premium web experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

