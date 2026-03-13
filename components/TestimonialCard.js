'use client'

import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4">
          {testimonial.participant_photo ? (
            <img
              src={testimonial.participant_photo}
              alt={testimonial.participant_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
              {testimonial.participant_name?.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-semibold">{testimonial.participant_name}</h4>
          <p className="text-sm text-gray-500">{testimonial.trip_name}</p>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`text-xl ${
              i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-600 italic">"{testimonial.comment}"</p>
    </motion.div>
  )
}