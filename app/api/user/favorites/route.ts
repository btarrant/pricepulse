import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Product from "@/lib/models/product.model";
import { getCurrentUser } from "@/lib/auth";

// GET: Return the list of favorited products for the logged-in user
export async function GET() {
  await connectToDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([], { status: 401 });

  // Find all products where this user is listed as a favoriter
  const products = await Product.find({ "users.email": user.email });
  return NextResponse.json(products);
}

// POST: Add a product to the user's favorites and add the user to the product
export async function POST(req: NextRequest) {
  await connectToDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();

  // Add product to user's favorites
  await User.findOneAndUpdate(
    { email: user.email },
    { $addToSet: { favorites: productId } },
    { upsert: true }
  );

  // Add user to product's favoriter list
  await Product.findByIdAndUpdate(
    productId,
    { $addToSet: { users: { email: user.email } } }
  );

  return NextResponse.json({ success: true });
}

// DELETE: Remove a product from the user's favorites and remove the user from the product
export async function DELETE(req: NextRequest) {
  await connectToDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();

  // Remove product from user's favorites
  await User.findOneAndUpdate(
    { email: user.email },
    { $pull: { favorites: productId } }
  );

  // Remove user from product's favoriter list
  await Product.findByIdAndUpdate(
    productId,
    { $pull: { users: { email: user.email } } }
  );

  return NextResponse.json({ success: true });
}
