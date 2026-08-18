"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Package, Image as ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ui/ConfirmDeleteModal";
import { TableSkeleton } from "@/components/admin/ui/TableSkeleton";
import { formatRupiah, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ProductImage {
  url: string;
  isPrimary?: boolean;
}

interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  status: "PUBLISHED" | "DRAFT";
  isFeatured: boolean;
  images: ProductImage[];
  createdAt: string;
  brand: Brand;
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "PUBLISHED" | "DRAFT">("all");
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data produk");
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("Produk berhasil dihapus");
      setToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menghapus produk");
    }
  });

  const handleDelete = () => {
    if (toDelete) deleteMutation.mutate(toDelete.id);
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.brand?.name.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="Produk Popok"
        description="Kelola semua varian produk popok Toko Manur"
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Produk" }]}
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
            placeholder="Cari produk atau brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "PUBLISHED", "DRAFT"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === s
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "Semua" : s === "PUBLISHED" ? "Aktif" : "Draft"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <TableSkeleton columns={6} rows={5} showActions={false} />
      ) : filtered.length === 0 ? (
        <div className="admin-card p-12 flex flex-col items-center justify-center text-center">
          <Package className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Belum Ada Produk</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Anda belum menambahkan produk popok. Tambahkan produk pertama Anda untuk mulai menampilkannya.
          </p>
          <Link href="/admin/products/new" className="btn-admin-primary inline-flex">
            <Plus className="w-4 h-4" /> Tambah Produk
          </Link>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Produk</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Brand</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Harga</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden xl:table-cell">Tanggal</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => {
                  const imagesArray = Array.isArray(product.images) ? product.images : [];
                  const img = imagesArray.find((i: any) => i.isPrimary) || imagesArray[0];
                  
                  return (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                            {img ? (
                              <img src={img.url} alt={product.name} className="object-cover w-full h-full" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
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
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                          {product.brand?.name || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-muted-foreground font-medium">
                        {product.price ? formatRupiah(product.price) : "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === "PUBLISHED"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {product.status === "PUBLISHED" ? "Aktif" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden xl:table-cell text-muted-foreground">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setToDelete({ id: product.id, name: product.name })}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
          </div>
        </div>
      )}
    </div>

      <ConfirmDeleteModal
        isOpen={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${toDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
