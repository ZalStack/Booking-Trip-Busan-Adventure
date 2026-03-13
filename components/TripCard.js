'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatDate } from '@/utils/formatDate'

export default function TripCard({ trip }) {
  const getStatusBadge = () => {
    const percentage = (trip.available_slots / trip.quota) * 100
    
    if (trip.available_slots === 0) {
      return <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">❌ Closed</span>
    } else if (percentage <= 30) {
      return <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">⏳ Almost Full</span>
    } else {
      return <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">🔥 Open</span>
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={trip.poster || `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b`}
          alt={trip.mountain_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{trip.mountain_name}</h3>
        
        <p className="text-gray-600 mb-2">
          📅 {formatDate(trip.departure_date)} - {formatDate(trip.return_date)}
        </p>
        
        <p className="text-gray-600 mb-2">
          👥 Kuota Tersisa: {trip.available_slots}/{trip.quota}
        </p>
        
        <div className="mb-4">
          <p className="text-gray-500 line-through">
            Rp {trip.price_normal.toLocaleString()}
          </p>
          <p className="text-2xl font-bold text-primary">
            Rp {trip.price_share.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Share Cost</p>
        </div>
        
        <Link
          href={`/jadwal/${trip.id}`}
          className="btn-primary w-full text-center inline-block"
        >
          Lihat Detail
        </Link>
      </div>
    </motion.div>
  )
}