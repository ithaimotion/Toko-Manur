"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, Search, FileText, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { formatDate } from "@toko-manur/utils";

interface BlogAuthor {
  id: string;
  name: string;
  role: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  readingTime: number;
  author: BlogAuthor;
  category: BlogCategory | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "DRAFT" | "PUBLISHED">("all");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/blogs?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setBlogs(data);
    } catch {
      showToast("Gagal memuat daftar blog", "error");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchBlogs, 300);
    return () => clearTimeout(timer);
  }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blogs/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus");
      }
      showToast(`Artikel "${deleteTarget.title}" berhasil dihapus`, "success");
      setDeleteTarget(null);
      fetchBlogs();
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-in slide-in-from-right ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-destructive text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <PageHeader
        title="Blog & Artikel"
        description="Kelola artikel dan konten blog"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Blog" }]}
        action={
          <Link href="/blogs/new" className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tulis Artikel
          </Link>
        }
      />

      {/* Filters */}
      <div className="admin-card p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari artikel..."
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

      {/* Table */}
      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-7 h-7 animate-spin" />
            <p className="text-sm">Memuat artikel...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-muted-foreground">
            <FileText className="w-10 h-10" />
            <p className="text-sm">
              {search || statusFilter !== "all"
                ? "Tidak ada artikel yang cocok dengan filter"
                : "Belum ada artikel. Mulai tulis artikel pertamamu!"}
            </p>
            {!search && statusFilter === "all" && (
              <Link href="/blogs/new" className="btn-admin-primary mt-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Tulis Artikel
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Judul</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Penulis</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Kategori</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden xl:table-cell">Tanggal</th>
                <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground line-clamp-1">{blog.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{blog.readingTime} mnt baca</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell text-sm">
                    {blog.author.name}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    {blog.category ? (
                      <span className="badge-admin bg-primary-50 text-primary-700">
                        {blog.category.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`badge-admin ${
                        blog.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {blog.status === "PUBLISHED" ? "Aktif" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs hidden xl:table-cell">
                    {formatDate(blog.publishedAt ?? blog.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`http://localhost:3000/blog/${blog.slug}`}
                        target="_blank"
                        className="p-1.5 hover:bg-primary-50 hover:text-primary rounded-md transition-colors text-muted-foreground"
                        title="Lihat di website"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/blogs/${blog.id}/edit`}
                        className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-muted-foreground"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ id: blog.id, title: blog.title })}
                        className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-md transition-colors text-muted-foreground"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && blogs.length > 0 && (
          <div className="px-5 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              Menampilkan {blogs.length} artikel
            </p>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.title}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
