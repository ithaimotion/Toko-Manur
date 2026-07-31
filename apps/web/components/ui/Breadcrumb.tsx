import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbItem } from "@toko-manur/types";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-500">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-primary transition-colors"
        aria-label="Beranda"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          {item.href && idx < items.length - 1 ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
