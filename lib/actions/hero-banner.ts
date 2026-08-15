"use server";

import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { mockHeroBanners } from "@/lib/mock-data";

export async function getHeroBanners(activeOnly = false) {
  try {
    const banners = await prisma.heroBanner.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { order: "asc" },
      include: {
        carouselItems: {
          orderBy: { order: "asc" },
        },
      },
    });

    const mappedBanners = banners.map((b) => ({
      ...b,
      description: b.description || undefined,
      image: b.image || undefined,
      ctaText: b.ctaText || undefined,
      ctaUrl: b.ctaUrl || undefined,
      ctaSecondaryText: b.ctaSecondaryText || undefined,
      ctaSecondaryUrl: b.ctaSecondaryUrl || undefined,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      carouselItems: b.carouselItems.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    }));

    return { success: true, data: mappedBanners };
  } catch (error: any) {
    console.error("Error fetching hero banners, using mock fallback:", error);
    const fallbackBanners = activeOnly 
      ? mockHeroBanners.filter(b => b.isActive)
      : mockHeroBanners;
    return { success: true, data: fallbackBanners };
  }
}

export async function createHeroBanner(data: {
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
  isActive: boolean;
}) {
  try {
    const maxOrderBanner = await prisma.heroBanner.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = maxOrderBanner ? maxOrderBanner.order + 1 : 1;

    const banner = await prisma.heroBanner.create({
      data: {
        ...data,
        order: newOrder,
      },
      include: { carouselItems: true },
    });

    revalidatePath("/");
    revalidatePath("/admin/hero-banner");
    return { success: true, data: banner };
  } catch (error: any) {
    console.error("Error creating hero banner:", error);
    return { success: false, error: error.message || "Failed to create hero banner" };
  }
}

export async function updateHeroBanner(id: string, data: {
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
  isActive: boolean;
}) {
  try {
    const banner = await prisma.heroBanner.update({
      where: { id },
      data,
      include: { carouselItems: true },
    });

    revalidatePath("/");
    revalidatePath("/admin/hero-banner");
    return { success: true, data: banner };
  } catch (error: any) {
    console.error("Error updating hero banner:", error);
    return { success: false, error: error.message || "Failed to update hero banner" };
  }
}

export async function deleteHeroBanner(id: string) {
  try {
    await prisma.heroBanner.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/hero-banner");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting hero banner:", error);
    return { success: false, error: error.message || "Failed to delete hero banner" };
  }
}

export async function reorderHeroBanners(bannerIds: string[]) {
  try {
    await prisma.$transaction(
      bannerIds.map((id, index) =>
        prisma.heroBanner.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/hero-banner");
    return { success: true };
  } catch (error: any) {
    console.error("Error reordering hero banners:", error);
    return { success: false, error: error.message || "Failed to reorder hero banners" };
  }
}

// Carousel Items
export async function createCarouselItem(data: {
  heroBannerId: string;
  marketplace: string;
  image: string;
  trustCount: string;
  rating: string;
  isActive: boolean;
}) {
  try {
    const maxOrderItem = await prisma.heroCarouselItem.findFirst({
      where: { heroBannerId: data.heroBannerId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = maxOrderItem ? maxOrderItem.order + 1 : 1;

    const item = await prisma.heroCarouselItem.create({
      data: {
        ...data,
        order: newOrder,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/hero-banner");
    return { success: true, data: item };
  } catch (error: any) {
    console.error("Error creating carousel item:", error);
    return { success: false, error: error.message || "Failed to create carousel item" };
  }
}

export async function updateCarouselItem(id: string, data: {
  marketplace: string;
  image: string;
  trustCount: string;
  rating: string;
  isActive: boolean;
}) {
  try {
    const item = await prisma.heroCarouselItem.update({
      where: { id },
      data,
    });

    revalidatePath("/");
    revalidatePath("/admin/hero-banner");
    return { success: true, data: item };
  } catch (error: any) {
    console.error("Error updating carousel item:", error);
    return { success: false, error: error.message || "Failed to update carousel item" };
  }
}

export async function deleteCarouselItem(id: string) {
  try {
    await prisma.heroCarouselItem.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/hero-banner");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting carousel item:", error);
    return { success: false, error: error.message || "Failed to delete carousel item" };
  }
}

export async function reorderCarouselItems(itemIds: string[]) {
  try {
    await prisma.$transaction(
      itemIds.map((id, index) =>
        prisma.heroCarouselItem.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/hero-banner");
    return { success: true };
  } catch (error: any) {
    console.error("Error reordering carousel items:", error);
    return { success: false, error: error.message || "Failed to reorder carousel items" };
  }
}
