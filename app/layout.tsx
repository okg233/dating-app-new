import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '../components/Navbar'
import { AuthProvider } from '../components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Modern Dating App',
  description: 'Find your perfect match with our modern dating platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}