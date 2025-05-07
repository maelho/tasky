import '~/styles/globals.css'

import type { Metadata } from 'next'
import { recursive } from '~/fonts'
import { TRPCReactProvider } from '~/trpc/react'

import { ThemeProvider } from '~/components/theme-provider'
import { Toaster } from '~/components/ui/sonner'
import { SiteConfig } from '~/config/site'

export const metadata: Metadata = {
  title: {
    default: SiteConfig.title,
    template: `%s | ${SiteConfig.title}`,
  },
  description: SiteConfig.description,
  icons: [
    {
      url: '/tasky.svg',
      href: '/tasky.svg',
    },
  ],
  openGraph: {
    images: ['/tasky.png'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${recursive.variable}`} suppressHydrationWarning>
      <body className="overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
