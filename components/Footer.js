import Link from 'next/link'
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-primary">Busan</span>
              <span className="text-secondary">Adventure</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Jelajahi keindahan Nusantara bersama kami. Pengalaman pendakian yang aman, nyaman, dan tak terlupakan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FiTwitter className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-secondary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/jadwal" className="text-gray-400 hover:text-secondary transition-colors">
                  Jadwal Trip
                </Link>
              </li>
              <li>
                <Link href="/testimoni" className="text-gray-400 hover:text-secondary transition-colors">
                  Testimoni
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-gray-400 hover:text-secondary transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-gray-400 hover:text-secondary transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="text-secondary mt-1" />
                <span className="text-gray-400">Jl. Pancawarna II No. 157, Kabupaten Bogor, Jawa Barat 16340, Indonesia</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="text-secondary" />
                <span className="text-gray-400">+62 821-1301-1609</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-secondary" />
                <span className="text-gray-400">busanadventurenusantara@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Newsletter</h4>
            <p className="text-gray-400 mb-3">
              Dapatkan info trip terbaru langsung di emailmu!
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email kamu"
                className="flex-1 px-3 py-2 rounded-l-lg focus:outline-none text-dark"
              />
              <button
                type="submit"
                className="bg-secondary px-4 py-2 rounded-r-lg hover:bg-opacity-80 transition-colors"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Busan Adventure Nusantara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}