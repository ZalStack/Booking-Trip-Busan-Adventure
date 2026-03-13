'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: '/', label: 'Beranda' },
    { href: '/jadwal', label: 'Jadwal Trip' },
    { href: '/gallery', label: 'Galeri Kegiatan', isNew: true },
    { href: '/testimoni', label: 'Testimoni' },
    { href: '/tentang', label: 'Tentang Kami' },
    { href: '/kontak', label: 'Kontak' },
  ]

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-primary">Busan</span>
            <span className="text-secondary">Adventure</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-dark hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2 text-dark hover:text-primary transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}