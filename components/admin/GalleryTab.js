"use client";

import { useState } from "react";
import Pagination from "@/components/admin/Pagination";

export default function GalleryTab({
  galleries,
  onEdit,
  onDelete,
  onSubmit,
  formData,
  setFormData,
  showForm,
  setShowForm,
  editingGallery,
  uploading,
  onImageUpload,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Grid view, jadi lebih banyak per halaman

  // Fungsi untuk filter berdasarkan pencarian
  const filteredGalleries = galleries.filter((g) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      g.title?.toLowerCase().includes(searchLower) ||
      g.description?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredGalleries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGalleries = filteredGalleries.slice(startIndex, startIndex + itemsPerPage);

  // Reset ke halaman 1 saat search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Tombol Tambah Gallery */}
      <button
        onClick={() => {
          setShowForm(!showForm);
        }}
        className="btn-primary mb-6"
      >
        {showForm ? "Tutup Form" : "+ Tambah Gallery"}
      </button>

      {/* Form Tambah/Edit Gallery */}
      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingGallery ? "Edit Gallery" : "Tambah Gallery Baru"}
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Upload Image */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">
                Upload Gambar *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                disabled={uploading}
                className="w-full"
                required={!editingGallery}
              />
              {uploading && (
                <p className="text-sm text-primary mt-2">Uploading...</p>
              )}
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-32 w-auto object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Gambar sudah diupload
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Judul *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Contoh: Pendakian Gunung Rinjani 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Cerita singkat tentang foto ini..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tanggal Kegiatan *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <button type="submit" className="btn-primary">
              {editingGallery ? "Update Gallery" : "Simpan Gallery"}
            </button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari berdasarkan judul atau deskripsi..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Menampilkan {filteredGalleries.length} dari {galleries.length} gallery
        </p>
      </div>

      {/* Daftar Gallery */}
      <div className="card overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Daftar Gallery</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedGalleries.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>

                {item.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <p className="text-xs text-gray-500 mb-3">
                  📅{" "}
                  {new Date(item.date || item.created_at).toLocaleDateString(
                    "id-ID"
                  )}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-500 hover:text-blue-700 text-sm border border-blue-200 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {paginatedGalleries.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Tidak ada gallery ditemukan
          </p>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}