import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import InteractiveBackground from '../src/components/InteractiveBackground';
import './globals.css';

// ▸ FONT OPTIMIZATION (Performance: Prevents layout shift)
// display: 'swap' shows fallback font immediately, then swaps to custom font (avoids FOUT)
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap', // Prevents Cumulative Layout Shift (CLS)
  preload: true,
  fallback: ['monospace'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap', // Prevents Cumulative Layout Shift (CLS)
  preload: true,
  fallback: ['sans-serif'],
});

// ▸ STRUCTURED DATA (SEO: +5 points)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Khalai Makhlooq',
  alternateName: 'KMHQ',
  url: 'https://makhlooq.com',
  logo: 'https://makhlooq.com/logo.png',
  description: 'Star Citizen crew with big ships, clean ops, and full KMHQ vibe.',
  sameAs: ['https://discord.gg/example'], // Add your Discord/social links
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Community',
    url: 'https://makhlooq.com',
  },
};

export const metadata = {
  // ▸ CORE SEO
  title: 'KHALAI MAKHLOOQ — Elite Star Citizen Organization',
  description: 'Khalai Makhlooq is a Star Citizen crew with big ships, chill energy, and serious coordination when the scene gets spicy.',
  keywords: ['Star Citizen', 'Organization', 'KMHQ', 'Khalai Makhlooq', 'Gaming Community'],
  
  metadataBase: new URL('https://makhlooq.com'),
  canonical: 'https://makhlooq.com',

  // ▸ OG TAGS (Social Media & Crawlers)
  openGraph: {
    title: 'KHALAI MAKHLOOQ — Join the Elite',
    description: 'Star Citizen crew [KMHQ]. Hangar open hai.',
    url: 'https://makhlooq.com',
    type: 'website',
    siteName: 'Khalai Makhlooq',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Khalai Makhlooq - Star Citizen Crew',
        type: 'image/jpeg',
      },
    ],
  },

  // ▸ TWITTER CARD (Social Media)
  twitter: {
    card: 'summary_large_image',
    title: 'KHALAI MAKHLOOQ',
    description: 'Star Citizen crew [KMHQ]',
    images: ['/opengraph-image.jpg'],
    creator: '@makhlooq', // Update with your Twitter handle
  },

  // ▸ SEO CRAWLING
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ▸ MANIFEST & ICONS
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },

  // ▸ VERIFICATION (For Google Search Console, etc.)
  verification: {
    // google: 'google-site-verification-code',
    // Add your verification codes here
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* ▸ PRECONNECT TO EXTERNAL DOMAINS (Performance: DNS lookup speedup) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://cdn.discordapp.com" />

        {/* ▸ CANONICAL URL (SEO: Prevents duplicate content) */}
        <link rel="canonical" href="https://makhlooq.com" />

        {/* ▸ ALTERNATE LINKS (SEO: Multi-language support if needed) */}
        <link rel="alternate" hrefLang="en" href="https://makhlooq.com" />

        {/* ▸ SITEMAP (SEO: Crawlability) */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* ▸ FAVICON */}
        <link rel="icon" type="image/png" href="/favicon.png" />

        {/* ▸ STRUCTURED DATA (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
