import { query } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiCalendar, FiUsers, FiDollarSign, FiCheck, FiX } from 'react-icons/fi'
import { formatDate } from '@/utils/formatDate'

export default async function DetailPage({ params }) {
  // Await params karena di Next.js 16 berupa Promise
  const { id } = await params
  
  // Validasi id
  if (!id) {
    notFound()
  }
  
  const trips = await query('SELECT * FROM trips WHERE id = ?', [id])
  
  if (trips.length === 0) {
    notFound()
  }
  
  const trip = trips[0]
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Poster */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-8">
          <img
            src={trip.poster || `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b`}
            alt={trip.mountain_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <h1 className="absolute bottom-8 left-8 text-4xl font-bold text-white">
            {trip.mountain_name}
          </h1>
        </div>

        {/* Info Cepat */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <FiCalendar className="text-3xl text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-500">Tanggal</p>
            <p className="font-semibold">{formatDate(trip.departure_date)}</p>
          </div>
          
          <div className="card text-center">
            <FiUsers className="text-3xl text-secondary mx-auto mb-2" />
            <p className="text-sm text-gray-500">Kuota</p>
            <p className="font-semibold">{trip.available_slots}/{trip.quota} Tersisa</p>
          </div>
          
          <div className="card text-center">
            <FiDollarSign className="text-3xl text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-500">Harga Normal</p>
            <p className="font-semibold">Rp {trip.price_normal.toLocaleString()}</p>
          </div>
          
          <div className="card text-center">
            <FiDollarSign className="text-3xl text-secondary mx-auto mb-2" />
            <p className="text-sm text-gray-500">Share Cost</p>
            <p className="font-semibold text-primary">Rp {trip.price_share.toLocaleString()}</p>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Deskripsi</h2>
          <p className="text-gray-600">{trip.description}</p>
        </div>

        {/* Itinerary */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
          <div className="space-y-2">
            {trip.itinerary?.split('\n').map((item, index) => (
              <p key={index} className="text-gray-600">{item}</p>
            ))}
          </div>
        </div>

        {/* Include & Exclude */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FiCheck className="text-green-500 mr-2" /> Include
            </h3>
            <div className="space-y-2">
              {trip.inclusions?.split(',').map((item, index) => (
                <p key={index} className="text-gray-600">✅ {item.trim()}</p>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FiX className="text-red-500 mr-2" /> Exclude
            </h3>
            <div className="space-y-2">
              {trip.exclusions?.split(',').map((item, index) => (
                <p key={index} className="text-gray-600">❌ {item.trim()}</p>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href={`/daftar/${trip.id}`}
            className="btn-primary text-center px-8 py-3 text-lg"
          >
            Daftar Sekarang
          </Link>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-center px-8 py-3 text-lg"
          >
            Hubungi Admin
          </a>
        </div>
      </div>
    </div>
  )
}