'use client'

import { useState, useEffect } from 'react'
import TestimonialCard from '@/components/TestimonialCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Button from '@/components/Button'
import { motion } from 'framer-motion'

export default function TestimoniPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    participant_name: '',
    rating: 5,
    comment: '',
    trip_name: ''
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      setTestimonials(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Terimakasih sudah mengirim testimoni anda!')
        setShowForm(false)
        setFormData({
          participant_name: '',
          rating: 5,
          comment: '',
          trip_name: ''
        })
        fetchTestimonials() // Refresh testimoni
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-primary">Testimoni</span>{' '}
          <span className="text-secondary">Peserta</span>
        </h1>
        <p className="text-gray-600">Apa kata mereka setelah berpetualang bersama kami</p>
      </div>

      {/* Tombol Tambah Testimoni */}
      <div className="text-center mb-8">
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
        >
          {showForm ? 'Tutup Form' : 'Tulis Testimoni'}
        </Button>
      </div>

      {/* Form Testimoni */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <form onSubmit={handleSubmit} className="card">
            <h2 className="text-xl font-bold mb-4">Bagikan Pengalamanmu</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.participant_name}
                  onChange={(e) => setFormData({...formData, participant_name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nama Gunung</label>
                <input
                  type="text"
                  value={formData.trip_name}
                  onChange={(e) => setFormData({...formData, trip_name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Contoh: Gunung Rinjani"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rating *</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded-lg"
                >
                  {[5,4,3,2,1].map(num => (
                    <option key={num} value={num}>{num} Bintang</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Komentar *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ceritakan pengalamanmu..."
                />
              </div>

              <Button type="submit" variant="primary" fullWidth>
                Kirim Testimoni
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Daftar Testimoni */}
      {testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">
          Belum ada testimoni
        </p>
      )}
    </div>
  )
}