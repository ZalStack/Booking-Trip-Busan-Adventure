import { FiShield, FiUsers, FiAward, FiHeart } from 'react-icons/fi'

export default function TentangPage() {
  const guides = [
    {
      name: 'Ahmad Rizki',
      role: 'Lead Guide',
      experience: '10+ tahun',
      image: 'https://images.unsplash.com/photo-1566492031773-4fbd0e5331a7'
    },
    {
      name: 'Budi Santoso',
      role: 'Senior Guide',
      experience: '8 tahun',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    },
    {
      name: 'Citra Dewi',
      role: 'Guide',
      experience: '5 tahun',
      image: 'https://images.unsplash.com/photo-1494790108777-3f1db9f6a6e6'
    }
  ]

  const certifications = [
    'Sertifikasi Guide Gunung (WANAGIRI)',
    'Sertifikat Pertolongan Pertama (PMI)',
    'Lisensi Pemandu Wisata Alam',
    'Sertifikasi Survival Training'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tentang Busan Adventure
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Mitra petualangan terpercaya sejak 2015
          </p>
        </div>
      </section>

      {/* Sejarah */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-primary">Sejarah</span>{' '}
              <span className="text-secondary">Kami</span>
            </h2>
            <div className="card">
              <p className="text-gray-600 mb-4">
                Busan Adventure Nusantara didirikan pada tahun 2015 oleh sekelompok pecinta alam 
                yang memiliki visi untuk memperkenalkan keindahan gunung-gunung di Indonesia 
                kepada masyarakat luas.
              </p>
              <p className="text-gray-600 mb-4">
                Berawal dari komunitas kecil pendaki, kami berkembang menjadi penyedia jasa 
                open trip pendakian profesional yang telah melayani ribuan peserta dari 
                berbagai daerah.
              </p>
              <p className="text-gray-600">
                Hingga saat ini, kami telah berhasil membawa lebih dari 5000 peserta 
                menikmati keindahan puncak-puncak gunung di Nusantara dengan aman dan nyaman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-2xl font-bold text-primary mb-4">Visi</h3>
              <p className="text-gray-600">
                Menjadi penyedia jasa open trip pendakian terdepan di Indonesia yang 
                mengutamakan keselamatan, kenyamanan, dan kepuasan peserta.
              </p>
            </div>
            <div className="card">
              <h3 className="text-2xl font-bold text-secondary mb-4">Misi</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Menyediakan layanan pendakian yang aman dan profesional</li>
                <li>✓ Mengembangkan potensi wisata gunung di Indonesia</li>
                <li>✓ Membangun komunitas pecinta alam yang bertanggung jawab</li>
                <li>✓ Memberikan pengalaman petualangan yang tak terlupakan</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tim Guide */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            <span className="text-primary">Tim</span>{' '}
            <span className="text-secondary">Guide Profesional</span>
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Didampingi guide berpengalaman dan bersertifikasi
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {guides.map((guide, index) => (
              <div key={index} className="card text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{guide.name}</h3>
                <p className="text-primary font-medium mb-2">{guide.role}</p>
                <p className="text-gray-500">Pengalaman {guide.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sertifikasi */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-primary">Sertifikasi</span>{' '}
              <span className="text-secondary">& Lisensi</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="card flex items-center space-x-3">
                  <FiAward className="text-3xl text-primary" />
                  <span className="text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Komitmen Safety First */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-primary">Safety</span>{' '}
              <span className="text-secondary">First</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center">
                <FiShield className="text-5xl text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Peralatan Standar</h3>
                <p className="text-gray-600">Menggunakan peralatan safety yang teruji dan terstandar</p>
              </div>
              
              <div className="card text-center">
                <FiUsers className="text-5xl text-secondary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Rasio Guide</h3>
                <p className="text-gray-600">1 guide untuk 5 peserta untuk pengawasan maksimal</p>
              </div>
              
              <div className="card text-center">
                <FiHeart className="text-5xl text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Asuransi</h3>
                <p className="text-gray-600">Semua peserta dilindungi asuransi kecelakaan diri</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}