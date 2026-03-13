'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiCalendar, FiImage } from 'react-icons/fi'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    try {
      const res = await fetch('/api/gallery')
      const data = await res.json()
      setGalleries(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Galeri Kegiatan
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Dokumentasi petualangan seru bersama Busan Adventure
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-12">
        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleries.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative h-48 w-full overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="mr-2" />
                    {new Date(item.date || item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada gallery</p>
          </div>
        )}
      </div>

      {/* Modal Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-4xl w-full bg-white rounded-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-[60vh] w-full">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-contain bg-black"
              />
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
              
              {selectedImage.description && (
                <p className="text-gray-600 mb-4">{selectedImage.description}</p>
              )}
              
              <div className="flex items-center text-gray-500">
                <FiCalendar className="mr-2" />
                {new Date(selectedImage.date || selectedImage.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}