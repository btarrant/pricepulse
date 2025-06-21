import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getCurrentUser } from "@/lib/auth";
import Product from "@/lib/models/product.model";

export async function GET(req: NextRequest) {
  await connectToDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ isFavorited: false }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ isFavorited: false }, { status: 400 });

  const product = await Product.findOne({ _id: productId, "users.email": user.email });
  return NextResponse.json({ isFavorited: !!product });
}
