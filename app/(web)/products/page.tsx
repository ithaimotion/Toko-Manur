"use client";

import { useState, useMemo } from "react";
import { Filter, Package } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/web/products/ProductCard";
import { Breadcrumb } from "@/components/web/ui/Breadcrumb";
import { Pagination } from "@/components/web/ui/Pagination";
import { SearchBar } from "@/components/web/ui/SearchBar";
import { EmptyState } from "@/components/web/ui/EmptyState";
import { mockProducts, mockCategories } from "@/lib/mock-data";
import { paginateArray } from "@/lib/utils";

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      if (p.status !== "published") return false;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || p.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const { data: products, meta } = paginateArray(filtered, currentPage, ITEMS_PER_PAGE);

  const handleSearch = (q: string) => {
    setSearch(q);
    setCurrentPage(1);
  };
  const handleCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-border py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Produk" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-hero section-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-primary inline-flex mb-4">
            <Package className="w-3.5 h-3.5 mr-1.5" />
            Katalog Produk
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Semua <span className="gradient-text">Produk Kami</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto mb-8">
            Temukan produk popok bayi dan perlengkapan ibu berkualitas premium untuk kenyamanan si kecil
          </p>
          <div className="max-w-lg mx-auto">
            <SearchBar
              placeholder="Cari produk, kategori..."
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <aside className="lg:w-64 shrink-0">
              <div className="card-base p-5 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <h3 className="font-semibold text-slate-900 text-sm">Filter Kategori</h3>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategory("all")}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                      selectedCategory === "all"
                        ? "bg-primary text-white font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                    }`}
                  >
                    Semua Kategori
                    <span className="ml-2 text-xs opacity-70">({mockProducts.length})</span>
                  </button>
                  {mockCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategory(cat.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedCategory === cat.id
                          ? "bg-primary text-white font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      {cat.name}
                      <span className="ml-2 text-xs opacity-70">({cat.productCount ?? 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Results info */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500">
                  Menampilkan <span className="font-semibold text-slate-900">{meta.totalItems}</span> produk
                  {search && (
                    <span> untuk &ldquo;<span className="font-semibold">{search}</span>&rdquo;</span>
                  )}
                </p>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Produk tidak ditemukan"
                  description="Coba ubah kata kunci pencarian atau kategori yang dipilih"
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
          </div>
        </div>
      </section>
    </div>
  );
}
