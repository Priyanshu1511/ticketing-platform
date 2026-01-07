export const runtime = "nodejs"; // REQUIRED

import { google } from "googleapis";
import { NextResponse } from "next/server";
import * as nodemailer from "nodemailer";




/* =========================
   GOOGLE SHEETS CLIENT
========================= ap*/
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS as string),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

/* =========================
   NODEMAILER CLIENT
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SUPPORT_EMAIL,
    pass: process.env.SUPPORT_EMAIL_PASSWORD,
  },
});

/* =========================
   CREATE TICKET (POST)
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ticketId = "BHN-" + Date.now();

    const sheets = await getSheetsClient();

    // 1️⃣ Save ticket to Google Sheet
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

    // 2️⃣ Send email to Support Team
    await transporter.sendMail({
      from: `"Bhuneer AI Support" <${process.env.SUPPORT_EMAIL}>`,
      to: process.env.SUPPORT_EMAIL,
      subject: `🆕 New Support Ticket: ${ticketId}`,
      html: `
        <h3>New Support Ticket</h3>
        <p><b>Ticket ID:</b> ${ticketId}</p>
        <p><b>Name:</b> ${body.name}</p>
        <p><b>Email:</b> ${body.email}</p>
        <p><b>Category:</b> ${body.category}</p>
        <p><b>Description:</b></p>
        <p>${body.description}</p>
      `,
    });

    // 3️⃣ (Optional) Auto-reply to user
    await transporter.sendMail({
      from: `"Bhuneer AI Support" <${process.env.SUPPORT_EMAIL}>`,
      to: body.email,
      subject: `🎫 Ticket Received: ${ticketId}`,
      html: `
        <p>Hello ${body.name},</p>
        <p>Your support ticket has been received.</p>
        <p><b>Ticket ID:</b> ${ticketId}</p>
        <p>Our team will get back to you shortly.</p>
        <br/>
        <p>— Bhuneer AI Support</p>
      `,
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
