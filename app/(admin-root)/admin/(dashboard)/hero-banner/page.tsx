import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { getHeroBanners } from "@/lib/actions/hero-banner";
import HeroBannerClient from "./HeroBannerClient";

export const metadata: Metadata = { title: "Hero Banner" };

export default async function AdminHeroBannerPage() {
  const { data: banners = [] } = await getHeroBanners();

  return (
    <div>
      <PageHeader
        title="Hero Banner"
        description="Kelola banner utama halaman beranda"
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Banner Utama" }]}
      />

      <HeroBannerClient initialBanners={banners} />

      <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-xl">
        <p className="text-sm text-blue-700 font-medium">💡 Tips: Banner aktif paling pertama akan ditampilkan dalam mode slideshow di beranda.</p>
      </div>
    </div>
  );
}
