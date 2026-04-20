import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BigMike Global Sports CRM',
  description: 'Global Sports Client Intelligence Platform',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body style={{margin:0,padding:0,backgroundColor:'#060d1f',color:'#f0f4ff'}}>
        {children}
      </body>
    </html>
  )
}
