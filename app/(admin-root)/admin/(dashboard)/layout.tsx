import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Header } from "@/components/admin/layout/Header";
import { db } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    redirect("/admin/login");
  }

  const [productCount, blogCount, categoryCount, brandCount] = await Promise.all([
    db.product?.count().catch(() => 0),
    db.blog?.count().catch(() => 0),
    db.blogCategory?.count().catch(() => 0),
    db.brand?.count().catch(() => 0)
  ]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar productCount={productCount || 0} blogCount={blogCount || 0} categoryCount={categoryCount || 0} brandCount={brandCount || 0} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f7f5fb]">
          {children}
        </main>
      </div>
    </div>
  );
}
