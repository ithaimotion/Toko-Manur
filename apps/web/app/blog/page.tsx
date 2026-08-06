"use client";

import { useState, useMemo } from "react";
import { BookOpen } from "lucide-react";
import { BlogCard, BlogCardSkeleton } from "@/components/blog/BlogCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockBlogs } from "@toko-manur/mock-data";
import { paginateArray } from "@toko-manur/utils";

const ITEMS_PER_PAGE = 6;

const allCategories = Array.from(
  new Set(mockBlogs.filter((b) => b.categoryName).map((b) => b.categoryName!))
);

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return mockBlogs.filter((b) => {
      if (b.status !== "published") return false;
      const matchesSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || b.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const { data: blogs, meta } = paginateArray(filtered, currentPage, ITEMS_PER_PAGE);

  const handleSearch = (q: string) => { setSearch(q); setCurrentPage(1); };
  const handleCategory = (cat: string) => { setSelectedCategory(cat); setCurrentPage(1); };

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-border py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Blog" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-hero section-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-primary inline-flex mb-4">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Tips Parenting
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Blog &amp; <span className="gradient-text">Artikel</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto mb-8">
            Tips, wawasan, dan panduan terbaru dari ahli untuk mendukung perjalanan parenting Anda
          </p>
          <div className="max-w-lg mx-auto">
            <SearchBar placeholder="Cari artikel..." onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => handleCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary"
                }`}
            >
              Semua Topik
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{meta.totalItems}</span> artikel ditemukan
            </p>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <BlogCard key={blog.id} blog={blog} featured={i === 0 && currentPage === 1} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Artikel tidak ditemukan"
              description="Coba kata kunci atau kategori yang berbeda"
              action={
                <button onClick={() => { setSearch(""); setSelectedCategory("all"); }} className="btn-secondary text-sm">
                  Reset Filter
                </button>
              }
            />
          )}

          <Pagination
            meta={meta}
            onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          />
        </div>
      </section>
    </div>
  );
}
