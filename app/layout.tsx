import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { CursorGlow } from '@/components/ui/cursor-glow'
import FaceGestureTracker from '@/components/ui/mediapipe-hand-tracker'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  title: "ibrahim ansari — portfolio",
  description: 'about, experience, projects, research',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <CursorGlow />
               <FaceGestureTracker />
        {children}
      </body>
    </html>
  )
}
