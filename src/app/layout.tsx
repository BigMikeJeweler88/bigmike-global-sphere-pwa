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
        {/* iOS PWA — must be installed via Safari "Add to Home Screen" to hide URL bar */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BigMike CRM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
      </head>
      <body className="bg-[#060d1f] text-white antialiased overflow-x-hidden">
        <Providers>
          <div className="flex flex-col min-h-[100dvh]">
            <MobileHeader />
            <TopModeBar />
            <main className="flex-1 pb-[env(safe-area-inset-bottom,80px)] pt-[104px] pb-20">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  )
}
