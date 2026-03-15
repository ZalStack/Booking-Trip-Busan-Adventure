import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyAdmin } from "@/lib/auth";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: "dqzucajvh",
  api_key: "487884315362256",
  api_secret: "l85kIRnCKT48_r1nCKdvgztEMqY",
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type") || "payment";

    if (!file) return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });

    const allowedTypes = ["image/jpeg","image/jpg","image/png","image/gif","image/webp"];
    if (!allowedTypes.includes(file.type)) return NextResponse.json({ error: "Tipe file tidak valid" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });

    if (type === "poster" || type === "gallery") {
      const isAdmin = await verifyAdmin();
      if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const folderMap = { payment: "payments", poster: "posters", gallery: "gallery" };

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderMap[type] || "others", resource_type: "image", public_id: `${type}_${Date.now()}` },
        (error, res) => { if (error) reject(error); else resolve(res); }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal upload file: " + error.message }, { status: 500 });
  }
}