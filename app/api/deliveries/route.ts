import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subject:(shipping+OR+tracking+OR+delivered+OR+shipment+OR+order)&maxResults=20`,
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    );

    const data = await res.json();
    if (!data.messages) return NextResponse.json([]);

    const deliveries = [];

    for (const msg of data.messages.slice(0, 10)) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=subject&metadataHeaders=from&metadataHeaders=date`,
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
      const msgData = await msgRes.json();
      const headers = msgData.payload?.headers || [];
      const subject = headers.find((h: any) => h.name === "subject")?.value || "";
      const from = headers.find((h: any) => h.name === "from")?.value || "";
      const date = headers.find((h: any) => h.name === "date")?.value || "";

      let carrier = "Unknown";
      let color = "#888888";

      if (from.toLowerCase().includes("amazon")) { carrier = "Amazon"; color = "#FF9900"; }
      else if (from.toLowerCase().includes("ups")) { carrier = "UPS"; color = "#8B4513"; }
      else if (from.toLowerCase().includes("usps")) { carrier = "USPS"; color = "#004B87"; }
      else if (from.toLowerCase().includes("fedex")) { carrier = "FedEx"; color = "#FF6600"; }

      let status = "In Transit";
      const subjectLower = subject.toLowerCase();
      if (subjectLower.includes("delivered")) status = "Delivered";
      else if (subjectLower.includes("out for delivery")) status = "Out for Delivery";
      else if (subjectLower.includes("shipped") || subjectLower.includes("on its way")) status = "Shipped";
      else if (subjectLower.includes("order") && subjectLower.includes("confirm")) status = "Order Confirmed";

      deliveries.push({ id: msg.id, subject, from, date, carrier, color, status });
    }

    return NextResponse.json(deliveries);
  } catch {
    return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 });
  }
}
