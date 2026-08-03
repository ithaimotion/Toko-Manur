import type { ContactInfo } from "@toko-manur/types";
import { db } from "./index";
import { mockContactInfo } from "@toko-manur/mock-data";

const fallbackContact: ContactInfo = {
  ...mockContactInfo,
  updatedAt: new Date().toISOString(),
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
  updatedAt: Date;
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
    updatedAt: contact.updatedAt.toISOString(),
  };
}

export async function getContactInfoData() {
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
    console.error("Failed to fetch contact info:", error);
    return { success: true, data: fallbackContact };
  }
}

export async function upsertContactInfoData(payload: Partial<ContactInfo>) {
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

    return { success: true, data: normalizeContact(updated) };
  } catch (error) {
    console.error("Failed to update contact info:", error);
    return { success: false, error: "Gagal menyimpan informasi kontak.", data: fallbackContact };
  }
}
