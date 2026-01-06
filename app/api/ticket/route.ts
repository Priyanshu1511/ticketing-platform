export const runtime = "nodejs"; // REQUIRED

import { google } from "googleapis";
import { NextResponse } from "next/server";

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS as string),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({
    version: "v4",
    auth,
  });
}

/* =========================
   CREATE TICKET (POST)
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ticketId = "BHN-" + Date.now();

    const sheets = await getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID as string,
      range: "A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          ticketId,
          body.name,
          body.email,
          body.category,
          body.description,
          "OPEN",
          new Date().toISOString(),
        ]],
      },
    });

    return NextResponse.json({ success: true, ticketId });
  } catch (error: any) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   FETCH TICKETS (GET)
========================= */
export async function GET() {
  try {
    const sheets = await getSheetsClient();

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID as string,
      range: "A2:G",
    });

    const rows = result.data.values || [];

    const tickets = rows.map((row) => ({
      ticketId: row[0],
      name: row[1],
      email: row[2],
      category: row[3],
      description: row[4],
      status: row[5],
      createdAt: row[6],
    }));

    return NextResponse.json(tickets);
  } catch (error: any) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
