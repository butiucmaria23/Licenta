import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 });
    }

    const { reservationId } = await request.json();

    if (!reservationId) {
      return NextResponse.json({ error: "ID-ul rezervării lipsește" }, { status: 400 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { package: true },
    });

    if (!reservation || reservation.userId !== user.userId) {
      return NextResponse.json({ error: "Rezervarea nu a fost găsită" }, { status: 404 });
    }

    if (reservation.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "Această rezervare nu necesită plată" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: reservation.package.title,
              description: `Rezervare pentru ${reservation.numberOfPeople} persoane`,
            },
            unit_amount: Math.round(reservation.totalPrice * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?reservation_id=${reservationId}`,
      metadata: {
        reservationId: reservation.id,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Eroare la crearea sesiunii de plată" }, { status: 500 });
  }
}
