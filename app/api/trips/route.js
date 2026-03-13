import { query } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      const trips = await query('SELECT * FROM trips WHERE id = ?', [id])
      return NextResponse.json(trips[0] || null)
    }
    
    const trips = await query('SELECT * FROM trips ORDER BY departure_date ASC')
    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const data = await request.json()
    
    // Validasi data required
    if (!data.mountain_name || !data.departure_date || !data.return_date) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }
    
    const result = await query(
      `INSERT INTO trips 
       (mountain_name, description, departure_date, return_date, price_normal, 
        price_share, quota, available_slots, itinerary, inclusions, exclusions, poster, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.mountain_name || '',
        data.description || '',
        data.departure_date,
        data.return_date,
        data.price_normal || 0,
        data.price_share || 0,
        data.quota || 0,
        data.available_slots || data.quota || 0,
        data.itinerary || '',
        data.inclusions || '',
        data.exclusions || '',
        data.poster || null,
        data.status || 'open'
      ]
    )
    
    return NextResponse.json({ 
      message: 'Trip berhasil ditambahkan',
      id: result.insertId 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
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
      `UPDATE trips SET 
       mountain_name = ?, description = ?, departure_date = ?, 
       return_date = ?, price_normal = ?, price_share = ?, 
       quota = ?, available_slots = ?, itinerary = ?, 
       inclusions = ?, exclusions = ?, poster = ?, status = ?
       WHERE id = ?`,
      [
        data.mountain_name || '',
        data.description || '',
        data.departure_date,
        data.return_date,
        data.price_normal || 0,
        data.price_share || 0,
        data.quota || 0,
        data.available_slots || data.quota || 0,
        data.itinerary || '',
        data.inclusions || '',
        data.exclusions || '',
        data.poster || null,
        data.status || 'open',
        data.id
      ]
    )
    
    return NextResponse.json({ message: 'Trip berhasil diupdate' })
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
    
    // Hapus trip
    await query('DELETE FROM trips WHERE id = ?', [id])
    
    return NextResponse.json({ 
      success: true,
      message: 'Trip berhasil dihapus' 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}