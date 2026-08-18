"use server";

import { promises as fs } from "fs";
import path from "path";
import { db } from "@/lib/db";
import type { CompanyProfile } from "@/lib/types";
import { mockCompanyProfile } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

const fallbackProfile: CompanyProfile = {
  ...mockCompanyProfile,
  updatedAt: new Date().toISOString(),
};

const storageDir = path.resolve(process.cwd(), ".data");
const profileStorageFile = path.join(storageDir, "company-profile.json");

function normalizeProfile(profile: any): CompanyProfile {
  return {
    id: profile.id,
    about: profile.about,
    aboutImage: profile.aboutImage || null,
    vision: profile.vision,
    mission: Array.isArray(profile.mission) ? profile.mission : JSON.parse(profile.mission || "[]"),
    values: Array.isArray(profile.values) ? profile.values : JSON.parse(profile.values || "[]"),
    brandStory: profile.brandStory,
    founded: profile.founded,
    legalDocuments: Array.isArray(profile.legalDocuments) ? profile.legalDocuments : JSON.parse(profile.legalDocuments || "[]"),
    privacyPolicy: profile.privacyPolicy,
    termsOfService: profile.termsOfService,
    updatedAt: typeof profile.updatedAt === "string" ? profile.updatedAt : profile.updatedAt.toISOString(),
  };
}

async function readStoredProfile(): Promise<CompanyProfile> {
  try {
    await fs.mkdir(storageDir, { recursive: true });
    const content = await fs.readFile(profileStorageFile, "utf8");
    if (!content) return fallbackProfile;
    const parsed = JSON.parse(content);
    return {
      id: parsed.id ?? "company-profile-storage",
      about: parsed.about ?? fallbackProfile.about,
      aboutImage: parsed.aboutImage ?? fallbackProfile.aboutImage,
      vision: parsed.vision ?? fallbackProfile.vision,
      mission: parsed.mission ?? fallbackProfile.mission,
      values: parsed.values ?? fallbackProfile.values,
      brandStory: parsed.brandStory ?? fallbackProfile.brandStory,
      founded: parsed.founded ?? fallbackProfile.founded,
      legalDocuments: parsed.legalDocuments ?? fallbackProfile.legalDocuments,
      privacyPolicy: parsed.privacyPolicy ?? fallbackProfile.privacyPolicy,
      termsOfService: parsed.termsOfService ?? fallbackProfile.termsOfService,
      updatedAt: parsed.updatedAt ?? fallbackProfile.updatedAt,
    };
  } catch (err) {
    return fallbackProfile;
  }
}

async function writeStoredProfile(payload: Partial<CompanyProfile>): Promise<CompanyProfile> {
  const current = await readStoredProfile();
  const next: CompanyProfile = {
    ...current,
    ...payload,
    id: current.id || "company-profile-storage",
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(profileStorageFile, JSON.stringify(next, null, 2), "utf8");
  return next;
}

export async function getCompanyProfile() {
  try {
    const profile = await db.companyProfile.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!profile) {
      const created = await db.companyProfile.create({
        data: {
          about: fallbackProfile.about,
          vision: fallbackProfile.vision,
          mission: fallbackProfile.mission as any,
          values: fallbackProfile.values as any,
          brandStory: fallbackProfile.brandStory,
          founded: fallbackProfile.founded,
          legalDocuments: fallbackProfile.legalDocuments as any,
          privacyPolicy: fallbackProfile.privacyPolicy,
          termsOfService: fallbackProfile.termsOfService,
        },
      });

      return { success: true, data: normalizeProfile(created) };
    }

    // If Prisma succeeded but is missing aboutImage (e.g. schema not pushed), fallback to local storage
    const normalized = normalizeProfile(profile);
    if (!normalized.aboutImage || !normalized.privacyPolicy || !normalized.termsOfService) {
      const storage = await readStoredProfile();
      if (!normalized.aboutImage && storage.aboutImage) {
        normalized.aboutImage = storage.aboutImage;
      }
      if (!normalized.privacyPolicy && storage.privacyPolicy) {
        normalized.privacyPolicy = storage.privacyPolicy;
      }
      if (!normalized.termsOfService && storage.termsOfService) {
        normalized.termsOfService = storage.termsOfService;
      }
    }

    return { success: true, data: normalized };
  } catch (error) {
    console.error("Failed to fetch company profile from Prisma, using fallback storage:", error);
    const storage = await readStoredProfile();
    return { success: true, data: storage };
  }
}

export async function updateCompanyProfile(payload: Partial<CompanyProfile>) {
  try {
    // Save to local storage to ensure aboutImage is persisted
    const savedStorage = await writeStoredProfile(payload);

    const existing = await db.companyProfile.findFirst({ orderBy: { updatedAt: "desc" } });

    const data = {
      about: payload.about ?? "",
      vision: payload.vision ?? "",
      mission: (payload.mission ?? []) as any,
      values: (payload.values ?? []) as any,
      brandStory: payload.brandStory ?? "",
      founded: payload.founded ?? "",
      legalDocuments: (payload.legalDocuments ?? []) as any,
      privacyPolicy: payload.privacyPolicy ?? null,
      termsOfService: payload.termsOfService ?? null,
    };

    const updated = existing
      ? await db.companyProfile.update({ where: { id: existing.id }, data })
      : await db.companyProfile.create({ data });

    revalidatePath("/about");
    revalidatePath("/");
    revalidatePath("/privacy");
    revalidatePath("/terms");

    const result = normalizeProfile(updated);
    result.aboutImage = savedStorage.aboutImage;

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to save company profile to Prisma, using fallback storage:", error);
    const saved = await writeStoredProfile(payload);

    revalidatePath("/about");
    revalidatePath("/");
    revalidatePath("/privacy");
    revalidatePath("/terms");

    return { success: true, data: saved };
  }
}
