import { login, verifyAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { password } = await request.json()
    
    // Cari admin di database (untuk sementara pakai username 'admin')
    const admins = await query('SELECT * FROM admins WHERE username = ?', ['admin'])
    
    if (admins.length === 0) {
      return NextResponse.json(
        { error: 'Admin tidak ditemukan' },
        { status: 401 }
      )
    }

    const admin = admins[0]
    
    // Cek password
    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Password salah' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    const cookieStore = await cookies()
    cookieStore.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'strict'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  return NextResponse.json({ success: true })
}

export async function GET() {
  const isAdmin = await verifyAdmin()
  return NextResponse.json({ isAdmin })
}