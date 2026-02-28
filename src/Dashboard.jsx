import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  HiOutlineTemplate,
  HiOutlineTrendingUp,
  HiOutlineClock,
  HiOutlineArchive,
  HiOutlineCog,
  HiMenu,
  HiX,
  HiOutlineChatAlt2,
} from "react-icons/hi";

const CATEGORY_COLORS = {
  "Makanan & Minuman": "#f43f5e",
  Groceries: "#10b981",
  Shopping: "#8b5cf6",
  Transportasi: "#f59e0b",
  Hiburan: "#3b82f6",
  Liburan: "#ec4899",
  Tagihan: "#ef4444",
  Kesehatan: "#14b8a6",
  "Uang Keluar": "#64748b",
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.03) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontWeight="bold"
      fontSize={12}
      className="drop-shadow-md"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function Dashboard({ navigateTo }) {
  const [allTransactions, setAllTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // TAMBAHAN: State untuk mendeteksi layar HP secara real-time
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const [startDate, setStartDate] = useState(
    firstDay.toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

  // Efek untuk memantau perubahan ukuran layar browser/HP
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const currentUserId = loggedInUser ? loggedInUser.id : 1;
        if (loggedInUser) setUserName(loggedInUser.name);

        const response = await fetch(
          `https://rfh-finance-backend.onrender.com/api/transactions/user/${currentUserId}`,
        );
        const result = await response.json();

        if (response.ok) {
          setAllTransactions(result.data);
        }
      } catch (error) {
        console.error("Gagal narik data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (allTransactions.length === 0) return;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = allTransactions.filter((nota) => {
      const notaDate = new Date(nota.transactionDate);
      return notaDate >= start && notaDate <= end;
    });

    const categoryTotals = {};
    filtered.forEach((nota) => {
      nota.items.forEach((barang) => {
        if (!categoryTotals[barang.category])
          categoryTotals[barang.category] = 0;
        categoryTotals[barang.category] += barang.subtotal;
      });
    });

    const formattedData = Object.keys(categoryTotals).map((cat) => ({
      name: cat,
      value: categoryTotals[cat],
      color: CATEGORY_COLORS[cat] || "#cbd5e1",
    }));

    formattedData.sort((a, b) => b.value - a.value);
    setChartData(formattedData);
  }, [allTransactions, startDate, endDate]);

  const handleNavigation = (page) => {
    setIsMobileMenuOpen(false);
    navigateTo(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900 relative">
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
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-semibold transition-colors">
              <HiOutlineTemplate size={20} /> Dashboard
            </button>
            <button
              onClick={() => handleNavigation("progress")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors"
            >
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-gray-900">Dashboard</h2>
          <button
            onClick={() => navigateTo("home")}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full whitespace-nowrap border border-emerald-100 shadow-sm"
          >
            Kembali ke Landing Page
          </button>
        </div>

        {/* Kartu Metrik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <HiOutlineTemplate size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Total Balance
              </p>
              <h3 className="text-3xl font-extrabold">Rp 0</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <HiOutlineTrendingUp size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Monthly Income
              </p>
              <h3 className="text-3xl font-extrabold">Rp 0</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
              <HiOutlineArchive size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Monthly Expenses
              </p>
              <h3 className="text-3xl font-extrabold">Rp 0</h3>
            </div>
          </div>
        </div>

        {/* AREA GRAFIK DONAT */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Analisis Pengeluaran
              </h3>
              <p className="text-gray-500 text-sm">
                Persentase pengeluaran berdasarkan kategori
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-full md:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer px-2 w-full text-center"
              />
              <span className="text-gray-400 hidden sm:block">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer px-2 w-full text-center"
              />
            </div>
          </div>

          {loading ? (
            <div className="h-80 flex items-center justify-center text-emerald-500 animate-pulse font-medium">
              Memuat data...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-gray-400">
              <span className="text-4xl mb-3">📭</span>
              <p>Tidak ada pengeluaran pada rentang tanggal ini.</p>
            </div>
          ) : (
            // TAMBAHAN: Di HP tingginya jadi 450px biar legenda yang banyak nggak kepotong!
            <div className="h-[450px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy={isMobile ? "40%" : "50%"} // Geser donat agak ke atas di HP
                    innerRadius={isMobile ? 70 : 100}
                    outerRadius={isMobile ? 110 : 140}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  {/* TAMBAHAN: wrapperStyle ngasih jarak paddingTop biar nggak nabrak donat */}
                  <Legend
                    verticalAlign="bottom"
                    height={isMobile ? 120 : 36} // Ruang untuk teks turun ke bawah di HP
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
