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

    const { packageId, numberOfPeople } = await request.json();

    if (!packageId || !numberOfPeople || numberOfPeople < 1) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    // 1. Validate package and slots
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Pachetul nu a fost găsit" }, { status: 404 });
    }

    const totalReservations = await prisma.reservation.aggregate({
      where: { 
        packageId, 
        status: { not: "CANCELLED" } 
      },
      _sum: { numberOfPeople: true },
    });

    const bookedSlots = totalReservations._sum.numberOfPeople || 0;
    const remainingSlots = pkg.maxSlots - bookedSlots;

    if (remainingSlots < numberOfPeople) {
      return NextResponse.json({ error: "Nu sunt suficiente locuri disponibile" }, { status: 400 });
    }

    const totalPrice = pkg.price * numberOfPeople;

    // 2. Create reservation with PENDING_PAYMENT status
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.userId,
        packageId,
        numberOfPeople,
        totalPrice,
        status: "PENDING_PAYMENT",
      },
    });

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: pkg.title,
              description: `Rezervare pentru ${numberOfPeople} persoane`,
            },
            unit_amount: Math.round(totalPrice * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      metadata: {
        reservationId: reservation.id,
      },
    });

    // 4. Create Payment record with status PENDING
    await prisma.payment.create({
      data: {
        reservationId: reservation.id,
        stripeSessionId: session.id,
        amount: totalPrice,
        status: "PENDING",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Create Checkout Session Error:", error);
    return NextResponse.json({ error: "Eroare la crearea sesiunii de plată" }, { status: 500 });
  }
}
