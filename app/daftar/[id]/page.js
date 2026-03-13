'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'
import Button from '@/components/Button'
import { motion, AnimatePresence } from 'framer-motion'

export default function DaftarPage() {
  const params = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    quantity: 1,
    payment_proof: null
  })
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const { id } = await params
        const res = await fetch(`/api/trips?id=${id}`)
        const data = await res.json()
        setTrip(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTrip()
  }, [params])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({...formData, payment_proof: file})
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    

    try {
      // Upload file dulu
      let paymentProofUrl = ''
      if (formData.payment_proof) {
        const fileData = new FormData()
        fileData.append('file', formData.payment_proof)
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: fileData
        })
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          paymentProofUrl = uploadData.url
        } else {
          throw new Error('Gagal upload file')
        }
      }

      // Simpan data peserta
      const { id } = await params
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          trip_id: id,
          payment_proof: paymentProofUrl,
          payment_date: new Date().toISOString()
        })
      })

      const data = await res.json()

      if (res.ok) {
        setBookingData({
          ...data,
          trip_name: trip.mountain_name,
          total_price: trip.price_share * formData.quantity,
          quantity: formData.quantity,
          date: trip.departure_date,
          name: formData.name
        })
        setShowModal(true)
      } else {
        alert(data.error || 'Pendaftaran gagal')
      }
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const sendToWhatsApp = () => {
    if (!bookingData) return
    
    const message = `Halo Admin Busan Adventure,

Saya *${bookingData.name}* telah melakukan pendaftaran dan pembayaran untuk trip:

🏔️ *${bookingData.trip_name}*
📅 Tanggal: ${new Date(bookingData.date).toLocaleDateString('id-ID')}
👥 Jumlah Peserta: ${bookingData.quantity} orang
💰 Total Pembayaran: Rp ${bookingData.total_price.toLocaleString()}

ID Booking: ${bookingData.booking_id}
Silahkan dicek bukti pembayarannya. Terima kasih!`

    const whatsappUrl = `https://wa.me/6282113011609?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) return <LoadingSpinner />

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Trip tidak ditemukan</h1>
      </div>
    )
  }

  const totalPrice = trip.price_share * formData.quantity

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="text-primary">Daftar</span>{' '}
          <span className="text-secondary">{trip.mountain_name}</span>
        </h1>

        {/* Info Ringkas Trip */}
        <div className="card mb-8">
          <h2 className="font-semibold mb-2">Informasi Trip:</h2>
          <p className="text-gray-600">Tanggal: {new Date(trip.departure_date).toLocaleDateString('id-ID')}</p>
          <p className="text-gray-600">Kuota Tersisa: {trip.available_slots}</p>
          <p className="text-gray-600">Harga per orang: Rp {trip.price_share.toLocaleString()}</p>
        </div>

        {/* Info Payment or DownPayment */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Informasi Rekening Pembayaran
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Bank BCA :</span>{" "}
              <span className="tracking-wide">7006486583</span>
            </p>

            <p>
              <span className="font-semibold">SeaBank :</span>{" "}
              <span className="tracking-wide">7006486583</span>
            </p>
          </div>

          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-sm text-red-600 font-medium">
              ⚠️ Rekening hanya atas nama <b>Ziky Biagi</b>.  
              Jika menggunakan nama lain, harap berhati-hati karena berpotensi penipuan.
            </span>
          </div>
        </div>

        {/* Form Pendaftaran */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">No. WhatsApp *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="081234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Alamat</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Jumlah Peserta *</label>
            <input
              type="number"
              required
              min="1"
              max={trip.available_slots}
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-gray-500 mt-1">Maksimal {trip.available_slots} orang</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Bukti Pembayaran *</label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-gray-500 mt-1">Format: JPG, PNG, GIF (Max 2MB)</p>
            {previewUrl && (
              <div className="mt-2">
                <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          {/* Total Harga */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Harga per orang:</span>
              <span>Rp {trip.price_share.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Jumlah peserta:</span>
              <span>{formData.quantity} orang</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-primary">Rp {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              fullWidth
            >
              Kembali
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              fullWidth
            >
              {submitting ? 'Memproses...' : 'Bayar & Daftar Sekarang'}
            </Button>
          </div>
        </form>
      </div>

      {/* Modal Konfirmasi */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-primary mb-4">Pendaftaran Berhasil! 🎉</h3>
              
              <div className="space-y-3 mb-6">
                <p className="text-gray-700">Terima kasih <span className="font-semibold">{bookingData?.name}</span> telah mendaftar!</p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Detail Pendaftaran:</p>
                  <p className="text-sm">ID Booking: <span className="font-mono">{bookingData?.booking_id}</span></p>
                  <p className="text-sm">Trip: {bookingData?.trip_name}</p>
                  <p className="text-sm">Tanggal: {new Date(bookingData?.date).toLocaleDateString('id-ID')}</p>
                  <p className="text-sm">Jumlah: {bookingData?.quantity} orang</p>
                  <p className="text-sm font-semibold text-primary">Total: Rp {bookingData?.total_price?.toLocaleString()}</p>
                </div>

                <p className="text-gray-700">Silahkan konfirmasi ke WhatsApp admin untuk mempercepat proses verifikasi.</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowModal(false)
                    router.push('/jadwal')
                  }}
                  fullWidth
                >
                  Nanti
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    sendToWhatsApp()
                    setShowModal(false)
                    router.push('/jadwal')
                  }}
                  fullWidth
                >
                  Kirim ke WhatsApp
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}