import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import RootProvider from '@/components/providers/RootProvider';
import Cursor from '@/components/cursor/Cursor';
import Preloader from '@/components/preloader/Preloader';
import Nav from '@/components/nav/Nav';
import CommandPalette from '@/components/nav/CommandPalette';
import ParticleBackground from '@/components/background/ParticleBackgroundLoader';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-clash' });
const inter = Inter({ subsets: ['latin'], variable: '--font-montreal' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Vedant Yerne — Software Developer & AI/ML Engineer',
  description:
    'Portfolio of Vedant Yerne — Software Developer, AI/ML Engineer, Full Stack Developer & IoT Engineer. Building intelligent systems, immersive products, and AI-driven experiences.',
  keywords: [
    'Vedant Yerne',
    'Software Developer',
    'AI ML Engineer',
    'Full Stack Developer',
    'IoT Engineer',
    'Next.js',
    'Python',
    'React',
    'Portfolio',
  ],
  authors: [{ name: 'Vedant Yerne', url: 'https://linkedin.com/in/vedant-yerne-27040628b' }],
  creator: 'Vedant Yerne',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vedantyerne.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: 'Vedant Yerne — Software Developer & AI/ML Engineer',
    description:
      'Building intelligent systems, immersive products, and AI-driven experiences.',
    siteName: 'Vedant Yerne Portfolio',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Vedant Yerne Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vedant Yerne — Software Developer & AI/ML Engineer',
    description: 'Building intelligent systems, immersive products, and AI-driven experiences.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Vedant Yerne',
              url: 'https://vedantyerne.vercel.app',
              email: 'vedantyerne1@gmail.com',
              sameAs: [
                'https://linkedin.com/in/vedant-yerne-27040628b',
                'https://github.com/vedantyerne1-art',
              ],
              jobTitle: 'Software Developer',
              knowsAbout: ['AI', 'Machine Learning', 'Full Stack Development', 'IoT'],
              alumniOf: {
                '@type': 'EducationalOrganization',
                name: 'Yeshwantrao Chavan College of Engineering',
              },
            }),
          }}
        />
      </head>
      <body>
        <RootProvider>
          {/* Global particle background — sits behind everything */}
          <ParticleBackground />
          <Preloader />
          <Cursor />
          <Nav />
          <CommandPalette />
          <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
        </RootProvider>
      </body>
    </html>
  );
}
