import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    const db = await connectToDatabase();

    const result = await db.query `SELECT ID, NAME, EMAIL, MOBILE, NATIONALITY FROM USERS WHERE ID = ${id}`;

    if (result.recordset.length > 0) 
    {
      return NextResponse.json({ success: true, user: result.recordset[0] });
    } 
    else 
    {
      return NextResponse.json({ success: false, message: "User not found." });
    }
  } 
  catch (error: unknown) 
  {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Profile Error:", msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
