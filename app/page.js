import HeroSlider from '@/components/HeroSlider'
import TripCard from '@/components/TripCard'
import TestimonialCard from '@/components/TestimonialCard'
import { query } from '@/lib/db'
import Link from 'next/link'
import { FiShield, FiUsers, FiDollarSign } from 'react-icons/fi'

export default async function Home() {
  const trips = await query(
    'SELECT * FROM trips WHERE departure_date >= CURDATE() ORDER BY departure_date ASC LIMIT 3'
  )
  
  const testimonials = await query(
    'SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 3'
  )

  const features = [
    {
      icon: <FiShield className="text-4xl text-primary" />,
      title: 'Safe',
      description: 'Keselamatan peserta adalah prioritas utama kami dengan perlengkapan standar'
    },
    {
      icon: <FiUsers className="text-4xl text-secondary" />,
      title: 'Professional Guide',
      description: 'Didampingi guide berpengalaman dan bersertifikasi'
    },
    {
      icon: <FiDollarSign className="text-4xl text-primary" />,
      title: 'Affordable',
      description: 'Harga terjangkau dengan fasilitas terbaik'
    }
  ]

  return (
    <>
      <HeroSlider />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-primary">Mengapa</span>{' '}
            <span className="text-secondary">Memilih Kami?</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jadwal Bulan Ini */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            <span className="text-primary">Jadwal</span>{' '}
            <span className="text-secondary">Bulan Ini</span>
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Segera daftarkan dirimu untuk petualangan seru!
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/jadwal" className="btn-primary inline-block">
              Lihat Semua Jadwal
            </Link>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            <span className="text-primary">Apa Kata</span>{' '}
            <span className="text-secondary">Mereka?</span>
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Pengalaman seru dari para petualang bersama Busan Adventure
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}