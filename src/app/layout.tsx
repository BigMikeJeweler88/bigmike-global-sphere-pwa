import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import { TopBar } from '@/components/Header'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'BigMike Global Sports CRM',
  description: 'Global Sports Client Intelligence Platform',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'BigMike CRM' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#060d1f',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <Providers>
          <TopBar />
          <main className="min-h-screen pb-20 pt-14">
            {children}
          </main>
          <Nav />
        </Providers>
      </body>
    </html>
  )
}
