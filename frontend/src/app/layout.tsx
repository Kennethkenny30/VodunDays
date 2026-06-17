import React from 'react';
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { cookies } from 'next/headers';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/i18n/locale';
import { IntlClientProvider } from '@/i18n/IntlClientProvider';
import { SWRegister } from '@/components/sw-register';

const RAW_SITE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3001'
const SITE_URL = RAW_SITE_URL.startsWith('http') ? RAW_SITE_URL : `https://${RAW_SITE_URL}`
const OG_IMAGE = '/arene-ouidah.jpg'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'Vodun Days - Festival Culturel du Bénin',
    template: '%s | Vodun Days',
  },
  description: 'Plateforme numérique officielle des Vodun Days. Découvrez le programme, les lieux et les traditions de cet événement culturel et spirituel majeur du Bénin.',
  keywords: [
    'Vodun Days', 'festival Bénin', 'Ouidah', 'culture vodoun', 'vodun',
    'festival culturel', 'Bénin', 'traditions africaines', 'cérémonies vodoun',
    'patrimoine immatériel', 'fête nationale Bénin',
  ],
  authors: [{ name: 'Vodun Days' }],
  creator: 'Vodun Days',
  publisher: 'Vodun Days',
  openGraph: {
    type:            'website',
    locale:          'fr_FR',
    alternateLocale: 'en_US',
    siteName:        'Vodun Days',
    title:           'Vodun Days - Festival Culturel du Bénin',
    description:     'Plateforme numérique officielle des Vodun Days à Ouidah, Bénin.',
    images: [{
      url:    OG_IMAGE,
      width:  1200,
      height: 630,
      alt:    'Vodun Days - Festival Culturel du Bénin',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Vodun Days - Festival Culturel du Bénin',
    description: 'Plateforme numérique officielle des Vodun Days à Ouidah, Bénin.',
    images:      [OG_IMAGE],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:                true,
      follow:               true,
      'max-image-preview':  'large',
      'max-snippet':        -1,
      'max-video-preview':  -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)'  },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  viewportFit:  'cover',
  themeColor:   '#F5A623',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get('locale')?.value;
  const locale: Locale = (LOCALES as readonly string[]).includes(raw ?? '')
    ? (raw as Locale)
    : DEFAULT_LOCALE;
  const messages = (await import(`../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={cn(GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Vodun Days" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
      <link rel="manifest" href="/manifest.webmanifest" />
      <body className="font-sans antialiased">
        <IntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </IntlClientProvider>
        <SWRegister />
        <Analytics />
        <Script id="json-ld-event" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type":    "Event",
          "name":     "Vodun Days",
          "description": "Festival culturel et spirituel international célébrant les traditions vodoun du Bénin à Ouidah.",
          "startDate": "2026-01-10",
          "endDate":   "2026-01-12",
          "eventStatus":     "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type":   "Place",
            "name":    "Ouidah",
            "address": { "@type": "PostalAddress", "addressLocality": "Ouidah", "addressCountry": "BJ" },
            "geo":     { "@type": "GeoCoordinates", "latitude": 6.3612, "longitude": 2.0889 },
          },
          "organizer": {
            "@type": "Organization",
            "name":  "Vodun Days",
            "url":   SITE_URL,
          },
          "image":        [`${SITE_URL}/arene-ouidah.JPG`],
          "url":          SITE_URL,
          "inLanguage":   ["fr", "en"],
          "isAccessibleForFree": true,
        })}} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4QH93YHX4B"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4QH93YHX4B');
          `}
        </Script>
      </body>
    </html>
  );
}
