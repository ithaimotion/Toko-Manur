"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setLoginError("");
    const res = await loginAction(loginEmail, loginPassword);
    setSubmitting(false);
    if (res.success) {
      router.push("/admin");
    } else {
      setLoginError(res.error || "Login gagal.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{
        background: "linear-gradient(145deg, #1a0505 0%, #3d0c0c 35%, #7f1d1d 70%, #991b1b 100%)",
      }}
    >
      {/* Background blobs — merah tua elegan sesuai branding */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[20%] -left-[15%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-40"
          style={{ background: "radial-gradient(circle, #cf2525, #7f1d1d)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[55%] rounded-full blur-[100px] opacity-30"
          style={{ background: "radial-gradient(circle, #ff4f4f, #991b1b)" }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[35%] h-[35%] rounded-full blur-[90px] opacity-20"
          style={{ background: "radial-gradient(circle, #fca55d, #cf2525)" }}
        />
        {/* Decorative subtle grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Floating dots */}
        <div className="absolute top-[12%] right-[18%] w-2 h-2 rounded-full bg-red-300/30 animate-pulse" />
        <div className="absolute top-[68%] left-[12%] w-1.5 h-1.5 rounded-full bg-orange-300/40 animate-pulse" style={{ animationDelay: "1.2s" }} />
        <div className="absolute top-[40%] right-[6%] w-1 h-1 rounded-full bg-red-200/50 animate-pulse" style={{ animationDelay: "2.4s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-5">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 0 40px rgba(207, 37, 37, 0.5)" }}
            >
              <Image
                src="/Logo Manur HD.png"
                alt="Toko Manur Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain bg-white p-1"
              />
            </div>
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                boxShadow: "0 0 0 2px rgba(255,79,79,0.3), 0 0 0 4px rgba(207,37,37,0.15)",
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Toko Manur</h1>
          <p className="text-red-200/70 text-sm mt-1.5 font-medium tracking-wide">Panel Admin Dashboard</p>
        </div>

        {/* Glass Card */}
        <div
          className="p-6 sm:p-8 rounded-3xl shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {loginError && (
              <div
                className="rounded-xl px-4 py-3 text-sm text-red-200"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                {loginError}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-red-100/90 block ml-0.5">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300/50 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="admin@tokomanur.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all placeholder:text-white/25"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.10)";
                    e.target.style.border = "1px solid rgba(255,79,79,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(207,37,37,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.06)";
                    e.target.style.border = "1px solid rgba(255,255,255,0.10)";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-red-100/90 block ml-0.5">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-300/50 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-white text-sm outline-none transition-all placeholder:text-white/25"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.10)";
                    e.target.style.border = "1px solid rgba(255,79,79,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(207,37,37,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.06)";
                    e.target.style.border = "1px solid rgba(255,255,255,0.10)";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-red-300/50 hover:text-red-200 transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center py-3.5 text-sm font-bold rounded-xl transition-all duration-200 mt-2"
              style={{
                background: submitting
                  ? "rgba(207,37,37,0.4)"
                  : "linear-gradient(135deg, #cf2525 0%, #ff4f4f 50%, #cf2525 100%)",
                color: "white",
                boxShadow: submitting ? "none" : "0 4px 20px rgba(207,37,37,0.4)",
                letterSpacing: "0.03em",
              }}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Memeriksa...
                </span>
              ) : (
                "Masuk ke Dasbor"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-red-200/30 mt-8 font-medium">
          &copy; {new Date().getFullYear()} Toko Manur. All rights reserved.
        </p>
      </div>
    </div>
  );
}
