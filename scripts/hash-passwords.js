// Jalankan dengan: node scripts/hash-passwords.js
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

async function hashPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fakhrizal2005',
    database: 'busan_adventure'
  })

  try {
    // Ambil semua admin
    const [admins] = await connection.execute('SELECT * FROM admins')
    
    for (const admin of admins) {
      // Cek apakah password sudah di-hash (biasanya panjangnya 60 karakter)
      if (admin.password.length < 60) {
        console.log(`Hashing password untuk admin: ${admin.username}`)
        
        // Hash password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(admin.password, saltRounds)
        
        // Update
        await connection.execute(
          'UPDATE admins SET password = ? WHERE id = ?',
          [hashedPassword, admin.id]
        )
        
        console.log(`Password untuk ${admin.username} berhasil di-hash`)
      } else {
        console.log(`Password untuk ${admin.username} sudah di-hash`)
      }
    }
    
    console.log('Selesai!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await connection.end()
  }
}

hashPasswords()