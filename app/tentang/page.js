import { FiShield, FiUsers, FiAward, FiHeart } from 'react-icons/fi'

export default function TentangPage() {
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
            <div className="card text-justify">
              <p className="text-gray-600 mb-4">
                Busan Adventure Nusantara didirikan pada tahun 2010 oleh sekelompok pecinta alam 
                yang memiliki visi untuk memperkenalkan keindahan gunung-gunung di Indonesia 
                kepada masyarakat luas.
              </p>
              <p className="text-gray-600 mb-4">
                Berawal dari komunitas kecil pendaki, kami berkembang menjadi penyedia jasa 
                open trip pendakian profesional yang telah melayani ratusan peserta dari 
                berbagai daerah.
              </p>
              <p className="text-gray-600">
                Hingga saat ini, kami telah berhasil membawa peserta trip 
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