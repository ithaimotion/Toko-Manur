import { NextResponse } from "next/server";
import { getNotifications, markNotificationAsRead } from "@/lib/actions/notifications";

export async function GET() {
  const res = await getNotifications();
  if (!res.success) {
    return NextResponse.json({ success: false, error: "Gagal mengambil notifikasi" }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: res.data });
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "ID notifikasi tidak valid" }, { status: 400 });
    }
    await markNotificationAsRead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal memproses permintaan" }, { status: 500 });
  }
}
