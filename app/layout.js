import { Poppins } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata = {
  title: 'Busan Adventure Nusantara',
  description: 'Jelajahi Keindahan Nusantara Bersama Busan Adventure',
}

export default function RootLayout({ children }) {
  // Deteksi apakah ini halaman admin
  const isAdminPage = typeof window !== 'undefined' 
    ? window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/admin-login')
    : false;

  return (
    <html lang="id">
      <body className={poppins.className}>
        {/* Navbar hanya muncul jika BUKAN halaman admin */}
        {!isAdminPage && <Navbar />}
        
        {/* Main content dengan padding top hanya jika ada navbar */}
        <main className={!isAdminPage ? "min-h-screen pt-16" : "min-h-screen"}>
          {children}
        </main>
        
        {/* Footer hanya muncul jika BUKAN halaman admin */}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  )
}