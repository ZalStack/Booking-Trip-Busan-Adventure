import { query } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

// GET: Ambil semua peserta (admin only)
export async function GET(request) {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const trip_id = searchParams.get('trip_id')

    let sql = `
      SELECT p.*, t.mountain_name as trip_name 
      FROM participants p
      LEFT JOIN trips t ON p.trip_id = t.id
      ORDER BY p.booking_date DESC
    `
    let params = []

    if (trip_id) {
      sql = `
        SELECT p.*, t.mountain_name as trip_name 
        FROM participants p
        LEFT JOIN trips t ON p.trip_id = t.id
        WHERE p.trip_id = ? 
        ORDER BY p.booking_date DESC
      `
      params = [trip_id]
    }

    const participants = await query(sql, params)
    return NextResponse.json(participants)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Tambah peserta baru (public)
export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validasi data
    if (!data.name || !data.email || !data.phone || !data.trip_id) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Cek ketersediaan kuota
    const trips = await query(
      'SELECT available_slots, price_share, mountain_name FROM trips WHERE id = ?',
      [data.trip_id]
    )
    
    if (trips.length === 0) {
      return NextResponse.json(
        { error: 'Trip tidak ditemukan' },
        { status: 404 }
      )
    }

    const trip = trips[0]
    
    if (trip.available_slots < data.quantity) {
      return NextResponse.json(
        { error: 'Kuota tidak mencukupi' },
        { status: 400 }
      )
    }

    // Hitung total harga
    const total_price = trip.price_share * data.quantity

    // FORMAT TANGGAL YANG BENAR UNTUK MYSQL
    // Ubah dari ISO string ke format MySQL (YYYY-MM-DD HH:MM:SS)
    let paymentDate = null
    if (data.payment_date) {
      const date = new Date(data.payment_date)
      // Format: YYYY-MM-DD HH:MM:SS
      paymentDate = date.getFullYear() + '-' + 
                    String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(date.getDate()).padStart(2, '0') + ' ' + 
                    String(date.getHours()).padStart(2, '0') + ':' + 
                    String(date.getMinutes()).padStart(2, '0') + ':' + 
                    String(date.getSeconds()).padStart(2, '0')
    }

    // Simpan peserta
    const result = await query(
      `INSERT INTO participants 
       (trip_id, name, email, phone, address, quantity, total_price, payment_proof, payment_date, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        data.trip_id, 
        data.name || '', 
        data.email || '', 
        data.phone || '', 
        data.address || '', 
        data.quantity || 1, 
        total_price, 
        data.payment_proof || null, 
        paymentDate, 
      ]
    )

    // Update kuota tersisa
    await query(
      'UPDATE trips SET available_slots = available_slots - ? WHERE id = ?',
      [data.quantity, data.trip_id]
    )

    // Generate booking ID
    const booking_id = 'BA' + Date.now() + result.insertId

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil',
      booking_id: booking_id,
      participant_id: result.insertId
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server: ' + error.message },
      { status: 500 }
    )
  }
}

// PUT: Update status pembayaran (admin only)
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
      'UPDATE participants SET payment_status = ? WHERE id = ?',
      [data.payment_status, data.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Status pembayaran berhasil diupdate'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE: Hapus/blacklist peserta (admin only)
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

    // Ambil data peserta untuk mengembalikan kuota
    const participants = await query(
      'SELECT trip_id, quantity FROM participants WHERE id = ?',
      [id]
    )

    if (participants.length > 0) {
      const participant = participants[0]
      // Kembalikan kuota
      await query(
        'UPDATE trips SET available_slots = available_slots + ? WHERE id = ?',
        [participant.quantity, participant.trip_id]
      )
    }

    // Hapus peserta
    await query('DELETE FROM participants WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Peserta berhasil dihapus'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}