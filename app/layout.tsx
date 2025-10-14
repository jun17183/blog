import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import SessionProvider from '@/components/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'jun17183 blog',
  description: 'Next.js로 만든 개인 블로그',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={cn(inter.className, 'antialiased')}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}