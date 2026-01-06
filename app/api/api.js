import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const ticketId = "TKT-" + Date.now();

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: "Tickets!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        ticketId,
        body.name,
        body.email,
        body.category,
        body.description,
        "OPEN",
        new Date().toISOString()
      ]]
    }
  });

  return NextResponse.json({ success: true, ticketId });
}
