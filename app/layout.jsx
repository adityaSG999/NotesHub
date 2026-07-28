import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NotesHub | Minimal Microblogging",
  description: "Share text-based notes, snippets, and short-form thoughts cleanly.",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
