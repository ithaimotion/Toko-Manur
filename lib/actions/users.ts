"use server";

import { db, Role, UserStatus, RequestStatus } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: users };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: "Gagal mengambil data pengguna." };
  }
}

export async function createUser(formData: { name: string; email: string; role: Role }) {
  try {
    const hashedPassword = await bcrypt.hash("12345678", 10);

    const newUser = await db.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        role: formData.role,
        status: UserStatus.ACTIVE,
      },
    });
    revalidatePath("/users");
    return { success: true, data: newUser };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Gagal menambah pengguna baru. Email mungkin sudah terdaftar." };
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id },
    });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Gagal menghapus pengguna." };
  }
}

export async function toggleUserStatus(id: string, currentStatus: UserStatus) {
  try {
    const nextStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    await db.user.update({
      where: { id },
      data: { status: nextStatus },
    });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: "Gagal mengubah status pengguna." };
  }
}

// ================= RESET REQUEST ACTIONS =================

export async function createResetRequest(email: string) {
  try {
    const request = await db.resetRequest.create({
      data: {
        email,
        status: RequestStatus.PENDING,
      },
    });
    revalidatePath("/users/reset-requests");
    return { success: true, data: request };
  } catch (error) {
    console.error("Failed to create reset request:", error);
    return { success: false, error: "Gagal mengirim permintaan reset password." };
  }
}

export async function getResetRequests() {
  try {
    const requests = await db.resetRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: requests };
  } catch (error) {
    console.error("Failed to fetch reset requests:", error);
    return { success: false, error: "Gagal mengambil permintaan reset." };
  }
}

export async function updateResetRequestStatus(id: string, status: RequestStatus) {
  try {
    await db.resetRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/users/reset-requests");
    return { success: true };
  } catch (error) {
    console.error("Failed to update reset request:", error);
    return { success: false, error: "Gagal memperbarui status permintaan." };
  }
}
