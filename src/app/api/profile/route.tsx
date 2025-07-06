import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    const config = {
      user: "sa",
      password: "12345",
      server: "DESKTOP-T9QAGET\\SQLEXPRESS",
      database: "NextJsPrac",
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    };

    await sql.connect(config);

    const result = await sql.query `SELECT ID, NAME, EMAIL, MOBILE, NATIONALITY FROM USERS WHERE ID = ${id}`;

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
