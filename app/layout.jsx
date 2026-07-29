import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://noteshub-beryl.vercel.app'),
  title: "NotesHub | Minimal Microblogging",
  description: "Share text-based notes, snippets, and short-form thoughts cleanly.",
  keywords: ["microblogging", "notes", "social media", "text sharing", "minimal", "thoughts", "snippets"],
  authors: [{ name: "NotesHub" }],
  creator: "NotesHub",
  publisher: "NotesHub",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://noteshub-beryl.vercel.app",
    siteName: "NotesHub",
    title: "NotesHub | Minimal Microblogging",
    description: "Share text-based notes, snippets, and short-form thoughts cleanly.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "NotesHub Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "NotesHub | Minimal Microblogging",
    description: "Share text-based notes, snippets, and short-form thoughts cleanly.",
    images: ["/android-chrome-512x512.png"],
    creator: "@noteshub"
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} bg-background text-text-primary min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
