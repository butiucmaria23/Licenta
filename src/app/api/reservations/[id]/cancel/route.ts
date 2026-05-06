import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 });
    }

    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Rezervarea nu a fost găsită" }, { status: 404 });
    }

    if (reservation.userId !== user.userId && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acces neautorizat" }, { status: 403 });
    }

    if (reservation.status === "CONFIRMED" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Rezervările plătite nu pot fi anulate direct." },
        { status: 400 }
      );
    }

    await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ message: "Succes" });
  } catch (err) {
    console.error("Cancel Error:", err);
    return NextResponse.json({ error: "Eroare la server" }, { status: 500 });
  }
}
