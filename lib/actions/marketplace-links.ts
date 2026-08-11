"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMarketplaceLinks() {
  try {
    const links = await db.marketplaceLink.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: links };
  } catch (error) {
    console.error("Failed to fetch marketplace links:", error);
    return { success: false, error: "Gagal mengambil data marketplace link." };
  }
}

export async function createMarketplaceLink(data: {
  platform: string;
  name: string;
  url: string;
  description?: string;
  isActive: boolean;
  order: number;
}) {
  try {
    const newLink = await db.marketplaceLink.create({
      data,
    });
    revalidatePath("/admin/marketplace-links");
    revalidatePath("/");
    return { success: true, data: newLink };
  } catch (error) {
    console.error("Failed to create marketplace link:", error);
    return { success: false, error: "Gagal menambahkan marketplace link." };
  }
}

export async function updateMarketplaceLink(
  id: string,
  data: {
    platform?: string;
    name?: string;
    url?: string;
    description?: string;
    isActive?: boolean;
    order?: number;
  }
) {
  try {
    const updatedLink = await db.marketplaceLink.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/marketplace-links");
    revalidatePath("/");
    return { success: true, data: updatedLink };
  } catch (error) {
    console.error("Failed to update marketplace link:", error);
    return { success: false, error: "Gagal mengupdate marketplace link." };
  }
}

export async function deleteMarketplaceLink(id: string) {
  try {
    await db.marketplaceLink.delete({
      where: { id },
    });
    revalidatePath("/admin/marketplace-links");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete marketplace link:", error);
    return { success: false, error: "Gagal menghapus marketplace link." };
  }
}
