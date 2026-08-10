"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function loginAction(email: string, password: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Email atau password salah." };
    }

    if (user.status === "INACTIVE") {
      return { success: false, error: "Akun Anda tidak aktif. Hubungi Super Admin." };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: "Email atau password salah." };
    }

    // Update lastLogin
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Save simple session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Terjadi kesalahan server. Coba lagi." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
