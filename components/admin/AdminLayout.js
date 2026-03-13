"use client";

export default function AdminLayout({ children, onLogout }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          <span className="text-primary">Admin</span>{" "}
          <span className="text-secondary">Dashboard</span>
        </h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}