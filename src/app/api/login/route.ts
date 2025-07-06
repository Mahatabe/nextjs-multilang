import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try 
  {
    const { email, password } = await request.json();

    //  const config = {
    //     user: "sa",
    //     password: "12345",
    //     server: "DESKTOP-T9QAGET\\SQLEXPRESS",
    //     database: "NextJsPrac",
    //     options: {
    //     encrypt: false,
    //     trustServerCertificate: true,
    //     },
    // };

    // await sql.connect(config);

    const db = await connectToDatabase();

    const result = await db.query`SELECT * FROM USERS WHERE EMAIL = ${email} AND PASSWORD = ${password}`;

    if (result.recordset.length > 0) 
    {
        return NextResponse.json({ success: true, user: result.recordset[0] });
    } 
    else 
    {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }


  } 
  catch (error: unknown) 
  {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Login Error:", msg);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}



