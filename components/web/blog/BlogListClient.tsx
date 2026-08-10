"use client";

import { useState, useMemo } from "react";
import { BlogCard, BlogCardSkeleton } from "@/components/web/blog/BlogCard";
import { Pagination } from "@/components/web/ui/Pagination";
import { SearchBar } from "@/components/web/ui/SearchBar";
import { EmptyState } from "@/components/web/ui/EmptyState";
import { paginateArray } from "@/lib/utils";
import type { Blog } from "@/lib/types";

const ITEMS_PER_PAGE = 6;

interface BlogListClientProps {
  initialBlogs: Blog[];
  categories: string[];
}

export function BlogListClient({ initialBlogs, categories }: BlogListClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return initialBlogs.filter((b) => {
      const matchesSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || b.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialBlogs, search, selectedCategory]);

  const { data: blogs, meta } = paginateArray(filtered, currentPage, ITEMS_PER_PAGE);

  const handleSearch = (q: string) => {
    setSearch(q);
    setCurrentPage(1);
  };

  const handleCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="bg-hero pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <SearchBar placeholder="Cari artikel..." onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => handleCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary"
              }`}
            >
              Semua Topik
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
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
          {initialBlogs.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900">{meta.totalItems}</span> artikel ditemukan
              </p>
            </div>
          )}

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <BlogCard key={blog.id} blog={blog} featured={i === 0 && currentPage === 1} />
              ))}
            </div>
          ) : initialBlogs.length === 0 ? (
            <EmptyState
              title="Belum ada artikel"
              description="Artikel akan segera hadir. Pantau terus halaman ini!"
            />
          ) : (
            <EmptyState
              title="Artikel tidak ditemukan"
              description="Coba kata kunci atau kategori yang berbeda"
              action={
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                  }}
                  className="btn-secondary text-sm"
                >
                  Reset Filter
                </button>
              }
            />
          )}

          <Pagination
            meta={meta}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </section>
    </>
  );
}
