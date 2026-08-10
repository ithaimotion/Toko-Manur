import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";
import type { Product } from "@/lib/types";
import { getMarketplaceIcon } from "@/components/web/ui/MarketplaceIcons";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card-base card-hover overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] bg-slate-50">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <Tag className="w-12 h-12 text-slate-300" />
            </div>
          )}
          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-3 left-3">
              <span className="badge-primary text-xs">
                {product.category.name}
              </span>
            </div>
          )}
          {/* Featured badge */}
          {product.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-amber-100 text-amber-700 text-xs">
                ⭐ Unggulan
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-slate-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Marketplace / CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2 items-center">
              {product.marketplaceLinks && product.marketplaceLinks.length > 0 ? (
                product.marketplaceLinks.map((link) => {
                  const LogoIcon = getMarketplaceIcon(link.platform);
                  return LogoIcon ? (
                    <div
                      key={link.platform}
                      className="h-6 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
                      title={link.platform}
                    >
                      <LogoIcon className="h-6 w-auto" />
                    </div>
                  ) : (
                    <span key={link.platform} className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {link.platform}
                    </span>
                  );
                })
              ) : (
                <p className="text-xs font-medium text-slate-500">
                  Hubungi Kami
                </p>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              Detail
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-base overflow-hidden">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
