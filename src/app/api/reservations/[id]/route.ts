import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    const reservation = await prisma.reservation.findUnique({ where: { id } });

    if (!reservation) {
      return NextResponse.json({ error: "Rezervarea nu a fost găsită" }, { status: 404 });
    }

    if (reservation.userId !== user.userId && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acces neautorizat" }, { status: 403 });
    }

    // New safety check: Only allow cancelling if status is PENDING_PAYMENT
    // Admins can still cancel anything
    if (user.role !== "ADMIN" && reservation.status === "CONFIRMED") {
      return NextResponse.json(
        { error: "Rezervările confirmate (plătite) nu pot fi anulate direct. Contactați administratorul." },
        { status: 400 }
      );
    }

    await prisma.reservation.update({
      where: { id },
      data: { status: status || "CANCELLED" },
    });

    return NextResponse.json({ message: "Rezervarea a fost actualizată" });
  } catch {
    return NextResponse.json({ error: "Eroare la actualizarea rezervării" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Autentificare necesară" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Rezervarea nu a fost găsită" },
        { status: 404 }
      );
    }

    if (reservation.userId !== user.userId && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acces neautorizat" },
        { status: 403 }
      );
    }

    await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ message: "Rezervarea a fost anulată" });
  } catch {
    return NextResponse.json(
      { error: "Eroare la anularea rezervării" },
      { status: 500 }
    );
  }
}
