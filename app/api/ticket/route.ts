export const runtime = "nodejs";

import { google } from "googleapis";
import { NextResponse } from "next/server";

/* =========================
   GOOGLE SHEETS
========================= */
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS as string),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

/* =========================
   SENDGRID EMAIL
========================= */
async function sendEmail({
  to,
  subject,
  html,
  cc,
}: {
  to: string;
  subject: string;
  html: string;
  cc?: string;
}) {
  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: to }],
          cc: cc ? [{ email: cc }] : [],
        },
      ],
      from: { email: process.env.FROM_EMAIL },
      subject,
      content: [
        {
          type: "text/html",
          value: html,
        },
      ],
    }),
  });
}

/* =========================
   CREATE TICKET
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

    // Email user + CC manager
    await sendEmail({
      to: body.email,
      cc: process.env.MANAGER_EMAIL,
      subject: `🎫 Ticket Created: ${ticketId}`,
      html: `
        <h3>Bhuneer AI Support</h3>
        <p>Hello <b>${body.name}</b>,</p>
        <p>Your ticket has been created.</p>
        <p><b>Ticket ID:</b> ${ticketId}</p>
        <p><b>Category:</b> ${body.category}</p>
        <p>${body.description}</p>
        <br/>
        <p>We will get back to you shortly.</p>
      `,
    });

    return NextResponse.json({ success: true, ticketId });

  } catch (error: any) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* =========================
   DASHBOARD
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
