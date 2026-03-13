'use client'

import { useState, useEffect } from 'react'

export default function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [adminInfo, setAdminInfo] = useState(null)
  const [loadingInfo, setLoadingInfo] = useState(true)

  useEffect(() => {
    fetchAdminInfo()
  }, [])

  const fetchAdminInfo = async () => {
    setLoadingInfo(true)
    try {
      const res = await fetch('/api/admin')
      if (res.ok) {
        const data = await res.json()
        // API mengembalikan array, ambil yang pertama
        setAdminInfo(Array.isArray(data) ? data[0] : data)
      } else {
        console.error('Gagal mengambil data admin')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingInfo(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    // Validasi
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Semua field harus diisi' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Password berhasil diubah!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        
        // Refresh info admin
        fetchAdminInfo()
      } else {
        setMessage({ type: 'error', text: data.error || '❌ Gagal mengubah password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Terjadi kesalahan server' })
    } finally {
      setLoading(false)
    }
  }

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          <span className="text-primary">Pengaturan</span>{' '}
          <span className="text-secondary">Admin</span>
        </h2>
      </div>

      {/* Info Admin Card */}
      <div className="card bg-gradient-to-r from-primary/5 to-secondary/5">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="bg-primary text-white p-2 rounded-lg mr-3">👤</span>
          Informasi Admin
        </h3>
        
        {loadingInfo ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : adminInfo ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-500 w-24">Username</span>
                <span className="font-medium">: {adminInfo.username || 'admin'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-24">ID Admin</span>
                <span className="font-medium">: {adminInfo.id || '-'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-500 w-24">Terdaftar</span>
                <span className="font-medium">: {formatDate(adminInfo.created_at)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 w-24">Status</span>
                <span className="font-medium">: 
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Aktif
                  </span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-2">Tidak dapat memuat data admin</p>
        )}
      </div>

      {/* Ganti Password Card */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="bg-secondary text-white p-2 rounded-lg mr-3">🔐</span>
          Ganti Password
        </h3>

        {/* Alert Message */}
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              <span className="mr-2">{message.type === 'success' ? '✅' : '❌'}</span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
          {/* Password Lama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Saat Ini <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Masukkan password lama"
              disabled={loading}
            />
          </div>

          {/* Password Baru */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Baru <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Minimal 6 karakter"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Gunakan kombinasi huruf dan angka untuk keamanan lebih
            </p>
          </div>

          {/* Konfirmasi Password Baru */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password Baru <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                confirmPassword && newPassword !== confirmPassword 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300'
              }`}
              placeholder="Ketik ulang password baru"
              disabled={loading}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                ⚠️ Password tidak cocok
              </p>
            )}
          </div>

          {/* Tombol Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || (confirmPassword && newPassword !== confirmPassword)}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengubah Password...
                </span>
              ) : (
                'Ubah Password'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Informasi Tambahan */}
      <div className="text-xs text-gray-400 text-center border-t pt-4">
        <p>Terakhir login: {adminInfo ? formatDate(adminInfo.updated_at) : '-'}</p>
        <p className="mt-1">IP Address: Tidak tersedia</p>
      </div>
    </div>
  )
}