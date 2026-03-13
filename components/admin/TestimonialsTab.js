"use client";

import { useState } from "react";
import Pagination from "@/components/admin/Pagination";

export default function TestimonialsTab({ testimonials, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fungsi untuk filter berdasarkan pencarian
  const filteredTestimonials = testimonials.filter((t) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      t.participant_name?.toLowerCase().includes(searchLower) ||
      t.comment?.toLowerCase().includes(searchLower) ||
      t.trip_name?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, startIndex + itemsPerPage);

  // Reset ke halaman 1 saat search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Kelola Testimoni</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari berdasarkan nama, komentar, atau trip..."
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
          Menampilkan {filteredTestimonials.length} dari {testimonials.length} testimoni
        </p>
      </div>

      <div className="space-y-4">
        {paginatedTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold">
                    {testimonial.participant_name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(testimonial.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 mb-1">"{testimonial.comment}"</p>
                {testimonial.trip_name && (
                  <p className="text-sm text-gray-500">
                    Trip: {testimonial.trip_name}
                  </p>
                )}
              </div>

              <button
                onClick={() => onDelete(testimonial.id)}
                className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-200 rounded-lg"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}

        {paginatedTestimonials.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Tidak ada testimoni ditemukan
          </p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}