import React, { useState } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

function Auth({ onLoginSuccess, onBack }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister
      ? { name, email, password }
      : { email, password };

    try {
      const response = await fetch(
        `https://rfh-finance-backend.onrender.com${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Terjadi kesalahan bro!");
        return;
      }

      if (isRegister) {
        setSuccessMsg("Mantap! Akun berhasil dibuat. Silakan Login.");
        setIsRegister(false);
        setPassword("");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login Sukses! Selamat datang bro.");
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Gagal nyambung:", error);
      setErrorMsg("Gagal nyambung ke server nih. Cek koneksi lu bro.");
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-900 bg-white">
      {/* ========================================== */}
      {/* PANEL KIRI (Ilustrasi & Branding - Sembunyi di HP) */}
      {/* ========================================== */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#0c2e21] p-12 flex-col justify-between relative overflow-hidden">
        {/* Dekorasi Cahaya Halus di Background Kiri */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Logo */}
        <div className="text-white text-2xl font-extrabold flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">
            RFH
          </div>
          <span>RFH Finance</span>
        </div>

        {/* Grafik Ilustrasi ala Referensi */}
        <div className="relative z-10 my-12">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-end gap-3 h-28 mb-5">
              <div className="w-1/5 bg-white/20 h-1/2 rounded-t-lg"></div>
              <div className="w-1/5 bg-white/30 h-3/4 rounded-t-lg"></div>
              <div className="w-1/5 bg-white/20 h-1/3 rounded-t-lg"></div>
              <div className="w-1/5 bg-emerald-300 h-full rounded-t-lg shadow-[0_0_15px_rgba(110,231,183,0.5)]"></div>
              <div className="w-1/5 bg-emerald-100 h-2/3 rounded-t-lg"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-extrabold text-lg">+24.5%</p>
                <p className="text-emerald-100/60 text-xs font-medium">
                  Pertumbuhan Tabungan Bulanan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Teks Bawah */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Kuasai keuangan Anda bersama RFH Finance
          </h2>
          <p className="text-emerald-100/70 text-base leading-relaxed max-w-md">
            Bergabunglah dengan ribuan pengguna yang melacak kekayaan mereka
            dengan mudah dan mencapai kebebasan finansial.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-emerald-100/40 text-xs font-medium relative z-10">
          © {new Date().getFullYear()} RFH Finance Inc.
        </div>
      </div>

      {/* ========================================== */}
      {/* PANEL KANAN (Form Login / Register) */}
      {/* ========================================== */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-gray-50/50 lg:bg-white">
        {/* Tombol Back */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 lg:left-10 text-gray-500 hover:text-gray-900 font-semibold text-sm flex items-center gap-2 transition-colors"
        >
          <span>&larr;</span> Kembali
        </button>

        {/* Card Form */}
        <div className="w-full max-w-md bg-white p-8 lg:p-10 rounded-3xl shadow-xl lg:shadow-none border border-gray-100 lg:border-transparent">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {isRegister ? "Buat akun baru" : "Selamat datang kembali"}
            </h2>
            <p className="text-gray-500 text-sm">
              {isRegister
                ? "Daftar untuk mulai mengelola keuangan Anda"
                : "Masuk untuk melanjutkan ke dashboard Anda"}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-sm font-medium text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Nama (Khusus Register) */}
            {isRegister && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Nama Panggilan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlineUser className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Misal: Alex Morgan"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Input Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@contoh.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              {isRegister && (
                <p className="text-xs text-gray-400 mt-1.5 ml-1">
                  * Wajib menggunakan domain @gmail.com
                </p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                {!isRegister && (
                  <a
                    href="#"
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Lupa password?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-gray-400" size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              {isRegister && (
                <p className="text-xs text-gray-400 mt-1.5 ml-1">
                  * Min. 8 karakter (kombinasi huruf & angka)
                </p>
              )}
            </div>

            {/* Tombol Submit Utama */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 rounded-xl bg-[#a7e4c4] hover:bg-[#92d6b2] text-emerald-950 font-extrabold text-base transition-all active:scale-[0.98]"
            >
              {isRegister ? "Daftar" : "Masuk"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-400 tracking-wider uppercase">
              Atau Lanjutkan Dengan
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Tombol Google (Disabled) */}
          <button
            type="button"
            disabled
            className="w-full py-3.5 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold flex items-center justify-center gap-3 cursor-not-allowed opacity-60 hover:bg-gray-50 transition-colors"
          >
            <FcGoogle size={24} />
            Lanjutkan dengan Google
          </button>

          {/* Toggle Login/Register */}
          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
            {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-gray-900 font-extrabold hover:text-emerald-600 transition-colors underline decoration-2 underline-offset-4"
            >
              {isRegister ? "Masuk" : "Daftar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
