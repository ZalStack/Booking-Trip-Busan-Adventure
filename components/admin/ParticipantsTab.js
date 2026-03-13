"use client";

import { useState } from "react";
import Pagination from "@/components/admin/Pagination";

export default function ParticipantsTab({
  participants,
  onUpdatePaymentStatus,
  onDelete,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fungsi untuk filter berdasarkan pencarian
  const filteredParticipants = participants.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(searchLower) ||
      p.email?.toLowerCase().includes(searchLower) ||
      p.phone?.toLowerCase().includes(searchLower) ||
      p.trip_name?.toLowerCase().includes(searchLower) ||
      p.payment_status?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParticipants = filteredParticipants.slice(startIndex, startIndex + itemsPerPage);

  // Reset ke halaman 1 saat search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="card overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Daftar Peserta</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, no HP, trip, atau status..."
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
          Menampilkan {filteredParticipants.length} dari {participants.length} peserta
        </p>
      </div>

      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">No</th>
            <th className="text-left py-2">Nama</th>
            <th className="text-left py-2">Trip</th>
            <th className="text-left py-2">Tanggal Daftar</th>
            <th className="text-left py-2">Jumlah</th>
            <th className="text-left py-2">Total</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Bukti</th>
            <th className="text-left py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedParticipants.map((p, index) => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{startIndex + index + 1}</td>
              <td className="py-2">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.email}</p>
                  <p className="text-xs text-gray-500">{p.phone}</p>
                </div>
              </td>
              <td className="py-2">{p.trip_name || `Trip ID: ${p.trip_id}`}</td>
              <td className="py-2">
                {new Date(p.booking_date).toLocaleDateString("id-ID")}
              </td>
              <td className="py-2">{p.quantity} org</td>
              <td className="py-2">Rp {p.total_price?.toLocaleString()}</td>
              <td className="py-2">
                <select
                  value={p.payment_status || "pending"}
                  onChange={(e) => onUpdatePaymentStatus(p.id, e.target.value)}
                  className={`px-2 py-1 rounded text-sm border ${
                    p.payment_status === "paid"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : p.payment_status === "dp"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="dp">DP</option>
                  <option value="paid">Lunas</option>
                </select>
              </td>
              <td className="py-2">
                {p.payment_proof ? (
                  <a
                    href={p.payment_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Lihat Bukti
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">Tidak ada</span>
                )}
              </td>
              <td className="py-2">
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-2 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {paginatedParticipants.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center py-8 text-gray-500">
                Tidak ada peserta ditemukan
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
  );
}