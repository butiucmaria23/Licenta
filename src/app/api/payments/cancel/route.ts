import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Autentificare necesară" },
        { status: 401 }
      );
    }

    const { reservationId } = await request.json();

    if (!reservationId) {
      return NextResponse.json(
        { error: "reservationId este obligatoriu" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Rezervarea nu a fost găsită" },
        { status: 404 }
      );
    }

    if (reservation.userId !== user.userId) {
      return NextResponse.json(
        { error: "Acces interzis" },
        { status: 403 }
      );
    }

    if (reservation.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: "Rezervarea nu poate fi anulată (status: " + reservation.status + ")" },
        { status: 400 }
      );
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel reservation error:", error);
    return NextResponse.json(
      { error: "Eroare la anularea rezervării" },
      { status: 500 }
    );
  }
}
