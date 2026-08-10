"use server";

import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPromos(activeOnly = false) {
  try {
    const promos = await prisma.promo.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { order: "asc" },
    });
    
    // Map to standard Promo type
    const mappedPromos = promos.map(p => ({
      ...p,
      subtitle: p.subtitle || undefined,
      description: p.description || undefined,
      image: p.image || undefined,
      badgeText: p.badgeText || undefined,
      ctaText: p.ctaText || undefined,
      ctaUrl: p.ctaUrl || undefined,
      backgroundColor: p.backgroundColor || undefined,
      validUntil: p.validUntil ? p.validUntil.toISOString() : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return { success: true, data: mappedPromos };
  } catch (error: any) {
    console.error("Error fetching promos:", error);
    return { success: false, error: error.message || "Failed to fetch promos" };
  }
}

export async function createPromo(data: {
  title: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  validUntil?: string;
  isActive: boolean;
}) {
  try {
    // Get max order
    const maxOrderPromo = await prisma.promo.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    
    const newOrder = maxOrderPromo ? maxOrderPromo.order + 1 : 1;

    const promo = await prisma.promo.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        badgeText: data.badgeText || null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        isActive: data.isActive,
        order: newOrder,
      },
    });

    const mappedPromo = {
      ...promo,
      subtitle: promo.subtitle || undefined,
      description: promo.description || undefined,
      image: promo.image || undefined,
      badgeText: promo.badgeText || undefined,
      ctaText: promo.ctaText || undefined,
      ctaUrl: promo.ctaUrl || undefined,
      backgroundColor: promo.backgroundColor || undefined,
      validUntil: promo.validUntil ? promo.validUntil.toISOString() : undefined,
      createdAt: promo.createdAt.toISOString(),
      updatedAt: promo.updatedAt.toISOString(),
    };

    revalidatePath("/");
    revalidatePath("/admin/promo");
    return { success: true, data: mappedPromo };
  } catch (error: any) {
    console.error("Error creating promo:", error);
    return { success: false, error: error.message || "Failed to create promo" };
  }
}

export async function updatePromo(id: string, data: {
  title: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  validUntil?: string;
  isActive: boolean;
}) {
  try {
    const promo = await prisma.promo.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        badgeText: data.badgeText || null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        isActive: data.isActive,
      },
    });

    const mappedPromo = {
      ...promo,
      subtitle: promo.subtitle || undefined,
      description: promo.description || undefined,
      image: promo.image || undefined,
      badgeText: promo.badgeText || undefined,
      ctaText: promo.ctaText || undefined,
      ctaUrl: promo.ctaUrl || undefined,
      backgroundColor: promo.backgroundColor || undefined,
      validUntil: promo.validUntil ? promo.validUntil.toISOString() : undefined,
      createdAt: promo.createdAt.toISOString(),
      updatedAt: promo.updatedAt.toISOString(),
    };

    revalidatePath("/");
    revalidatePath("/admin/promo");
    return { success: true, data: mappedPromo };
  } catch (error: any) {
    console.error("Error updating promo:", error);
    return { success: false, error: error.message || "Failed to update promo" };
  }
}

export async function deletePromo(id: string) {
  try {
    await prisma.promo.delete({ where: { id } });
    
    revalidatePath("/");
    revalidatePath("/admin/promo");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting promo:", error);
    return { success: false, error: error.message || "Failed to delete promo" };
  }
}

export async function reorderPromos(promoIds: string[]) {
  try {
    await prisma.$transaction(
      promoIds.map((id, index) =>
        prisma.promo.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/promo");
    return { success: true };
  } catch (error: any) {
    console.error("Error reordering promos:", error);
    return { success: false, error: error.message || "Failed to reorder promos" };
  }
}
