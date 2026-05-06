import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const reservationId = session.metadata?.reservationId;

    if (reservationId) {
      try {
        await prisma.$transaction([
          prisma.reservation.update({
            where: { id: reservationId },
            data: { status: "CONFIRMED" },
          }),
          prisma.payment.update({
            where: { reservationId: reservationId },
            data: { status: "PAID" },
          }),
        ]);
        console.log(`Reservation ${reservationId} confirmed and Payment set to PAID`);
      } catch (error) {
        console.error("Webhook Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
