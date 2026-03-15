export const dynamic = "force-dynamic";
export const revalidate = 0;

"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTabs from "@/components/admin/AdminTabs";
import TripsTab from "@/components/admin/TripsTab";
import ParticipantsTab from "@/components/admin/ParticipantsTab";
import TestimonialsTab from "@/components/admin/TestimonialsTab";
import ContactsTab from "@/components/admin/ContactsTab";
import GalleryTab from "@/components/admin/GalleryTab";
import SettingsTab from "@/components/admin/SettingsTab";

export default function AdminPage() {
  const [trips, setTrips] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [activeTab, setActiveTab] = useState("trips"); // Default
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const router = useRouter();
  const [galleries, setGalleries] = useState([]);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    title: "",
    description: "",
    image: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formData, setFormData] = useState({
    mountain_name: "",
    description: "",
    departure_date: "",
    return_date: "",
    price_normal: "",
    price_share: "",
    quota: "",
    available_slots: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    poster: "",
    status: "open",
  });

  // Ambil activeTab dari localStorage saat pertama load
  useEffect(() => {
    const savedTab = localStorage.getItem('adminActiveTab')
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  // Simpan activeTab ke localStorage setiap kali berubah
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    localStorage.setItem('adminActiveTab', tab)
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tripsRes, testimonialsRes, participantsRes, contactsRes, galleriesRes] =
        await Promise.all([
          fetch("/api/trips"),
          fetch("/api/testimonials"),
          fetch("/api/participants"),
          fetch("/api/contacts"),
          fetch("/api/gallery"),
        ]);

      const tripsData = await tripsRes.json();
      const testimonialsData = await testimonialsRes.json();
      const participantsData = await participantsRes.json();
      const contactsData = await contactsRes.json();
      const galleriesData = await galleriesRes.json();

      setTrips(tripsData);
      setTestimonials(testimonialsData);
      setParticipants(participantsData);
      setContacts(contactsData);
      setGalleries(galleriesData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Hapus activeTab dari localStorage saat logout
    localStorage.removeItem('adminActiveTab')
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin-login");
    router.refresh();
  };

  // Handlers untuk Trips
  const handlePosterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "poster");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, poster: data.url }));
        alert("Poster berhasil diupload!");
      } else {
        alert(data.error || "Gagal upload poster");
      }
    } catch (error) {
      alert("Gagal upload poster");
    } finally {
      setUploading(false);
    }
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();

    const quotaValue = parseInt(formData.quota) || 0;

    const data = {
      mountain_name: formData.mountain_name,
      description: formData.description,
      departure_date: formData.departure_date,
      return_date: formData.return_date,
      price_normal: parseFloat(formData.price_normal) || 0,
      price_share: parseFloat(formData.price_share) || 0,
      quota: quotaValue,
      available_slots: editingTrip
        ? formData.available_slots
          ? parseInt(formData.available_slots)
          : quotaValue
        : quotaValue,
      itinerary: formData.itinerary,
      inclusions: formData.inclusions,
      exclusions: formData.exclusions,
      poster: formData.poster || null,
      status: formData.status || "open",
    };

    if (editingTrip) {
      data.id = editingTrip.id;
    }

    try {
      const res = await fetch("/api/trips", {
        method: editingTrip ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setShowForm(false);
        setEditingTrip(null);
        setFormData({
          mountain_name: "",
          description: "",
          departure_date: "",
          return_date: "",
          price_normal: "",
          price_share: "",
          quota: "",
          available_slots: "",
          itinerary: "",
          inclusions: "",
          exclusions: "",
          poster: "",
          status: "open",
        });
        fetchData();
        alert(editingTrip ? "Trip berhasil diupdate!" : "Trip berhasil ditambahkan!");
      } else {
        alert(result.error || "Gagal menyimpan trip");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan trip: " + error.message);
    }
  };

  const handleTripDelete = async (id) => {
    if (confirm("Yakin ingin menghapus trip ini?")) {
      try {
        const res = await fetch(`/api/trips?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchData();
          alert("Trip berhasil dihapus");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Gagal menghapus trip");
      }
    }
  };

  const handleTripEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      mountain_name: trip.mountain_name || "",
      description: trip.description || "",
      departure_date: trip.departure_date ? trip.departure_date.split("T")[0] : "",
      return_date: trip.return_date ? trip.return_date.split("T")[0] : "",
      price_normal: trip.price_normal || "",
      price_share: trip.price_share || "",
      quota: trip.quota || "",
      available_slots: trip.available_slots || trip.quota || "",
      itinerary: trip.itinerary || "",
      inclusions: trip.inclusions || "",
      exclusions: trip.exclusions || "",
      poster: trip.poster || "",
      status: trip.status || "open",
    });
    setShowForm(true);
    handleTabChange("trips");
  };

  // Handlers untuk Participants
  const handleUpdatePaymentStatus = async (id, status) => {
    try {
      const res = await fetch("/api/participants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, payment_status: status }),
      });

      if (res.ok) {
        fetchData();
        alert("Status pembayaran berhasil diupdate");
      } else {
        const error = await res.json();
        alert(error.error || "Gagal update status");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal update status");
    }
  };

  const handleParticipantDelete = async (id) => {
    if (confirm("Yakin ingin menghapus peserta ini? Kuota akan dikembalikan.")) {
      try {
        const res = await fetch(`/api/participants?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchData();
          alert("Peserta berhasil dihapus");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Gagal menghapus peserta");
      }
    }
  };

  // Handlers untuk Testimonials
  const handleTestimonialDelete = async (id) => {
    if (confirm("Yakin ingin menghapus testimoni ini?")) {
      try {
        const res = await fetch(`/api/testimonials?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchData();
          alert("Testimoni berhasil dihapus");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Gagal menghapus testimoni");
      }
    }
  };

  // Handlers untuk Contacts
  const handleContactDelete = async (id) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        const res = await fetch(`/api/contacts?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchData();
          alert("Pesan berhasil dihapus");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Gagal menghapus pesan");
      }
    }
  };

  // Handlers untuk Gallery
  const handleGalleryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingGallery(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "gallery");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setGalleryFormData((prev) => ({ ...prev, image: data.url }));
        alert("Gambar berhasil diupload!");
      } else {
        alert(data.error || "Gagal upload gambar");
      }
    } catch (error) {
      alert("Gagal upload gambar");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/gallery", {
        method: editingGallery ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingGallery
            ? { ...galleryFormData, id: editingGallery.id }
            : galleryFormData
        ),
      });

      const result = await res.json();

      if (res.ok) {
        setShowGalleryForm(false);
        setEditingGallery(null);
        setGalleryFormData({
          title: "",
          description: "",
          image: "",
          date: new Date().toISOString().split("T")[0],
        });
        fetchData();
        alert(
          editingGallery
            ? "Gallery berhasil diupdate!"
            : "Gallery berhasil ditambahkan!"
        );
      } else {
        alert(result.error || "Gagal menyimpan gallery");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan gallery");
    }
  };

  const handleGalleryDelete = async (id) => {
    if (confirm("Yakin ingin menghapus gallery ini?")) {
      try {
        const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchData();
          alert("Gallery berhasil dihapus");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Gagal menghapus gallery");
      }
    }
  };

  const handleGalleryEdit = (gallery) => {
    setEditingGallery(gallery);
    setGalleryFormData({
      title: gallery.title || "",
      description: gallery.description || "",
      image: gallery.image || "",
      date: gallery.date
        ? gallery.date.split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setShowGalleryForm(true);
    handleTabChange("gallery");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <AdminTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "trips" && (
        <TripsTab
          trips={trips}
          onEdit={handleTripEdit}
          onDelete={handleTripDelete}
          onSubmit={handleTripSubmit}
          formData={formData}
          setFormData={setFormData}
          showForm={showForm}
          setShowForm={setShowForm}
          editingTrip={editingTrip}
          uploading={uploading}
          onPosterUpload={handlePosterUpload}
        />
      )}

      {activeTab === "participants" && (
        <ParticipantsTab
          participants={participants}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          onDelete={handleParticipantDelete}
        />
      )}

      {activeTab === "testimonials" && (
        <TestimonialsTab
          testimonials={testimonials}
          onDelete={handleTestimonialDelete}
        />
      )}

      {activeTab === "contacts" && (
        <ContactsTab
          contacts={contacts}
          onDelete={handleContactDelete}
        />
      )}

      {activeTab === "gallery" && (
        <GalleryTab
          galleries={galleries}
          onEdit={handleGalleryEdit}
          onDelete={handleGalleryDelete}
          onSubmit={handleGallerySubmit}
          formData={galleryFormData}
          setFormData={setGalleryFormData}
          showForm={showGalleryForm}
          setShowForm={setShowGalleryForm}
          editingGallery={editingGallery}
          uploading={uploadingGallery}
          onImageUpload={handleGalleryImageUpload}
        />
      )}

      {activeTab === "settings" && (
        <SettingsTab />
      )}
    </AdminLayout>
  );
}