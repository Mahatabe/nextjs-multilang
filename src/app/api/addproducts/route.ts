import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try 
  {
    const formData = await request.formData();
    
    const prodName = formData.get("prodName") as string;
    const writer = formData.get("writer") as string;
    const pubDate = formData.get("pubDate") as string;
    const qty = formData.get("qty") as string;
    const price = formData.get("price") as string;
    const imageFile = formData.get("image") as File | null;

    if (!prodName || !writer || !pubDate || !qty || !price) 
    {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let imagePath: string | null = null;

    if (imageFile && imageFile.size > 0) 
    {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const ext = path.extname(imageFile.name);
      const newFilename = `${uuidv4()}${ext}`;
      imagePath = `/uploads/${newFilename}`;

      const fileArrayBuffer = await imageFile.arrayBuffer();
      await fs.writeFile(
        path.join(uploadDir, newFilename),
        Buffer.from(fileArrayBuffer)
      );
    }

    const db = await connectToDatabase();
    await db.query`INSERT INTO PRODUCTS (PRODNAME, PRODWRITE, PUBDATE, QTY, PRICE, IMAGE)
                   VALUES (${prodName}, ${writer}, ${pubDate}, ${parseFloat(qty)}, ${parseFloat(price)}, ${imagePath})`;

    return NextResponse.json(
      { success: true, message: "Product added successfully" },
      { status: 201 }
    );
  } 
  catch (error) 
  {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add product" },
      { status: 500 }
    );
  }
}