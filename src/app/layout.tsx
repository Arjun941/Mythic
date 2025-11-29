import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Mythic Card Creator',
  description: 'Create mythic cards from your photos using AI',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  themeColor: '#ff6b6b',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mythic',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts for retro gaming theme */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Patrick+Hand&family=Press+Start+2P&display=swap" rel="stylesheet" />
        
        {/* PWA Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff6b6b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mythic" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Mythic" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="mask-icon" href="/icon.png" color="#ff6b6b" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-P4VMWYNZXR"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P4VMWYNZXR');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
