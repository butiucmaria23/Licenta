import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Autentificare necesară" },
        { status: 401 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId: user.userId },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            titleEn: true,
            destination: true,
            destinationEn: true,
            startDate: true,
            endDate: true,
            imageUrl: true,
          },
        },
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reservations);
  } catch {
    return NextResponse.json(
      { error: "Eroare la încărcarea rezervărilor" },
      { status: 500 }
    );
  }
}

// POST is disabled — all bookings must go through /api/payments/create-checkout-session
export async function POST() {
  return NextResponse.json(
    { error: "Please use /api/payments/create-checkout-session for new reservations." },
    { status: 400 }
  );
}
