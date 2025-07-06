import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, email, password, mobile, nationality } = body;

  const db = await connectToDatabase();

  try 
  {
    await db.query `INSERT INTO USERS (NAME, EMAIL, PASSWORD, MOBILE, NATIONALITY)
                    VALUES (${name}, ${email}, ${password}, ${mobile}, ${nationality})`;
                    
    return NextResponse.json({ success: true, message: "User registered successfully." });
  } 
  catch (error) 
  {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false, message: "Registration failed.", error }, { status: 500 });
  }
}
