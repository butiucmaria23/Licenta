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
        // Update reservation status and create payment record
        await prisma.$transaction([
          prisma.reservation.update({
            where: { id: reservationId },
            data: { status: "CONFIRMED" },
          }),
          prisma.payment.create({
            data: {
              reservationId: reservationId,
              stripeSessionId: session.id,
              amount: session.amount_total ? session.amount_total / 100 : 0,
              status: "COMPLETED",
            },
          }),
        ]);
        console.log(`Reservation ${reservationId} confirmed via Stripe`);
      } catch (error) {
        console.error("Error updating reservation/payment after webhook:", error);
        return NextResponse.json({ error: "Eroare la actualizarea rezervării" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing for Stripe webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};
