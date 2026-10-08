import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET — get site settings (public)
export async function GET() {
  await dbConnect();
  let settings = await Settings.findOne({ key: "main" }).lean();
  if (!settings) {
    settings = { siteName: "CannabisLap", tagline: "", heroSubtitle: "", contactEmail: "orders@cannabislap.com", contactPhone: "", shippingNote: "", aboutText: "", announcement: "" };
  }
  return NextResponse.json({ settings });
}

// PATCH — update site settings (admin only)
export async function PATCH(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await request.json();

  const allowedKeys = [
    "siteName",
    "tagline",
    "heroSubtitle",
    "contactEmail",
    "contactPhone",
    "shippingNote",
    "aboutText",
    "announcement",
  ];

  const updateFields = {};
  for (const key of allowedKeys) {
    if (body[key] !== undefined) {
      updateFields[key] = body[key];
    }
  }

  const settings = await Settings.findOneAndUpdate(
    { key: "main" },
    updateFields,
    { new: true, upsert: true }
  ).lean();

  return NextResponse.json({ success: true, settings });
}
