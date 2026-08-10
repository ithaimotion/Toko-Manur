import { getPromos } from "@/lib/actions/promo";
import PromoClient from "./PromoClient";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export const metadata = {
  title: "Promo & Diskon - Admin",
};

export default async function AdminPromoPage() {
  const response = await getPromos();
  const promos = response.success && response.data ? response.data : [];

  return (
    <div>
      <PageHeader
        title="Promo & Diskon"
        description="Kelola banner promo dan kode diskon"
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Promo" }]}
      />
      <div className="mt-6">
        <PromoClient initialPromos={promos} />
      </div>
    </div>
  );
}
