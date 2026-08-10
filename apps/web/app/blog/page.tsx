import type { Metadata } from "next";
import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BlogListClient } from "@/components/blog/BlogListClient";
import { getPublishedBlogs, getBlogCategories } from "@/app/actions/blog";

export const metadata: Metadata = {
  title: "Blog & Artikel — Tips Parenting | Toko Manur",
  description:
    "Baca artikel parenting, tips merawat bayi, panduan memilih popok, dan informasi terpercaya dari Toko Manur Baby Care.",
};

// Revalidate setiap 5 menit agar artikel baru segera muncul
export const revalidate = 300;

export default async function BlogPage() {
  const [blogs, categories] = await Promise.all([
    getPublishedBlogs(),
    getBlogCategories(),
  ]);

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
          <p className="text-slate-500 max-w-xl mx-auto">
            Tips, wawasan, dan panduan terbaru dari ahli untuk mendukung perjalanan parenting Anda
          </p>
        </div>
      </section>

      {/* Blog List (Client Component untuk search + filter + pagination) */}
      <Suspense fallback={null}>
        <BlogListClient initialBlogs={blogs} categories={categories} />
      </Suspense>
    </div>
  );
}
