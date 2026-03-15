import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAdmin } from "@/lib/auth";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type") || "payment"; // 'payment' atau 'poster'

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
    }

    // Validasi tipe file
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak valid. Hanya JPG, PNG, GIF, WEBP" },
        { status: 400 },
      );
    }

    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 2MB" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const ext = path.extname(file.name);
    const filename = `${type}_${timestamp}_${random}${ext}`;

    // Tentukan folder berdasarkan tipe
    let folder = "payments";
    if (type === "poster") {
      // Untuk poster, cek admin
      const isAdmin = await verifyAdmin();
      if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      folder = "posters";
    } else if (type === "gallery") {
      // Tambahkan ini
      // Untuk gallery, cek admin
      const isAdmin = await verifyAdmin();
      if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      folder = "gallery";
    }

    // Path penyimpanan
    const uploadDir = path.join(process.cwd(), "public/uploads", folder);
    const filepath = path.join(uploadDir, filename);

    // Buat direktori jika belum ada
    await mkdir(uploadDir, { recursive: true });

    // Simpan file
    await writeFile(filepath, buffer);

    // Return URL file
    return NextResponse.json({
      success: true,
      url: `/uploads/${folder}/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal upload file: " + error.message },
      { status: 500 },
    );
  }
}
