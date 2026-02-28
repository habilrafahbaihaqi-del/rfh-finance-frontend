import React, { useState, useEffect } from "react";
import {
  HiMenu,
  HiX,
  HiCheckCircle,
  HiChartBar,
  HiCreditCard,
  HiDocumentReport,
  HiViewGrid,
} from "react-icons/hi";
import Progress from "./Progress";
import Dashboard from "./Dashboard";
import Riwayat from "./Riwayat";
import Auth from "./Auth";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // JURUS GANTI JUDUL TAB OTOMATIS
  useEffect(() => {
    switch (currentPage) {
      case "dashboard":
        document.title = "Dashboard - RFH Finance";
        break;
      case "progress":
        document.title = "Progress Belanja - RFH Finance";
        break;
      case "riwayat":
        document.title = "Riwayat Transaksi - RFH Finance";
        break;
      case "auth":
        document.title = "Masuk / Daftar - RFH Finance";
        break;
      case "home":
      default:
        document.title = "RFH Finance - Kelola Keuangan Mudah & Cerdas";
        break;
    }
  }, [currentPage]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Yakin mau keluar akun bro?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setCurrentPage("home");
      setIsMobileMenuOpen(false);
    }
  };

  // FUNGSI SATPAM: Mencegah user yang belum login masuk ke fitur
  const navigateTo = (page) => {
    if (!isAuthenticated && page !== "home" && page !== "auth") {
      alert("Bro, lu wajib login dulu buat akses fitur ini!");
      setCurrentPage("auth");
    } else {
      setCurrentPage(page);
    }
    setIsMobileMenuOpen(false);
  };

  // ----- DAFTAR NAVIGASI BARU -----
  const NAV_ITEMS = [
    { label: "Dashboard", page: "dashboard" },
    { label: "Progress", page: "progress" },
    { label: "Riwayat", page: "riwayat" },
    { label: "Budget", page: "budget", disabled: true }, // Budget sengaja dimatiin dulu
  ];

  // ----- KOMPONEN NAVBAR -----
  const Navbar = () => (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          {/* Logo RFH Finance */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <button
              onClick={() => navigateTo("home")}
              className="text-2xl font-extrabold font-sans"
            >
              <span className="text-emerald-600">RFH</span>{" "}
              <span className="text-gray-900">Finance</span>
            </button>
          </div>

          {/* Tombol Hamburger Mobile */}
          <div className="-mr-2 -my-2 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>

          {/* Link Navigasi (Desktop) */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.disabled) {
                    alert("Fitur Budget segera hadir bro!");
                  } else {
                    navigateTo(item.page);
                  }
                }}
                className={`text-base font-medium transition-colors flex items-center ${item.disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-gray-900"}`}
              >
                {item.label}
                {item.disabled && (
                  <span className="ml-2 text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                    Segera
                  </span>
                )}
              </button>
            ))}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-rose-500 hover:bg-rose-600 transition-all"
              >
                Keluar Akun
              </button>
            ) : (
              <button
                onClick={() => navigateTo("auth")}
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-emerald-200"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 md:hidden border-t border-gray-100">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.disabled) {
                  alert("Fitur Budget segera hadir bro!");
                } else {
                  navigateTo(item.page);
                }
              }}
              className={`text-left text-base font-medium transition-colors flex items-center ${item.disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-900 hover:text-emerald-600"}`}
            >
              {item.label}
              {item.disabled && (
                <span className="ml-2 text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                  Segera
                </span>
              )}
            </button>
          ))}
          <div className="pt-4 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-rose-500 hover:bg-rose-600"
              >
                Keluar Akun
              </button>
            ) : (
              <button
                onClick={() => navigateTo("auth")}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  // ----- KOMPONEN FOOTER -----
  const Footer = () => (
    <footer className="bg-gray-50 pt-16 pb-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 mb-8 md:mb-0">
          <div className="text-2xl font-extrabold font-sans mb-4">
            <span className="text-emerald-600">RFH</span>{" "}
            <span className="text-gray-900">Finance</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Mengelola keuangan pribadi menjadi mudah, indah, dan berwawasan
            untuk semua orang.
          </p>
        </div>
        {["Produk", "Sumber Daya", "Perusahaan"].map((title, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              {title}
            </h3>
            <ul className="space-y-3">
              {["Link 1", "Link 2", "Link 3", "Link 4"].map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-base text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200">
        <p className="text-base text-gray-400 text-center">
          &copy; {new Date().getFullYear()} RFH Finance. All rights reserved.
        </p>
      </div>
    </footer>
  );

  // ----- ROUTING HALAMAN -----
  if (currentPage === "auth") {
    return (
      <Auth
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setCurrentPage("dashboard");
        }}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  const BackButton = () => (
    <button
      onClick={() => setCurrentPage("home")}
      className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-gray-700 border border-gray-200 hover:bg-white hover:text-emerald-600 transition-all shadow-sm font-medium"
    >
      ← Kembali ke Home
    </button>
  );

  if (currentPage === "progress") return <Progress navigateTo={navigateTo} />;
  if (currentPage === "dashboard") return <Dashboard navigateTo={navigateTo} />;
  if (currentPage === "riwayat") return <Riwayat navigateTo={navigateTo} />;

  // ----- RENDER HALAMAN HOME -----
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>{" "}
            Fitur Baru Tersedia v2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Kendalikan <br />
            <span className="text-emerald-600">Keuangan Anda</span> dengan Mudah
          </h1>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
            Pelacakan cerdas untuk keuangan pribadi Anda. Kelola anggaran, lacak
            pengeluaran, dan capai tujuan finansial Anda dengan dashboard
            intuitif kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigateTo(isAuthenticated ? "progress" : "auth")}
              className="px-8 py-4 rounded-full bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all text-center"
            >
              {isAuthenticated
                ? "Lanjut Catat Progress"
                : "Mulai Uji Coba Gratis"}
            </button>
            <button className="px-8 py-4 rounded-full bg-white text-gray-700 font-bold border border-gray-200 hover:border-emerald-200 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-emerald-500"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.553a.375.375 0 000-.754l-5.005 2.907a.375.375 0 000 .654l5.005 2.907zM9.75 12a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12z"
                  clipRule="evenodd"
                />
              </svg>
              Tonton Demo
            </button>
          </div>
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-400`}
                >
                  U{i}
                </div>
              ))}
            </div>
            <div>Dipercaya oleh 10,000+ pengguna</div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 relative z-10 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Total Saldo
                </h3>
                <p className="text-4xl font-extrabold text-gray-900 mt-1">
                  Rp 24,562.000
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <HiChartBar size={24} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Pemasukan", val: "+14.2 JT", col: "emerald" },
                { label: "Pengeluaran", val: "-4.1 JT", col: "rose" },
                { label: "Tabungan", val: "+10.1 JT", col: "blue" },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-lg font-bold text-${item.col}-600`}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-end justify-between h-32 gap-2 opacity-80">
              {[40, 60, 35, 80, 55, 70, 45].map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t-xl ${i === 3 ? "bg-emerald-500" : "bg-emerald-100"}`}
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>
          <div className="absolute top-10 -right-10 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Semua yang Anda butuhkan untuk mengelola keuangan
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-16">
            Alat kami dirancang untuk memberi Anda kejelasan dan kendali atas
            uang Anda, tanpa kerumitan aplikasi perbankan tradisional.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: HiCreditCard,
                title: "Pelacakan Pengeluaran",
                desc: "Hubungkan akun Anda dan lacak setiap sen secara otomatis dalam waktu nyata.",
              },
              {
                icon: HiViewGrid,
                title: "Perencanaan Anggaran",
                desc: "Tetapkan anggaran realistis untuk berbagai kategori yang sesuai dengan gaya hidup Anda.",
              },
              {
                icon: HiChartBar,
                title: "Wawasan Finansial",
                desc: "Dapatkan wawasan mendalam tentang kebiasaan belanja dengan rekomendasi berbasis AI.",
              },
              {
                icon: HiDocumentReport,
                title: "Laporan Bulanan",
                desc: "Dapatkan laporan PDF terperinci setiap bulan untuk diarsipkan dan meninjau kemajuan Anda.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative lg:order-1 order-2 justify-self-center lg:justify-self-start">
            <div className="w-[300px] h-[600px] bg-gray-900 rounded-[3rem] p-4 relative z-10 border-[8px] border-gray-800 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-3xl mx-auto w-40 z-20"></div>
                <div className="pt-12 px-6 pb-6 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-gray-400 text-xs">Selamat Datang,</p>
                      <h4 className="font-bold text-lg">Alex Morgan</h4>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="bg-gray-900 text-white p-6 rounded-3xl mb-8 relative overflow-hidden shadow-lg shadow-gray-900/20">
                    <p className="text-gray-400 text-sm mb-1">Total Saldo</p>
                    <h3 className="text-3xl font-extrabold mb-8">
                      Rp 12,450.000
                    </h3>
                    <p className="text-gray-400 text-sm">**** 4582</p>
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  </div>
                  <h5 className="font-bold mb-4">Transaksi Terakhir</h5>
                  <div className="space-y-4 flex-1">
                    {[
                      {
                        icon: "🛒",
                        name: "Groceries",
                        date: "Hari ini",
                        val: "-Rp 450rb",
                      },
                      {
                        icon: "🎬",
                        name: "Netflix Subs",
                        date: "Kemarin",
                        val: "-Rp 186rb",
                      },
                      {
                        icon: "💰",
                        name: "Gaji Masuk",
                        date: "Senin",
                        val: "+Rp 8.5jt",
                        green: true,
                      },
                    ].map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                            {t.icon}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{t.name}</p>
                            <p className="text-gray-400 text-xs">{t.date}</p>
                          </div>
                        </div>
                        <p
                          className={`font-bold text-sm ${t.green ? "text-emerald-600" : "text-gray-900"}`}
                        >
                          {t.val}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 absolute bottom-6 right-6 font-bold text-2xl">
                    +
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl -z-10"></div>
          </div>

          <div className="lg:order-2 order-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Lihat ke mana uang Anda pergi tanpa kerumitan
            </h2>
            <p className="text-lg text-gray-500 mb-12 leading-relaxed">
              Lumina secara otomatis mengkategorikan transaksi Anda sehingga
              Anda dapat melihat dengan tepat di mana Anda berbelanja. Tidak
              perlu entri manual.
            </p>
            <ul className="space-y-8">
              {[
                {
                  title: "Sinkronisasi Otomatis",
                  desc: "Terhubung dengan aman ke 10,000+ institusi keuangan.",
                },
                {
                  title: "Kategorisasi Cerdas",
                  desc: "Pembelajaran mesin yang memahami kebiasaan belanja Anda.",
                },
                {
                  title: "Pengingat Tagihan",
                  desc: "Jangan pernah melewatkan pembayaran dengan notifikasi cerdas.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <HiCheckCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </ul>
            <button className="mt-12 text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-2 group transition-all">
              Pelajari lebih lanjut tentang keamanan{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
