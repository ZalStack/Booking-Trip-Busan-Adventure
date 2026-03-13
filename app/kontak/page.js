'use client'

import { useState } from 'react'
import Button from '@/components/Button'
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiSend } from 'react-icons/fi'

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('Pesan berhasil dikirim! Kami akan segera merespon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        })
      } else {
        alert('Gagal mengirim pesan')
      }
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Ada pertanyaan? Kami siap membantu
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Info Kontak */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">
                  <span className="text-primary">Informasi</span>{' '}
                  <span className="text-secondary">Kontak</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <FiMapPin className="text-2xl text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Alamat</h3>
                      <p className="text-gray-600">
                        Jl. Pancawarna II No. 157, Kabupaten Bogor,<br />
                        Jawa Barat 16340, Indonesia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <FiPhone className="text-2xl text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Telepon / WhatsApp</h3>
                      <p className="text-gray-600">+62 821-1301-1609</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <FiMail className="text-2xl text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">info@busanadventure.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <FiInstagram className="text-2xl text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Instagram</h3>
                      <p className="text-gray-600">@busanadventure</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Maps */}
              <div className="card h-[300px] overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.9758723432165!2d106.72180377597373!3d-6.397110693593502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e8a77625acb1%3A0xe3ccb922d492885!2sJl.%20Pancawarna%20II%20No.157%2C%20Curug%2C%20Kec.%20Gn.%20Sindur%2C%20Kabupaten%20Bogor%2C%20Jawa%20Barat%2016340!5e0!3m2!1sid!2sid!4v1772653779803!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>

            {/* Form Kontak */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">
                <span className="text-primary">Kirim</span>{' '}
                <span className="text-secondary">Pesan</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="081234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pesan *
                  </label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Tulis pesan Anda..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={submitting}
                >
                  {submitting ? 'Mengirim...' : 'Kirim Pesan'}
                </Button>
              </form>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="text-center mt-12">
            <a
              href="https://wa.me/6282113011609"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <FiSend />
              <span>Chat via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}