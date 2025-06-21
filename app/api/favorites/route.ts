import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { Product, Product as ProductType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const ids = body.ids;

    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid IDs format" }, { status: 400 });
    }

    const products = await ProductModel.find({ _id: { $in: ids } }).lean<Product[]>();

    const formatted: ProductType[] = products.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
