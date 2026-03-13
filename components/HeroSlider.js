'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Link from 'next/link'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    title: 'Jelajahi Keindahan Nusantara',
    subtitle: 'Bersama Busan Adventure'
  },
  {
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99',
    title: 'Pengalaman Tak Terlupakan',
    subtitle: 'Dengan Guide Profesional'
  },
  {
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    title: 'Safety First',
    subtitle: 'Keselamatan Prioritas Utama'
  }
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setCurrent((prev) => (prev + 1) % slides.length)
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="relative h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[current].image})`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
          
          <div className="relative h-full flex items-center justify-center text-center">
            <div className="text-white px-4">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                {slides[current].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl mb-8"
              >
                {slides[current].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-x-4"
              >
                <Link href="/jadwal" className="btn-primary inline-block">
                  Lihat Jadwal Trip
                </Link>
                <Link href="/jadwal" className="btn-secondary inline-block">
                  Daftar Sekarang
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
      >
        <FiChevronLeft className="text-2xl" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
      >
        <FiChevronRight className="text-2xl" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? 'bg-primary w-6' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}