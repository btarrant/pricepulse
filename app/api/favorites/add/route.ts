import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { productId, email } = await req.json();

    if (!productId || !email) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await Product.findByIdAndUpdate(
      productId,
      { $addToSet: { users: { email } } },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding favorite:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
