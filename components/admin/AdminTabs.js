"use client";

export default function AdminTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "trips", label: "Kelola Trip" },
    { id: "participants", label: "Kelola Peserta" },
    { id: "testimonials", label: "Kelola Testimoni" },
    { id: "contacts", label: "Kelola Pesan" },
    { id: "gallery", label: "Kelola Gallery" },
    { id: "settings", label: "Pengaturan" },
  ];

  return (
    <div className="flex gap-4 mb-6 border-b overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}