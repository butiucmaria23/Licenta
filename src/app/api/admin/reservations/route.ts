import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acces neautorizat" },
        { status: 403 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        package: {
          select: { id: true, title: true, titleEn: true, destination: true, price: true },
        },
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
