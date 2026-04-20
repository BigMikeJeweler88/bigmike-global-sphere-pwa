import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { BottomNav } from '@/components/layout/BottomNav'
import { TopModeBar } from '@/components/layout/TopModeBar'

export const metadata: Metadata = {
  title: 'BigMike Global Sports CRM',
  description: 'Global Sports Client Intelligence Platform — 4,200+ clients',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BigMike CRM',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#060d1f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-[#060d1f] text-white antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <MobileHeader />
            <TopModeBar />
            <main className="flex-1 pb-20 pt-[104px]">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  )
}
