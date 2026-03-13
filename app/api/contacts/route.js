import { query } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validasi
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    const result = await query(
      'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [data.name, data.email, data.phone, data.message]
    )

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim',
      id: result.insertId
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const contacts = await query('SELECT * FROM contacts ORDER BY created_at DESC')
    return NextResponse.json(contacts)

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    await query(
      'UPDATE contacts SET is_read = ? WHERE id = ?',
      [data.is_read, data.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Status pesan berhasil diupdate'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 })
    }

    await query('DELETE FROM contacts WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dihapus'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}