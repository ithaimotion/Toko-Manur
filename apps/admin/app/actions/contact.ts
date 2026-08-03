"use server";

import { promises as fs } from "fs";
import path from "path";
import { db } from "@toko-manur/db";
import type { ContactInfo } from "@toko-manur/types";
import { mockContactInfo } from "@toko-manur/mock-data";
import { revalidatePath } from "next/cache";

const fallbackContact: ContactInfo = {
  ...mockContactInfo,
  updatedAt: new Date().toISOString(),
};

const storageDir = path.resolve(process.cwd(), ".data");
const storageFile = path.join(storageDir, "contact-info.json");

type StoredContact = {
  id?: string;
  address?: string;
  email?: string;
  whatsapp?: string;
  whatsappMessage?: string | null;
  googleMapsEmbed?: string | null;
  googleMapsUrl?: string | null;
  businessHours?: string | null;
  updatedAt?: string;
};

function normalizeContact(contact: {
  id: string;
  address: string;
  email: string;
  whatsapp: string;
  whatsappMessage?: string | null;
  googleMapsEmbed?: string | null;
  googleMapsUrl?: string | null;
  businessHours?: string | null;
  updatedAt: Date | string;
}): ContactInfo {
  return {
    id: contact.id,
    address: contact.address,
    email: contact.email,
    whatsapp: contact.whatsapp,
    whatsappMessage: contact.whatsappMessage ?? undefined,
    googleMapsEmbed: contact.googleMapsEmbed ?? undefined,
    googleMapsUrl: contact.googleMapsUrl ?? undefined,
    businessHours: contact.businessHours ?? undefined,
    updatedAt: typeof contact.updatedAt === "string" ? contact.updatedAt : contact.updatedAt.toISOString(),
  };
}

async function readStoredContact(): Promise<ContactInfo> {
  try {
    await fs.mkdir(storageDir, { recursive: true });
    const content = await fs.readFile(storageFile, "utf8");
    if (!content) {
      return fallbackContact;
    }

    const parsed = JSON.parse(content) as StoredContact;
    return {
      id: parsed.id ?? "contact-storage",
      address: parsed.address ?? fallbackContact.address,
      email: parsed.email ?? fallbackContact.email,
      whatsapp: parsed.whatsapp ?? fallbackContact.whatsapp,
      whatsappMessage: parsed.whatsappMessage ?? fallbackContact.whatsappMessage,
      googleMapsEmbed: parsed.googleMapsEmbed ?? fallbackContact.googleMapsEmbed,
      googleMapsUrl: parsed.googleMapsUrl ?? fallbackContact.googleMapsUrl,
      businessHours: parsed.businessHours ?? fallbackContact.businessHours,
      updatedAt: parsed.updatedAt ?? fallbackContact.updatedAt,
    };
  } catch {
    return fallbackContact;
  }
}

async function writeStoredContact(payload: Partial<ContactInfo>): Promise<ContactInfo> {
  const current = await readStoredContact();
  const nextContact: ContactInfo = {
    ...current,
    ...payload,
    id: current.id || "contact-storage",
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(storageFile, JSON.stringify(nextContact, null, 2), "utf8");
  return nextContact;
}

async function ensureContactTableExists(): Promise<boolean> {
  try {
    const tables = await db.$queryRawUnsafe<Array<{ Tables_in_toko_manur?: string }>>(
      "SHOW TABLES LIKE 'contact_info'"
    );

    if (tables.length > 0) {
      return true;
    }

    await db.$executeRawUnsafe(`
      CREATE TABLE contact_info (
        id VARCHAR(191) NOT NULL,
        address TEXT NOT NULL,
        email VARCHAR(191) NOT NULL,
        whatsapp VARCHAR(191) NOT NULL,
        whatsappMessage TEXT NULL,
        googleMapsEmbed TEXT NULL,
        googleMapsUrl TEXT NULL,
        businessHours VARCHAR(191) NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    return true;
  } catch (error) {
    console.warn("Unable to ensure contact_info table exists:", error);
    return false;
  }
}

export async function getContactInfo() {
  const canUseDb = await ensureContactTableExists();

  if (!canUseDb) {
    const storageContact = await readStoredContact();
    return { success: true, data: storageContact };
  }

  try {
    const contact = await db.contactInfo.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!contact) {
      const created = await db.contactInfo.create({
        data: {
          address: fallbackContact.address,
          email: fallbackContact.email,
          whatsapp: fallbackContact.whatsapp,
          whatsappMessage: fallbackContact.whatsappMessage,
          googleMapsEmbed: fallbackContact.googleMapsEmbed,
          googleMapsUrl: fallbackContact.googleMapsUrl,
          businessHours: fallbackContact.businessHours,
        },
      });

      return { success: true, data: normalizeContact(created) };
    }

    return { success: true, data: normalizeContact(contact) };
  } catch (error) {
    console.error("Failed to fetch contact info from Prisma, using fallback storage:", error);
    const storageContact = await readStoredContact();
    return { success: true, data: storageContact };
  }
}

export async function updateContactInfo(payload: Partial<ContactInfo>) {
  const canUseDb = await ensureContactTableExists();

  if (!canUseDb) {
    const saved = await writeStoredContact(payload);
    revalidatePath("/contact-info");
    revalidatePath("/contact");
    revalidatePath("/");
    return { success: true, data: saved };
  }

  try {
    const existing = await db.contactInfo.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    const data = {
      address: payload.address ?? "",
      email: payload.email ?? "",
      whatsapp: payload.whatsapp ?? "",
      whatsappMessage: payload.whatsappMessage ?? null,
      googleMapsEmbed: payload.googleMapsEmbed ?? null,
      googleMapsUrl: payload.googleMapsUrl ?? null,
      businessHours: payload.businessHours ?? null,
    };

    const updated = existing
      ? await db.contactInfo.update({
          where: { id: existing.id },
          data,
        })
      : await db.contactInfo.create({
          data,
        });

    revalidatePath("/contact-info");
    revalidatePath("/contact");
    revalidatePath("/");

    return { success: true, data: normalizeContact(updated) };
  } catch (error) {
    console.error("Failed to save contact info to Prisma, using fallback storage:", error);
    const saved = await writeStoredContact(payload);

    revalidatePath("/contact-info");
    revalidatePath("/contact");
    revalidatePath("/");

    return { success: true, data: saved };
  }
}
