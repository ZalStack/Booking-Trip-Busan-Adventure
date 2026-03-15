import { query } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { verifyAdmin, getAdminInfo } from '@/lib/auth'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
export const runtime = "nodejs"

// GET: Ambil data admin
export async function GET() {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ambil info admin yang sedang login
    const adminInfo = await getAdminInfo()
    
    if (!adminInfo) {
      return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json([adminInfo]) // Balikan sebagai array untuk konsistensi
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Login admin
export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password required' },
        { status: 400 }
      )
    }

    // Cari admin berdasarkan username
    const admins = await query('SELECT * FROM admins WHERE username = ?', [username])

    if (admins.length === 0) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    const admin = admins[0]

    // Cek password
    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'strict'
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Login berhasil',
      username: admin.username 
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// PUT: Ganti password
export async function PUT(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Password lama dan baru required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password baru minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Ambil data admin dari token
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET)
    const adminId = decoded.id

    if (!adminId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Ambil admin dari database
    const admins = await query('SELECT * FROM admins WHERE id = ?', [adminId])

    if (admins.length === 0) {
      return NextResponse.json(
        { error: 'Admin tidak ditemukan' },
        { status: 404 }
      )
    }

    const admin = admins[0]

    // Cek password lama
    const isValid = await bcrypt.compare(currentPassword, admin.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Password lama salah' },
        { status: 401 }
      )
    }

    // Hash password baru
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, adminId])

    return NextResponse.json({ 
      success: true, 
      message: 'Password berhasil diubah' 
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}