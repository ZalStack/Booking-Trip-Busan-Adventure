import { query } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'
export const runtime = "nodejs";

export async function GET() {
  try {
    const testimonials = await query('SELECT * FROM testimonials ORDER BY created_at DESC')
    return NextResponse.json(testimonials)
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
    const data = await request.json()
    
    // Validasi
    if (!data.participant_name || !data.rating || !data.comment) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Pastikan tidak ada undefined values
    const participant_name = data.participant_name || ''
    const participant_photo = data.participant_photo || null
    const rating = data.rating || 5
    const comment = data.comment || ''
    const trip_name = data.trip_name || null

    const result = await query(
      `INSERT INTO testimonials 
       (participant_name, participant_photo, rating, comment, trip_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [participant_name, participant_photo, rating, comment, trip_name]
    )

    return NextResponse.json({
      success: true,
      message: 'Testimoni berhasil dikirim',
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

    await query('DELETE FROM testimonials WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Testimoni berhasil dihapus'
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}