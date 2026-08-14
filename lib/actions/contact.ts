"use server";

import { promises as fs } from "fs";
import path from "path";
import { db } from "@/lib/db";
import type { ContactInfo, ContactMessage } from "@/lib/types";
import { mockContactInfo } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

const fallbackContact: ContactInfo = {
  ...mockContactInfo,
  updatedAt: new Date().toISOString(),
};

const storageDir = path.resolve(process.cwd(), ".data");
const contactInfoStorageFile = path.join(storageDir, "contact-info.json");
const contactMessagesStorageFile = path.join(storageDir, "contact-messages.json");

type StoredContact = {
  id?: string;
  address?: string;
  email?: string;
  whatsapp?: string;
  whatsappMessage?: string | null;
  googleMapsEmbed?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  businessHours?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  updatedAt?: string;
};

type StoredContactMessage = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  subject?: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
};

function normalizeContact(contact: {
  id: string;
  address: string;
  email: string;
  whatsapp: string;
  whatsappMessage?: string | null;
  googleMapsEmbed?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  businessHours?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  updatedAt: Date | string;
}): ContactInfo {
  return {
    id: contact.id,
    address: contact.address,
    email: contact.email,
    whatsapp: contact.whatsapp,
    whatsappMessage: contact.whatsappMessage ?? undefined,
    googleMapsEmbed: contact.googleMapsEmbed ?? undefined,
    latitude: contact.latitude ?? undefined,
    longitude: contact.longitude ?? undefined,
    businessHours: contact.businessHours ?? undefined,
    instagram: contact.instagram ?? undefined,
    facebook: contact.facebook ?? undefined,
    tiktok: contact.tiktok ?? undefined,
    updatedAt: typeof contact.updatedAt === "string" ? contact.updatedAt : contact.updatedAt.toISOString(),
  };
}

function normalizeContactMessage(message: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}): ContactMessage {
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    phone: message.phone ?? undefined,
    subject: message.subject,
    message: message.message,
    createdAt: typeof message.createdAt === "string" ? message.createdAt : message.createdAt.toISOString(),
    updatedAt: typeof message.updatedAt === "string" ? message.updatedAt : message.updatedAt.toISOString(),
  };
}

async function readStoredContact(): Promise<ContactInfo> {
  try {
    await fs.mkdir(storageDir, { recursive: true });
    const content = await fs.readFile(contactInfoStorageFile, "utf8");
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
      latitude: parsed.latitude ?? fallbackContact.latitude,
      longitude: parsed.longitude ?? fallbackContact.longitude,
      businessHours: parsed.businessHours ?? fallbackContact.businessHours,
      instagram: parsed.instagram ?? fallbackContact.instagram,
      facebook: parsed.facebook ?? fallbackContact.facebook,
      tiktok: parsed.tiktok ?? fallbackContact.tiktok,
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
  await fs.writeFile(contactInfoStorageFile, JSON.stringify(nextContact, null, 2), "utf8");
  return nextContact;
}

async function readStoredContactMessages(): Promise<ContactMessage[]> {
  try {
    await fs.mkdir(storageDir, { recursive: true });
    const content = await fs.readFile(contactMessagesStorageFile, "utf8");
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content) as StoredContactMessage[];
    return parsed
      .filter(Boolean)
      .map((message: any) => ({
        id: message.id ?? crypto.randomUUID(),
        name: message.name ?? "",
        email: message.email ?? "",
        phone: message.phone ?? undefined,
        subject: message.subject ?? "",
        message: message.message ?? "",
        createdAt: message.createdAt ?? new Date().toISOString(),
        updatedAt: message.updatedAt ?? message.createdAt ?? new Date().toISOString(),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

async function writeStoredContactMessages(payload: Partial<ContactMessage>): Promise<ContactMessage[]> {
  const currentMessages = await readStoredContactMessages();
  const nextMessage: ContactMessage = {
    id: payload.id ?? crypto.randomUUID(),
    name: payload.name ?? "",
    email: payload.email ?? "",
    phone: payload.phone ?? undefined,
    subject: payload.subject ?? "",
    message: payload.message ?? "",
    createdAt: payload.createdAt ?? new Date().toISOString(),
    updatedAt: payload.updatedAt ?? payload.createdAt ?? new Date().toISOString(),
  };

  const nextMessages = [nextMessage, ...currentMessages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(contactMessagesStorageFile, JSON.stringify(nextMessages, null, 2), "utf8");
  return nextMessages;
}

async function ensureContactTableExists(): Promise<boolean> {
  return true;
}

async function ensureContactMessagesTableExists(): Promise<boolean> {
  return true;
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
          latitude: fallbackContact.latitude,
          longitude: fallbackContact.longitude,
          businessHours: fallbackContact.businessHours,
          instagram: fallbackContact.instagram,
          facebook: fallbackContact.facebook,
          tiktok: fallbackContact.tiktok,
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
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      businessHours: payload.businessHours ?? null,
      instagram: payload.instagram ?? null,
      facebook: payload.facebook ?? null,
      tiktok: payload.tiktok ?? null,
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

export async function getContactMessages() {
  const canUseDb = await ensureContactMessagesTableExists();

  if (!canUseDb) {
    const storageMessages = await readStoredContactMessages();
    return { success: true, data: storageMessages };
  }

  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: messages.map((message: any) => normalizeContactMessage(message)),
    };
  } catch (error) {
    console.error("Failed to fetch contact messages from Prisma, using fallback storage:", error);
    const storageMessages = await readStoredContactMessages();
    return { success: true, data: storageMessages };
  }
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const canUseDb = await ensureContactMessagesTableExists();

  if (!canUseDb) {
    const saved = await writeStoredContactMessages({
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/contact-info");
    return { success: true, data: saved };
  }

  try {
    const created = await db.contactMessage.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        subject: payload.subject,
        message: payload.message,
      },
    });

    revalidatePath("/contact-info");
    return { success: true, data: normalizeContactMessage(created) };
  } catch (error) {
    console.error("Failed to save contact message to Prisma, using fallback storage:", error);
    const saved = await writeStoredContactMessages({
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/contact-info");
    return { success: true, data: saved };
  }
}
