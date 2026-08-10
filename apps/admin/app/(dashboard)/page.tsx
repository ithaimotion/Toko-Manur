import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Package, FileText, Star, Users, TrendingUp, Eye,
  ArrowRight, Plus, Activity,
} from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { mockDashboardStats } from "@toko-manur/mock-data";
import { formatRupiah, formatDate, formatCompactNumber } from "@toko-manur/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Selamat Datang, Admin 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Berikut ringkasan aktivitas dan data terkini Toko Manur.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          label="Total Produk"
          value={stats.totalProducts}
          change={12}
          changeLabel="vs. bulan lalu"
          icon={Package}
          color="blue"
        />
        <StatsCard
          label="Total Artikel"
          value={stats.totalBlogs}
          change={8}
          changeLabel="vs. bulan lalu"
          icon={FileText}
          color="green"
        />
        <StatsCard
          label="Review Terkumpul"
          value={stats.totalTestimonials}
          change={5}
          changeLabel="baru bulan ini"
          icon={Star}
          color="amber"
        />
        <StatsCard
          label="Pengunjung Bulan Ini"
          value={formatCompactNumber(stats.monthlyVisitors)}
          change={23}
          changeLabel="vs. bulan lalu"
          icon={Eye}
          color="purple"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2">
          <div className="admin-card">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-base text-foreground">Produk Terbaru</h2>
              <Link
                href="/products"
                className="text-xs text-primary font-medium hover:text-primary-700 flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {stats.recentProducts.map((product) => {
                const img = product.images.find((i) => i.isPrimary) ?? product.images[0];
                return (
                  <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-muted shrink-0">
                      {img && (
                        <Image src={img.url} alt={img.alt} width={44} height={44} className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {product.price ? (
                        <p className="text-sm font-semibold text-primary">{formatRupiah(product.price)}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Hubungi Kami</p>
                      )}
                      <span
                        className={`badge-admin mt-1 ${
                          product.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {product.status === "published" ? "Aktif" : "Draft"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-border">
              <Link href="/products/new" className="btn-admin-primary w-full justify-center text-xs">
                <Plus className="w-4 h-4" />
                Tambah Produk Baru
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Recent Blogs */}
          <div className="admin-card">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-base text-foreground">Artikel Terbaru</h2>
              <Link href="/blogs" className="text-xs text-primary font-medium hover:text-primary-700 flex items-center gap-1">
                Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {stats.recentBlogs.slice(0, 4).map((blog) => (
                <div key={blog.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-medium text-foreground line-clamp-1 mb-1">{blog.title}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{formatDate(blog.publishedAt)}</p>
                    <span className="badge-admin bg-emerald-100 text-emerald-700 text-xs">
                      {blog.status === "published" ? "Aktif" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="admin-card p-5">
            <h2 className="font-bold text-base text-foreground mb-4">Aksi Cepat</h2>
            <div className="space-y-2">
              {[
                { label: "Tambah Produk", href: "/products/new", icon: Package },
                { label: "Tulis Artikel", href: "/blogs/new", icon: FileText },
                { label: "Edit Hero Banner", href: "/hero-banner", icon: Activity },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground"
                >
                  <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
