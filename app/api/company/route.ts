import { NextResponse } from "next/server";
import { getCompanyProfile, updateCompanyProfile } from "@/lib/actions/company";

export async function GET() {
  const res = await getCompanyProfile();
  return NextResponse.json(res);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const res = await updateCompanyProfile(payload);
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
