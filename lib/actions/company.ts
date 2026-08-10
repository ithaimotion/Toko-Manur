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
    vision: profile.vision,
    mission: Array.isArray(profile.mission) ? profile.mission : JSON.parse(profile.mission || "[]"),
    values: Array.isArray(profile.values) ? profile.values : JSON.parse(profile.values || "[]"),
    brandStory: profile.brandStory,
    founded: profile.founded,
    legalDocuments: Array.isArray(profile.legalDocuments) ? profile.legalDocuments : JSON.parse(profile.legalDocuments || "[]"),
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
      vision: parsed.vision ?? fallbackProfile.vision,
      mission: parsed.mission ?? fallbackProfile.mission,
      values: parsed.values ?? fallbackProfile.values,
      brandStory: parsed.brandStory ?? fallbackProfile.brandStory,
      founded: parsed.founded ?? fallbackProfile.founded,
      legalDocuments: parsed.legalDocuments ?? fallbackProfile.legalDocuments,
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

async function ensureCompanyProfileTableExists(): Promise<boolean> {
  try {
    const tables = await db.$queryRawUnsafe<Array<{ Tables_in_toko_manur?: string }>>(
      "SHOW TABLES LIKE 'company_profile'"
    );

    if (tables.length > 0) return true;

    await db.$executeRawUnsafe(`
      CREATE TABLE company_profile (
        id VARCHAR(191) NOT NULL,
        about TEXT NOT NULL,
        vision VARCHAR(191) NOT NULL,
        mission JSON NOT NULL,
        values JSON NOT NULL,
        brandStory TEXT NOT NULL,
        founded VARCHAR(191) NOT NULL,
        legalDocuments JSON NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    return true;
  } catch (error) {
    console.warn("Unable to ensure company_profile table exists:", error);
    return false;
  }
}

export async function getCompanyProfile() {
  const canUseDb = await ensureCompanyProfileTableExists();

  if (!canUseDb) {
    const storage = await readStoredProfile();
    return { success: true, data: storage };
  }

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
        },
      });

      return { success: true, data: normalizeProfile(created) };
    }

    return { success: true, data: normalizeProfile(profile) };
  } catch (error) {
    console.error("Failed to fetch company profile from Prisma, using fallback storage:", error);
    const storage = await readStoredProfile();
    return { success: true, data: storage };
  }
}

export async function updateCompanyProfile(payload: Partial<CompanyProfile>) {
  const canUseDb = await ensureCompanyProfileTableExists();

  if (!canUseDb) {
    const saved = await writeStoredProfile(payload);
    revalidatePath("/about");
    revalidatePath("/");
    return { success: true, data: saved };
  }

  try {
    const existing = await db.companyProfile.findFirst({ orderBy: { updatedAt: "desc" } });

    const data = {
      about: payload.about ?? "",
      vision: payload.vision ?? "",
      mission: (payload.mission ?? []) as any,
      values: (payload.values ?? []) as any,
      brandStory: payload.brandStory ?? "",
      founded: payload.founded ?? "",
      legalDocuments: (payload.legalDocuments ?? []) as any,
    };

    const updated = existing
      ? await db.companyProfile.update({ where: { id: existing.id }, data })
      : await db.companyProfile.create({ data });

    revalidatePath("/about");
    revalidatePath("/");

    return { success: true, data: normalizeProfile(updated) };
  } catch (error) {
    console.error("Failed to save company profile to Prisma, using fallback storage:", error);
    const saved = await writeStoredProfile(payload);

    revalidatePath("/about");
    revalidatePath("/");

    return { success: true, data: saved };
  }
}
