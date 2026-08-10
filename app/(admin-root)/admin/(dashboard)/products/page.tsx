"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Eye, Package } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ui/ConfirmDeleteModal";
import { mockProducts } from "@/lib/mock-data";
import { formatRupiah, formatDate } from "@/lib/utils";
import type { ProductStatus } from "@/lib/types";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProductStatus>("all");
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const filtered = mockProducts.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category?.name.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="Produk"
        description="Kelola semua produk Toko Manur"
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Produk" }]}
        action={
          <Link href="/admin/products/new" className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Produk
          </Link>
        }
      />

      {/* Filters */}
      <div className="admin-card p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === s
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "Semua" : s === "published" ? "Aktif" : "Draft"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Produk</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Kategori</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Harga</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden xl:table-cell">Tanggal</th>
                <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => {
                const img = product.images.find((i) => i.isPrimary) ?? product.images[0];
                return (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          {img && (
                            <Image src={img.url} alt={img.alt} width={40} height={40} className="object-cover w-full h-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">{product.name}</p>
                          {product.isFeatured && (
                            <span className="badge-admin bg-amber-100 text-amber-700 text-xs mt-0.5">⭐ Unggulan</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{product.category?.name}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {product.price ? (
                        <span className="font-semibold text-primary">{formatRupiah(product.price)}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Hubungi Kami</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge-admin ${product.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {product.status === "published" ? "Aktif" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs hidden xl:table-cell">{formatDate(product.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`http://localhost:3000/products/${product.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-md hover:bg-primary-50 hover:text-primary transition-colors text-muted-foreground"
                          title="Lihat"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="p-1.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors text-muted-foreground"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setToDelete({ id: product.id, name: product.name })}
                          className="p-1.5 rounded-md hover:bg-red-50 hover:text-destructive transition-colors text-muted-foreground"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Tidak ada produk ditemukan</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Menampilkan {filtered.length} dari {mockProducts.length} produk
          </p>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={!!toDelete}
        itemName={toDelete?.name}
        onConfirm={() => { setToDelete(null); }}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
