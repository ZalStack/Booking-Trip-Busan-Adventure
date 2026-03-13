import { query } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const galleries = await query('SELECT * FROM gallery ORDER BY date DESC, created_at DESC')
    return NextResponse.json(galleries)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    if (!data.title || !data.image) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO gallery (title, description, image, date) 
       VALUES (?, ?, ?, ?)`,
      [data.title, data.description || '', data.image, data.date || new Date()]
    )

    return NextResponse.json({
      success: true,
      message: 'Gallery berhasil ditambahkan',
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

export async function PUT(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 })
    }

    await query(
      `UPDATE gallery SET 
       title = ?, description = ?, image = ?, date = ?
       WHERE id = ?`,
      [data.title, data.description, data.image, data.date, data.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Gallery berhasil diupdate'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
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

    await query('DELETE FROM gallery WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Gallery berhasil dihapus'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}