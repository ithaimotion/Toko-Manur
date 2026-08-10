import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, User, BookOpen } from "lucide-react";
import type { Blog } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${blog.slug}`} className="group block">
        <article className="card-base card-hover overflow-hidden grid md:grid-cols-2 gap-0 h-full">
          {/* Image */}
          <div className="relative overflow-hidden aspect-video md:aspect-auto">
            {blog.coverImage && (
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {blog.categoryName && (
                <span className="badge-primary text-xs mb-4 inline-block">
                  {blog.categoryName}
                </span>
              )}
              <h3 className="font-bold text-xl text-slate-900 mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                {blog.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                {blog.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                {blog.author.avatar && (
                  <Image
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-xs font-semibold text-slate-700">{blog.author.name}</p>
                  <p className="text-xs text-slate-400">{formatDate(blog.publishedAt)}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingTime} menit
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <article className="card-base card-hover overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden aspect-video">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {blog.categoryName && (
            <span className="badge-primary text-xs mb-3 self-start">
              {blog.categoryName}
            </span>
          )}
          <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {blog.excerpt}
          </p>

          {/* Meta */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">{blog.author.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {blog.readingTime} mnt
              </span>
              <span>{formatDate(blog.publishedAt)}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="card-base overflow-hidden">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
