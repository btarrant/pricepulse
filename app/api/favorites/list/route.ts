import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ favorites: [] });

  const products = await Product.find({ "users.email": user.email }, "_id");
  const ids = products.map((p) => p._id.toString());

  return NextResponse.json({ favorites: ids });
}