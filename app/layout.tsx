import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import FaceGestureTracker from '@/components/ui/mediapipe-hand-tracker'
import MusicPlayer from '@/components/ui/music-player'
import { MusicProvider } from '@/contexts/MusicContext'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  title: "ibrahim ansari — portfolio",
  description: 'about, experience, projects, research',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <MusicProvider>
          <FaceGestureTracker />
          <MusicPlayer />
          <audio id="global-audio" style={{ display: 'none' }} />
          {children}
        </MusicProvider>
      </body>
    </html>
  )
}
