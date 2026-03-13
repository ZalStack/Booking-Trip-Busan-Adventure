"use client";

import { useState } from "react";
import Pagination from "@/components/admin/Pagination";

export default function ContactsTab({ contacts, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fungsi untuk filter berdasarkan pencarian
  const filteredContacts = contacts.filter((c) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(searchLower) ||
      c.email?.toLowerCase().includes(searchLower) ||
      c.phone?.toLowerCase().includes(searchLower) ||
      c.message?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  // Reset ke halaman 1 saat search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="card overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Pesan Masuk</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, no HP, atau pesan..."
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
          Menampilkan {filteredContacts.length} dari {contacts.length} pesan
        </p>
      </div>

      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">No</th>
            <th className="text-left py-2">Nama</th>
            <th className="text-left py-2">Kontak</th>
            <th className="text-left py-2">Pesan</th>
            <th className="text-left py-2">Tanggal</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedContacts.map((contact, index) => (
            <tr key={contact.id} className="border-b">
              <td className="py-2">{startIndex + index + 1}</td>
              <td className="py-2 font-medium">{contact.name}</td>
              <td className="py-2">
                <div>
                  <p className="text-sm">{contact.email}</p>
                  {contact.phone && (
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  )}
                </div>
              </td>
              <td className="py-2 max-w-xs">
                <p className="text-sm line-clamp-2">{contact.message}</p>
              </td>
              <td className="py-2 text-sm">
                {new Date(contact.created_at).toLocaleDateString("id-ID")}
                <br />
                <span className="text-xs text-gray-500">
                  {new Date(contact.created_at).toLocaleTimeString("id-ID")}
                </span>
              </td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    contact.is_read
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {contact.is_read ? "Sudah dibaca" : "Belum dibaca"}
                </span>
              </td>
              <td className="py-2">
                <div className="flex gap-2">
                  {contact.phone && (
                    <a
                      href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-700 text-sm border border-green-200 px-2 py-1 rounded"
                    >
                      Balas WA
                    </a>
                  )}
                  <button
                    onClick={() => onDelete(contact.id)}
                    className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {paginatedContacts.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500">
                Tidak ada pesan ditemukan
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