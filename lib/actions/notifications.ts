"use server";

import { promises as fs } from "fs";
import path from "path";
import { db } from "@/lib/db";
import type { Notification, NotificationType } from "@/lib/types";
import { revalidatePath } from "next/cache";

const storageDir = path.resolve(process.cwd(), ".data");
const notificationsStorageFile = path.join(storageDir, "notifications.json");

type StoredNotification = {
  id?: string;
  type?: NotificationType;
  title?: string;
  message?: string;
  isRead?: boolean;
  link?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

function normalizeNotification(notification: any): Notification {
  return {
    id: notification.id,
    type: notification.type as NotificationType,
    title: notification.title,
    message: notification.message,
    isRead: Boolean(notification.isRead),
    link: notification.link ?? null,
    createdAt: typeof notification.createdAt === "string" ? notification.createdAt : notification.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: typeof notification.updatedAt === "string" ? notification.updatedAt : notification.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

async function readStoredNotifications(): Promise<Notification[]> {
  try {
    await fs.mkdir(storageDir, { recursive: true });
    const content = await fs.readFile(notificationsStorageFile, "utf8");
    if (!content) return [];

    const parsed = JSON.parse(content) as StoredNotification[];
    return parsed
      .filter(Boolean)
      .map((notif: any) => ({
        id: notif.id ?? crypto.randomUUID(),
        type: (notif.type as NotificationType) ?? "GENERAL",
        title: notif.title ?? "",
        message: notif.message ?? "",
        isRead: Boolean(notif.isRead),
        link: notif.link ?? null,
        createdAt: notif.createdAt ?? new Date().toISOString(),
        updatedAt: notif.updatedAt ?? notif.createdAt ?? new Date().toISOString(),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

async function writeStoredNotifications(notifications: Notification[]): Promise<Notification[]> {
  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(notificationsStorageFile, JSON.stringify(notifications, null, 2), "utf8");
  return notifications;
}

export async function getNotifications() {
  let notifications: Notification[] = [];
  let isUsingFallback = false;

  try {
    const dbNotifs = await db.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    notifications = dbNotifs.map(normalizeNotification);
  } catch (error) {
    console.error("Failed to fetch notifications from Prisma, using fallback:", error);
    notifications = await readStoredNotifications();
    isUsingFallback = true;
  }

  // SYSTEM REMINDER INJECTION
  // Inject a virtual system reminder if the user is using fallback storage
  if (isUsingFallback) {
    const hasDbAlert = notifications.some(n => n.type === "SYSTEM_ALERT" && n.title === "Database Offline");
    if (!hasDbAlert) {
      notifications.unshift({
        id: "sys-alert-db-down",
        type: "SYSTEM_ALERT",
        title: "Database Offline",
        message: "Sistem saat ini berjalan dalam Mode Cadangan (Fallback Storage).",
        isRead: false,
        link: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // Read persisted read state for sys- notifications
  const sysReadFile = path.join(storageDir, "sys-notifications-read.json");
  let sysReadIds: string[] = [];
  try {
    const raw = await fs.readFile(sysReadFile, "utf8");
    sysReadIds = JSON.parse(raw);
  } catch {
    sysReadIds = [];
  }

  // Inject a generic reminder for catalog update
  const hasCatalogReminder = notifications.some(n => n.id === "sys-reminder-catalog");
  if (!hasCatalogReminder) {
    notifications.unshift({
      id: "sys-reminder-catalog",
      type: "SYSTEM_ALERT",
      title: "Pengingat Rutin",
      message: "Jangan lupa untuk memperbarui katalog produk Anda bulan ini dan cek sinkronisasi harga dengan Marketplace.",
      isRead: sysReadIds.includes("sys-reminder-catalog"),
      link: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Apply persisted read state for all sys- notifications
  notifications = notifications.map(n =>
    n.id.startsWith("sys-") && sysReadIds.includes(n.id)
      ? { ...n, isRead: true }
      : n
  );

  // sort again after injections
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return { success: true, data: notifications };
}

export async function createNotification(payload: {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  const newNotif: Notification = {
    id: crypto.randomUUID(),
    type: payload.type,
    title: payload.title,
    message: payload.message,
    isRead: false,
    link: payload.link ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const created = await db.notification.create({
      data: {
        type: payload.type as any,
        title: payload.title,
        message: payload.message,
        link: payload.link || null,
        isRead: false,
      },
    });

    return { success: true, data: normalizeNotification(created) };
  } catch (error) {
    console.error("Failed to save notification to Prisma, using fallback:", error);
    const existing = await readStoredNotifications();
    const updated = [newNotif, ...existing];
    await writeStoredNotifications(updated);
    return { success: true, data: newNotif };
  }
}

export async function markNotificationAsRead(id: string) {
  if (id.startsWith("sys-")) {
    // Persist sys- read state to file so it survives refetches
    const sysReadFile = path.join(storageDir, "sys-notifications-read.json");
    try {
      await fs.mkdir(storageDir, { recursive: true });
      let existing: string[] = [];
      try {
        const raw = await fs.readFile(sysReadFile, "utf8");
        existing = JSON.parse(raw);
      } catch {
        existing = [];
      }
      if (!existing.includes(id)) {
        existing.push(id);
        await fs.writeFile(sysReadFile, JSON.stringify(existing), "utf8");
      }
    } catch {
      // ignore write errors
    }
    return { success: true };
  }

  try {
    await db.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    const existing = await readStoredNotifications();
    const updated = existing.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    await writeStoredNotifications(updated);
    return { success: true };
  }
}
