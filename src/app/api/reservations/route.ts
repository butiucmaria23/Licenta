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

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Autentificare necesară" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { packageId, numberOfPeople } = body;

    if (!packageId || !numberOfPeople || numberOfPeople < 1) {
      return NextResponse.json(
        { error: "Date invalide pentru rezervare" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: { _count: { select: { reservations: true } } },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Pachetul nu a fost găsit" },
        { status: 404 }
      );
    }

    // Check availability
    const totalReservations = await prisma.reservation.aggregate({
      where: { 
        packageId, 
        status: { not: "CANCELLED" } 
      },
      _sum: { numberOfPeople: true },
    });

    const bookedSlots = totalReservations._sum.numberOfPeople || 0;
    const remainingSlots = pkg.maxSlots - bookedSlots;

    if (remainingSlots <= 0 || numberOfPeople > remainingSlots) {
      return NextResponse.json(
        {
          error: remainingSlots <= 0 
            ? "Pachetul este epuizat. Nu mai sunt locuri disponibile." 
            : `Nu sunt suficiente locuri. Locuri rămase: ${remainingSlots}`,
        },
        { status: 400 }
      );
    }

    const totalPrice = pkg.price * numberOfPeople;

    const reservation = await prisma.reservation.create({
      data: {
        userId: user.userId,
        packageId,
        numberOfPeople,
        totalPrice,
        status: "CONFIRMED",
      },
      include: {
        package: { select: { title: true, destination: true } },
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Eroare la crearea rezervării" },
      { status: 500 }
    );
  }
}
