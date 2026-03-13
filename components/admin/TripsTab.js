"use client";

import { useState } from "react";
import Pagination from "@/components/admin/Pagination";

export default function TripsTab({
  trips,
  onEdit,
  onDelete,
  onSubmit,
  formData,
  setFormData,
  showForm,
  setShowForm,
  editingTrip,
  uploading,
  onPosterUpload,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return (
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
            Open
          </span>
        );
      case "almost_full":
        return (
          <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
            Almost Full
          </span>
        );
      case "closed":
        return (
          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
            Closed
          </span>
        );
      default:
        return (
          <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
            {status}
          </span>
        );
    }
  };

  // Fungsi untuk filter berdasarkan pencarian
  const filteredTrips = trips.filter((trip) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      trip.mountain_name?.toLowerCase().includes(searchLower) ||
      trip.description?.toLowerCase().includes(searchLower) ||
      trip.status?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTrips = filteredTrips.slice(startIndex, startIndex + itemsPerPage);

  // Reset ke halaman 1 saat search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const updateStatusBasedOnQuota = (quota, availableSlots) => {
    if (availableSlots === 0) return "closed";
    const percentage = (availableSlots / quota) * 100;
    if (percentage <= 30) return "almost_full";
    return "open";
  };

  return (
    <>
      {/* Tombol Tambah Trip */}
      <button
        onClick={() => {
          setShowForm(!showForm);
        }}
        className="btn-primary mb-6"
      >
        {showForm ? "Tutup Form" : "+ Tambah Trip"}
      </button>

      {/* Form Tambah/Edit Trip */}
      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingTrip ? "Edit Trip" : "Tambah Trip Baru"}
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Upload Poster */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">
                Poster Trip
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onPosterUpload}
                disabled={uploading}
                className="w-full"
              />
              {uploading && (
                <p className="text-sm text-primary mt-2">Uploading...</p>
              )}
              {formData.poster && (
                <div className="mt-2">
                  <img
                    src={formData.poster}
                    alt="Preview"
                    className="h-32 w-auto object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Poster sudah diupload
                  </p>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Gunung *
                </label>
                <input
                  type="text"
                  required
                  value={formData.mountain_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mountain_name: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tanggal Berangkat *
                </label>
                <input
                  type="date"
                  required
                  value={formData.departure_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      departure_date: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tanggal Pulang *
                </label>
                <input
                  type="date"
                  required
                  value={formData.return_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      return_date: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Harga Normal *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price_normal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_normal: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Harga Share Cost *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price_share}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_share: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Kuota Total *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quota}
                  onChange={(e) => {
                    const quota = e.target.value;
                    const newStatus = updateStatusBasedOnQuota(
                      parseInt(quota), 
                      parseInt(formData.available_slots) || parseInt(quota)
                    );
                    setFormData({
                      ...formData,
                      quota: quota,
                      available_slots: editingTrip ? formData.available_slots : quota,
                      status: newStatus,
                    });
                  }}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {editingTrip && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Kuota Tersisa *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max={formData.quota}
                    value={formData.available_slots}
                    onChange={(e) => {
                      const availableSlots = e.target.value;
                      const newStatus = updateStatusBasedOnQuota(
                        parseInt(formData.quota), 
                        parseInt(availableSlots)
                      );
                      setFormData({
                        ...formData,
                        available_slots: availableSlots,
                        status: newStatus,
                      });
                    }}
                    className="w-full p-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maksimal {formData.quota}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="open">🔥 Open</option>
                  <option value="almost_full">⏳ Almost Full</option>
                  <option value="closed">❌ Closed</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  *Status otomatis berubah berdasarkan kuota
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi *
              </label>
              <textarea
                required
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Itinerary (pisah dengan baris baru) *
              </label>
              <textarea
                required
                rows="4"
                value={formData.itinerary}
                onChange={(e) =>
                  setFormData({ ...formData, itinerary: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Hari 1: Meeting point - Basecamp&#10;Hari 2: Basecamp - Summit&#10;Hari 3: Summit - Turun"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Include (pisah dengan koma) *
              </label>
              <input
                type="text"
                required
                value={formData.inclusions}
                onChange={(e) =>
                  setFormData({ ...formData, inclusions: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Transport, Tenda, Makan, Guide"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Exclude (pisah dengan koma) *
              </label>
              <input
                type="text"
                required
                value={formData.exclusions}
                onChange={(e) =>
                  setFormData({ ...formData, exclusions: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Peralatan pribadi, Sleeping bag"
              />
            </div>

            <button type="submit" className="btn-primary">
              {editingTrip ? "Update Trip" : "Simpan Trip"}
            </button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari berdasarkan nama gunung, deskripsi, atau status..."
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
          Menampilkan {filteredTrips.length} dari {trips.length} trip
        </p>
      </div>

      {/* Daftar Trip */}
      <div className="card overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Daftar Trip</h2>

        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Poster</th>
              <th className="text-left py-2">Nama Gunung</th>
              <th className="text-left py-2">Tanggal</th>
              <th className="text-left py-2">Kuota</th>
              <th className="text-left py-2">Tersisa</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Harga</th>
              <th className="text-left py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrips.map((trip) => (
              <tr key={trip.id} className="border-b">
                <td className="py-2">
                  {trip.poster ? (
                    <img
                      src={trip.poster}
                      alt={trip.mountain_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </td>
                <td className="py-2 font-medium">{trip.mountain_name}</td>
                <td className="py-2">
                  {new Date(trip.departure_date).toLocaleDateString("id-ID")}
                </td>
                <td className="py-2">{trip.quota}</td>
                <td className="py-2">{trip.available_slots}</td>
                <td className="py-2">{getStatusBadge(trip.status)}</td>
                <td className="py-2">
                  <div>
                    <p className="text-sm line-through text-gray-400">
                      Rp {trip.price_normal?.toLocaleString()}
                    </p>
                    <p className="font-semibold text-primary">
                      Rp {trip.price_share?.toLocaleString()}
                    </p>
                  </div>
                </td>
                <td className="py-2 space-x-2">
                  <button
                    onClick={() => onEdit(trip)}
                    className="text-blue-500 hover:text-blue-700 text-sm border border-blue-200 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(trip.id)}
                    className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {paginatedTrips.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  Tidak ada trip ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>

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