import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineTemplate,
  HiOutlineTrendingUp,
  HiOutlineClock,
  HiOutlineArchive,
  HiOutlineCog,
  HiMenu,
  HiX,
  HiTrash,
  HiOutlinePlus,
  HiOutlineChatAlt2,
} from "react-icons/hi";

const CATEGORIES = [
  "Makanan & Minuman",
  "Groceries",
  "Shopping",
  "Transportasi",
  "Hiburan",
  "Liburan",
  "Tagihan",
  "Kesehatan",
  "Uang Keluar",
];

function Progress({ navigateTo }) {
  const [userName, setUserName] = useState("User");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const [items, setItems] = useState([
    {
      id: Date.now(),
      itemName: "",
      category: CATEGORIES[0],
      date: todayStr,
      price: "",
    },
  ]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) setUserName(loggedInUser.name);
  }, []);

  const handleNavigation = (page) => {
    setIsMobileMenuOpen(false);
    navigateTo(page);
  };

  const handleAddRow = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        itemName: "",
        category: CATEGORIES[0],
        date: todayStr,
        price: "",
      },
    ]);
  };

  const handleRemoveRow = (idToRemove) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== idToRemove));
  };

  const handleChange = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSaveChanges = async () => {
    const validItems = items.filter(
      (item) => item.itemName.trim() !== "" && Number(item.price) > 0,
    );

    if (validItems.length === 0) {
      return alert("Isi minimal 1 data belanja dengan benar dulu bro!");
    }

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = loggedInUser ? loggedInUser.id : 1;

    const groupedByDate = validItems.reduce((acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    }, {});

    try {
      for (const date in groupedByDate) {
        const itemsForDate = groupedByDate[date].map((i) => ({
          itemName: i.itemName,
          category: i.category,
          quantity: 1,
          pricePerItem: parseInt(i.price),
          subtotal: parseInt(i.price),
        }));

        const totalAmount = itemsForDate.reduce(
          (sum, i) => sum + i.subtotal,
          0,
        );

        await fetch("http://localhost:5000/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            // Sekarang backend kita udah siap nerima tanggal ini!
            transactionDate: new Date(date).toISOString(),
            totalAmount: totalAmount,
            items: itemsForDate,
          }),
        });
      }

      alert("Mantap! Data progress berhasil disimpan ke riwayat.");
      setItems([
        {
          id: Date.now(),
          itemName: "",
          category: CATEGORIES[0],
          date: todayStr,
          price: "",
        },
      ]);
    } catch (error) {
      console.error("Gagal simpan:", error);
      alert("Waduh, gagal nyimpen ke database nih bro.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900 relative">
      <Helmet>
        <title>Progress Belanja - RFH Finance</title>
      </Helmet>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-30 flex justify-between items-center px-6">
        <h1 className="text-xl font-extrabold tracking-tight">
          <span className="text-emerald-600">RFH</span>{" "}
          <span className="text-gray-900">Finance</span>
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-emerald-600 focus:outline-none transition-colors"
        >
          {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Kiri */}
      <aside
        className={`w-64 bg-white border-r border-gray-100 flex flex-col justify-between fixed h-screen z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div>
          <div className="hidden md:flex h-20 items-center px-8 border-b border-gray-50">
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-emerald-600">RFH</span>{" "}
              <span className="text-gray-900">Finance</span>
            </h1>
          </div>
          <div className="md:hidden h-16 flex items-center px-6 border-b border-gray-50 bg-gray-50/50">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Menu Navigasi
            </p>
          </div>

          <nav className="p-4 space-y-2 mt-2">
            <button
              onClick={() => handleNavigation("dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors"
            >
              <HiOutlineTemplate size={20} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold transition-colors">
              <HiOutlineTrendingUp size={20} /> Progress
            </button>
            <button
              onClick={() => handleNavigation("riwayat")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors"
            >
              <HiOutlineClock size={20} /> Riwayat
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 cursor-not-allowed rounded-xl font-medium">
              <HiOutlineArchive size={20} /> Budget{" "}
              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full ml-auto">
                Segera
              </span>
            </button>
            <a
              href="https://forms.gle/Vyc2E9zGpN4TgHHQ7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors cursor-pointer"
            >
              <HiOutlineChatAlt2 size={20} /> Beri Masukan
            </a>
          </nav>
        </div>

        {/* Profil User (Tetap ada di kiri bawah) */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{userName}</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 md:ml-64 p-6 pt-24 md:pt-8 md:p-8 overflow-y-auto w-full">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Progress</h2>
            <p className="text-gray-500 mt-1">
              Kelola pengeluaran dan pelacakan keuangan Anda
            </p>
          </div>

          {/* TOMBOL BACK (Menggantikan Profil Desktop yang lu minta hapus) */}
          <button
            onClick={() => navigateTo("home")}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full whitespace-nowrap transition-colors shadow-sm border border-emerald-100"
          >
            Kembali ke Landing Page
          </button>
        </div>

        {/* Card Tabel Progress */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-700 font-semibold">
              <HiOutlineMenuAlt2 size={20} className="text-gray-400" /> Semua
              Transaksi
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors hidden sm:block">
                Export
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors hidden sm:block">
                Print
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4 pl-6 w-1/3">Barang / Pengeluaran</th>
                  <th className="p-4 w-1/5">Kategori</th>
                  <th className="p-4 w-1/5">Tanggal Transaksi</th>
                  <th className="p-4 w-1/6">Harga (Rp)</th>
                  <th className="p-4 pr-6 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                          🛒
                        </div>
                        <input
                          type="text"
                          placeholder="Cth: Belanja Mingguan"
                          value={item.itemName}
                          onChange={(e) =>
                            handleChange(item.id, "itemName", e.target.value)
                          }
                          className="w-full bg-transparent border-none outline-none font-medium text-gray-900 placeholder-gray-400 focus:ring-0"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={item.category}
                        onChange={(e) =>
                          handleChange(item.id, "category", e.target.value)
                        }
                        className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) =>
                          handleChange(item.id, "date", e.target.value)
                        }
                        className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">
                          Rp
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) =>
                            handleChange(item.id, "price", e.target.value)
                          }
                          className="w-full bg-white border border-gray-200 text-gray-900 font-medium text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 pl-9"
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <button
                        onClick={() => handleRemoveRow(item.id)}
                        className={`p-2 rounded-lg transition-colors ${items.length > 1 ? "text-gray-400 hover:text-rose-500 hover:bg-rose-50" : "text-gray-300 cursor-not-allowed"}`}
                        disabled={items.length === 1}
                        title="Hapus Baris"
                      >
                        <HiTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <button
              onClick={handleAddRow}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-emerald-600 font-semibold hover:border-emerald-300 hover:bg-emerald-50 flex justify-center items-center gap-2 transition-all"
            >
              <HiOutlinePlus size={20} /> Tambah Baris
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="text-gray-500">
            Terakhir disinkronkan:{" "}
            <span className="font-semibold text-gray-900">Belum disimpan</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() =>
                setItems([
                  {
                    id: Date.now(),
                    itemName: "",
                    category: CATEGORIES[0],
                    date: todayStr,
                    price: "",
                  },
                ])
              }
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
            >
              Batal
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all w-full sm:w-auto text-center"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const HiOutlineMenuAlt2 = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    width={size}
    height={size}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h7"
    />
  </svg>
);

export default Progress;
