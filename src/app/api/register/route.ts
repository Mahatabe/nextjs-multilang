import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, email, password, mobile, nationality } = body;

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

  try 
  {
    await sql.connect(config);

    await sql.query `INSERT INTO USERS (NAME, EMAIL, PASSWORD, MOBILE, NATIONALITY)
                    VALUES (${name}, ${email}, ${password}, ${mobile}, ${nationality})`;
                    
    return NextResponse.json({ success: true, message: "User registered successfully." });
  } 
  catch (error) 
  {
    console.error("DB Error:", error);
    return NextResponse.json({ success: false, message: "Registration failed.", error }, { status: 500 });
  }
}
