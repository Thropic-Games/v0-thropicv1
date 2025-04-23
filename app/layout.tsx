import type React from "react"
import type { Metadata } from "next"
import { Barlow_Condensed } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FirebaseProvider } from "@/contexts/firebase-context"

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-barlow-condensed",
})

export const metadata: Metadata = {
  title: "Thropic Games - Games for Good",
  description: "Play games and support charitable causes",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${barlowCondensed.className} ${barlowCondensed.variable} bg-warm-gray h-full p-0 sm:p-2 md:p-4 lg:p-6 flex items-center justify-center`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <FirebaseProvider>
            <div className="w-full max-w-[1240px] h-[calc(100vh-theme(spacing.4))] sm:h-[calc(100vh-theme(spacing.4))] md:h-[calc(100vh-theme(spacing.8))] lg:h-[calc(100vh-theme(spacing.12))] bg-black rounded-none sm:rounded-xl overflow-hidden shadow-2xl">
              {children}
            </div>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
