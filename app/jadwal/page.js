import { query } from '@/lib/db'
import TripCard from '@/components/TripCard'

export default async function JadwalPage({ searchParams }) {
  // Await searchParams karena di Next.js 16 berupa Promise
  const params = await searchParams
  const month = params?.month || ''
  
  let sql = 'SELECT * FROM trips ORDER BY departure_date ASC'
  let queryParams = []
  
  if (month) {
    sql = 'SELECT * FROM trips WHERE MONTH(departure_date) = ? ORDER BY departure_date ASC'
    queryParams = [month]
  }
  
  const trips = await query(sql, queryParams)

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="text-primary">Jadwal</span>{' '}
        <span className="text-secondary">Trip</span>
      </h1>

      {/* Filter Bulan */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <a
            href="/jadwal"
            className={`px-4 py-2 rounded-lg transition-all ${
              !month ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Semua
          </a>
          {months.map((m, index) => (
            <a
              key={index}
              href={`/jadwal?month=${index + 1}`}
              className={`px-4 py-2 rounded-lg transition-all ${
                month == (index + 1) ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {m}
            </a>
          ))}
        </div>
      </div>

      {/* Daftar Trip */}
      {trips.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">
          Tidak ada jadwal trip pada bulan ini
        </p>
      )}
    </div>
  )
}