import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export interface Product {
  ID: number;
  PRODNAME: string;
  PRODWRITE: string;
  PUBDATE: string;
  QTY: number;
  PRICE: number;
  IMAGE: string | null;
}

export async function GET() {
  try 
  {
    const db = await connectToDatabase();
    const result = await db.query`select * from products order by id desc`;
    
    return NextResponse.json({ 
      success: true, 
      products: result.recordset as Product[]
    });
  } 
  catch (error) 
  {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 }
    );
  }
}
