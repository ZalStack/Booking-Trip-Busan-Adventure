import fs from 'fs'
import path from 'path'

export async function uploadFile(file, folder = 'uploads') {
  return new Promise((resolve, reject) => {
    try {
      // Validasi file
      if (!file) {
        reject(new Error('Tidak ada file'))
        return
      }

      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        reject(new Error('Tipe file tidak valid. Hanya JPG, PNG, GIF'))
        return
      }

      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        reject(new Error('Ukuran file maksimal 2MB'))
        return
      }

      // Generate unique filename
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 1000)
      const extension = path.extname(file.name)
      const filename = `${timestamp}_${random}${extension}`
      
      // Path untuk menyimpan file
      const uploadDir = path.join(process.cwd(), 'public', folder)
      const filepath = path.join(uploadDir, filename)
      
      // Buat folder jika belum ada
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      // Convert file to buffer (perbaikan di sini)
      file.arrayBuffer().then(buffer => {
        const bufferData = Buffer.from(buffer)
        
        // Write file
        fs.writeFileSync(filepath, bufferData)
        
        // Return path yang bisa diakses dari browser
        resolve(`/${folder}/${filename}`)
      }).catch(error => {
        reject(error)
      })
      
    } catch (error) {
      reject(error)
    }
  })
}

export function deleteFile(filePath) {
  try {
    if (!filePath) return
    
    const fullPath = path.join(process.cwd(), 'public', filePath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      return true
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}