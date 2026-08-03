"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Lock, Mail, ArrowLeft, Send } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { createResetRequest } from "@/app/actions/users";

export default function LoginPage() {
  const router = useRouter();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setLoginError("");
    const res = await loginAction(loginEmail, loginPassword);
    setSubmitting(false);
    if (res.success) {
      router.push("/");
    } else {
      setLoginError(res.error || "Login gagal.");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createResetRequest(email);
    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      alert(res.error || "Gagal mengirim permintaan.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo or Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl flex items-center justify-center mb-5 shadow-xl">
            <Package className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Toko Manur Admin</h1>
          <p className="text-slate-300 text-sm mt-2">
            {isForgotPassword ? "Permintaan reset password" : "Masuk ke panel dashboard"}
          </p>
        </div>

        {/* Glassmorphism Login/Reset Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300">
          {!isForgotPassword ? (
            <form key="login-form" onSubmit={handleLoginSubmit} className="space-y-6">
              {loginError && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-200">
                  {loginError}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200 block ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="admin@tokomanur.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white text-sm focus:outline-none focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-slate-200 block">Password</label>
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setSubmitted(false); }}
                    className="text-xs text-indigo-300 hover:text-white transition-colors"
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white text-sm focus:outline-none focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center py-3 bg-white text-indigo-950 hover:bg-indigo-50 text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Memeriksa..." : "Masuk ke Dashboard"}
              </button>
            </form>
          ) : submitted ? (
            <div key="success-message" className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-500/30">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Permintaan Terkirim!</h3>
              <p className="text-sm text-slate-300">
                Permintaan reset password untuk <span className="font-semibold text-white">{email}</span> telah disimpan ke database dan diteruskan ke Super Admin.
              </p>
              <button 
                type="button" 
                onClick={() => { setIsForgotPassword(false); setSubmitted(false); setEmail(""); }}
                className="mt-4 text-sm text-indigo-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Form Login
              </button>
            </div>
          ) : (
            <form key="reset-form" className="space-y-6" onSubmit={handleResetSubmit}>
              <div className="text-center mb-6">
                <p className="text-sm text-slate-300">
                  Masukkan email Anda. Permintaan reset password akan dikirim ke Super Admin untuk disetujui.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200 block ml-1">Email Terdaftar</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    key="reset-email-input"
                    type="email" 
                    placeholder="nama@tokomanur.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white text-sm focus:outline-none focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 text-white hover:bg-indigo-400 text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Mengirim..." : "Kirim Permintaan"}
                </button>
              </div>

              <div className="text-center mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsForgotPassword(false)}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke form Login
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          &copy; {new Date().getFullYear()} Toko Manur. All rights reserved.
        </p>
      </div>
    </div>
  );
}
