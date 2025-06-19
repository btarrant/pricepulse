import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectToDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await User.findOneAndUpdate(
    { email: user.email },
    { $addToSet: { favorites: productId } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  await connectToDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await User.findOneAndUpdate(
    { email: user.email },
    { $pull: { favorites: productId } }
  );

  return NextResponse.json({ success: true });
}
