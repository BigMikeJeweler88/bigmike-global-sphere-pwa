import type{Metadata}from'next';
import'./globals.css';
import Providers from'./providers';
export const metadata:Metadata={title:'BigMike Global Sports CRM',description:'Global Sports Client Intelligence',manifest:'/manifest.json',appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'BigMike CRM'}};
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang="en" suppressHydrationWarning><head><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/><link rel="apple-touch-icon" href="/icons/icon-192x192.png"/></head><body className="bg-[#060d1f] text-white antialiased"><Providers>{children}</Providers></body></html>);
}