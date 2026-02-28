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
  HiSearch,
  HiDownload,
  HiOutlineAdjustments,
  HiArrowDown,
  HiArrowUp,
  HiClock,
  HiOutlineChatAlt2,
} from "react-icons/hi";

const CATEGORY_UI = {
  "Makanan & Minuman": { icon: "🍴", color: "text-rose-600", bg: "bg-rose-50" },
  Groceries: { icon: "🛒", color: "text-emerald-600", bg: "bg-emerald-50" },
  Shopping: { icon: "🛍️", color: "text-violet-600", bg: "bg-violet-50" },
  Transportasi: { icon: "🚗", color: "text-amber-600", bg: "bg-amber-50" },
  Hiburan: { icon: "🎬", color: "text-blue-600", bg: "bg-blue-50" },
  Liburan: { icon: "✈️", color: "text-pink-600", bg: "bg-pink-50" },
  Tagihan: { icon: "⚡", color: "text-red-600", bg: "bg-red-50" },
  Kesehatan: { icon: "💊", color: "text-teal-600", bg: "bg-teal-50" },
  "Uang Keluar": { icon: "💸", color: "text-slate-600", bg: "bg-slate-50" },
};

function Riwayat({ navigateTo }) {
  const [userName, setUserName] = useState("User");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [rawTransactions, setRawTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const currentUserId = loggedInUser ? loggedInUser.id : 1;
        if (loggedInUser) setUserName(loggedInUser.name);

        const response = await fetch(
          `http://localhost:5000/api/transactions/user/${currentUserId}`,
        );
        const result = await response.json();

        if (response.ok) {
          setRawTransactions(result.data);
        }
      } catch (error) {
        console.error("Gagal narik riwayat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  const handleNavigation = (page) => {
    setIsMobileMenuOpen(false);
    navigateTo(page);
  };

  let flattenedItems = [];
  rawTransactions.forEach((nota) => {
    nota.items.forEach((barang) => {
      flattenedItems.push({
        ...barang,
        dateObj: new Date(nota.transactionDate),
        transactionId: nota.id,
      });
    });
  });

  if (searchQuery.trim() !== "") {
    flattenedItems = flattenedItems.filter(
      (item) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  flattenedItems.sort((a, b) => {
    return sortOrder === "desc" ? b.dateObj - a.dateObj : a.dateObj - b.dateObj;
  });

  const groupedData = flattenedItems.reduce((acc, item) => {
    const dateStr = item.dateObj.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (!acc[dateStr]) {
      acc[dateStr] = { items: [], dailyTotal: 0 };
    }
    acc[dateStr].items.push(item);
    acc[dateStr].dailyTotal += item.subtotal;

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900 relative">
      <Helmet>
        <title>Riwayat Transaksi - RFH Finance</title>
      </Helmet>
      {/* MOBILE HEADER */}
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

      {/* SIDEBAR KIRI (Warna dan Hover udah disamain 100% sama Dashboard) */}
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
            <button
              onClick={() => handleNavigation("progress")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors"
            >
              <HiOutlineTrendingUp size={20} /> Progress
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold transition-colors">
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

      {/* KONTEN UTAMA */}
      <main className="flex-1 md:ml-64 p-6 pt-24 md:pt-10 md:px-12 md:pb-12 overflow-y-auto w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Riwayat Transaksi
            </h2>
            <p className="text-gray-500 mt-2">
              Lihat dan tinjau aktivitas keuangan Anda
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => navigateTo("home")}
              className="px-4 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors w-full sm:w-auto whitespace-nowrap"
            >
              Kembali ke Landing Page
            </button>

            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiSearch className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
              />
            </div>
            <button className="px-4 py-2.5 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-400 rounded-xl text-sm font-semibold cursor-not-allowed w-full sm:w-auto">
              <HiDownload size={18} /> Export CSV
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-gray-100">
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-md"
          >
            <HiOutlineAdjustments size={18} />
            {sortOrder === "desc" ? "Urutkan: Terbaru" : "Urutkan: Terlama"}
          </button>

          <button className="flex items-center gap-2 bg-white border border-gray-200 text-emerald-400/50 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed">
            <HiArrowDown size={16} /> Pemasukan
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-rose-400/50 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed">
            <HiArrowUp size={16} /> Pengeluaran
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-amber-400/50 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed">
            <HiClock size={16} /> Tertunda
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center text-emerald-500 font-medium animate-pulse">
            Memuat riwayat transaksi...
          </div>
        ) : flattenedItems.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-gray-900">
              Tidak ada transaksi ditemukan
            </h3>
            <p className="text-gray-500 mt-1">
              Coba sesuaikan pencarian Anda atau tambahkan transaksi baru.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.keys(groupedData).map((dateKey, index) => (
              <div key={index}>
                <div className="flex justify-between items-end mb-4 px-2">
                  <h3 className="text-lg font-bold text-gray-900">{dateKey}</h3>
                  <div className="text-sm text-gray-500">
                    Total Harian:{" "}
                    <span className="font-bold text-gray-900 ml-1">
                      -Rp{" "}
                      {groupedData[dateKey].dailyTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 bg-gray-50/30 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-5">Nama Barang</div>
                    <div className="col-span-3">Kategori</div>
                    <div className="col-span-2">Waktu</div>
                    <div className="col-span-2 text-right">Harga</div>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {groupedData[dateKey].items.map((item, idx) => {
                      const ui = CATEGORY_UI[item.category] || {
                        icon: "📦",
                        color: "text-gray-600",
                        bg: "bg-gray-100",
                      };
                      const timeStr = item.dateObj.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div
                          key={idx}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="col-span-1 sm:col-span-5 flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${ui.bg}`}
                            >
                              {ui.icon}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                {item.itemName}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Pengeluaran • ID {item.id}
                              </p>
                            </div>
                          </div>

                          <div className="col-span-1 sm:col-span-3 flex items-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${ui.bg} ${ui.color}`}
                            >
                              <span className="text-[10px]">{ui.icon}</span>{" "}
                              {item.category}
                            </span>
                          </div>

                          <div className="col-span-1 sm:col-span-2 text-sm font-medium text-gray-500">
                            {timeStr} WIB
                          </div>

                          <div className="col-span-1 sm:col-span-2 text-right">
                            <span className="font-extrabold text-gray-900 text-sm">
                              -Rp {item.subtotal.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && flattenedItems.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
            <p>
              Menampilkan{" "}
              <span className="font-bold text-gray-900">
                {flattenedItems.length}
              </span>{" "}
              transaksi yang ditemukan
            </p>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-not-allowed opacity-50">
                &lt;
              </button>
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-not-allowed opacity-50">
                &gt;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Riwayat;
