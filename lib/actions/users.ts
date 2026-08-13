"use server";

import { db, Role, UserStatus, RequestStatus } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
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

    await logUserActivity(newUser.id, "Akun Dibuat", `Akun pengguna dengan peran ${formData.role} telah dibuat.`);

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

// ================= PROFILE ACTIONS =================

export async function getMyProfile() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;
    
    if (!sessionId) {
      return { success: false, error: "Tidak ada sesi aktif." };
    }

    const user = await db.user.findUnique({
      where: { id: sessionId },
    });

    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan." };
    }

    return { success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } };
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return { success: false, error: "Gagal mengambil profil." };
  }
}

export async function updateMyProfile(formData: { name: string; email: string; password?: string; avatar?: string }) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;
    
    if (!sessionId) {
      return { success: false, error: "Tidak ada sesi aktif." };
    }

    const dataToUpdate: any = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.avatar !== undefined) {
      dataToUpdate.avatar = formData.avatar;
    }

    if (formData.password && formData.password.trim() !== "") {
      dataToUpdate.password = await bcrypt.hash(formData.password, 10);
    }

    const updated = await db.user.update({
      where: { id: sessionId },
      data: dataToUpdate,
    });

    await logUserActivity(sessionId, "Update Profil", "Berhasil memperbarui informasi profil atau password.");

    return { success: true, data: { id: updated.id, name: updated.name, email: updated.email, avatar: updated.avatar } };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Gagal memperbarui profil. Email mungkin sudah digunakan." };
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

// ================= USER ACTIVITY ACTIONS =================

export async function logUserActivity(userId: string, action: string, details?: string) {
  try {
    await db.userActivity.create({
      data: {
        userId,
        action,
        details,
      },
    });
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
}

export async function getUserActivity(userId: string) {
  try {
    const activities = await db.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: activities };
  } catch (error) {
    console.error("Failed to fetch user activity:", error);
    return { success: false, error: "Gagal mengambil log aktivitas." };
  }
}
