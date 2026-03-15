import Link from 'next/link'
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Company Info - Full width on mobile, column 1 on desktop */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold mb-4">
              <span className="text-primary">Busan</span>
              <span className="text-secondary">Adventure</span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto md:mx-0">
              Jelajahi keindahan Nusantara bersama kami. Pengalaman pendakian yang aman, nyaman, dan tak terlupakan.
            </p>
            <div className="flex justify-center md:justify-start space-x-5">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <FiInstagram className="text-2xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <FiFacebook className="text-2xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <FiTwitter className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links - Centered on mobile, left aligned on desktop */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6 text-primary relative inline-block md:block">
              Quick Links
              <span className="absolute -bottom-2 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-12 h-0.5 bg-secondary"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/jadwal", label: "Jadwal Trip" },
                { href: "/testimoni", label: "Testimoni" },
                { href: "/tentang", label: "Tentang Kami" },
                { href: "/kontak", label: "Kontak" }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-secondary transition-colors duration-300 inline-block hover:translate-x-0 md:hover:translate-x-2 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Full width on mobile, spans 2 columns on tablet, column 3-4 on desktop */}
          <div className="text-center md:text-left lg:col-span-2">
            <h4 className="text-lg font-semibold mb-6 text-primary relative inline-block md:block">
              Kontak
              <span className="absolute -bottom-2 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-12 h-0.5 bg-secondary"></span>
            </h4>
            <ul className="space-y-4 max-w-2xl mx-auto md:mx-0">
              <li className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex-shrink-0">
                  <FiMapPin className="text-secondary text-xl" />
                </div>
                <span className="text-gray-400 text-center sm:text-left">
                  Jl. Pancawarna II No. 157, Kabupaten Bogor, Jawa Barat 16340, Indonesia
                </span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex-shrink-0">
                  <FiPhone className="text-secondary text-xl" />
                </div>
                <span className="text-gray-400">+62 821-1301-1609</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex-shrink-0">
                  <FiMail className="text-secondary text-xl" />
                </div>
                <span className="text-gray-400 break-all">busanadventurenusantara@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright - With top border */}
        <div className="border-t border-gray-700/60 pt-8">
          <p className="text-gray-400 text-center text-sm sm:text-base">
            © {new Date().getFullYear()} Busan Adventure Nusantara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}