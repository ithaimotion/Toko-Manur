"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { mockBlogs } from "@toko-manur/mock-data";
import { formatDate } from "@toko-manur/utils";
import type { BlogStatus } from "@toko-manur/types";

export default function AdminBlogsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const filtered = mockBlogs.filter((b) => {
    const q = search.toLowerCase();
    return (
      (!q || b.title.toLowerCase().includes(q)) &&
      (statusFilter === "all" || b.status === statusFilter)
    );
  });

  return (
    <div>
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
          <input type="text" placeholder="Cari artikel..." value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input pl-9" />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {s === "all" ? "Semua" : s === "published" ? "Aktif" : "Draft"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
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
            {filtered.map((blog) => (
              <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground line-clamp-1">{blog.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{blog.readingTime} mnt baca</p>
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden md:table-cell text-sm">{blog.author.name}</td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  {blog.categoryName && <span className="badge-admin bg-primary-50 text-primary-700">{blog.categoryName}</span>}
                </td>
                <td className="px-5 py-4">
                  <span className={`badge-admin ${blog.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {blog.status === "published" ? "Aktif" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground text-xs hidden xl:table-cell">{formatDate(blog.publishedAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`http://localhost:3000/blog/${blog.slug}`} target="_blank" className="p-1.5 hover:bg-primary-50 hover:text-primary rounded-md transition-colors text-muted-foreground">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/blogs/${blog.id}/edit`} className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-muted-foreground">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget({ id: blog.id, title: blog.title })}
                      className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-md transition-colors text-muted-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">Menampilkan {filtered.length} dari {mockBlogs.length} artikel</p>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.title}
        onConfirm={() => setDeleteTarget(null)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
