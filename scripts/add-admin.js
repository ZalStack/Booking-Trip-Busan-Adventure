const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function addAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Fakhrizal2005',
    database: 'busan_adventure'
  })

  try {
    rl.question('Username: ', async (username) => {
      rl.question('Password: ', async (password) => {
        // Hash password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        // Simpan ke database
        await connection.execute(
          'INSERT INTO admins (username, password) VALUES (?, ?)',
          [username, hashedPassword]
        )
        
        console.log(`Admin ${username} berhasil ditambahkan!`)
        await connection.end()
        rl.close()
      })
    })
  } catch (error) {
    console.error('Error:', error)
    await connection.end()
    rl.close()
  }
}

addAdmin()