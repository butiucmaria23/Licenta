import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        reservations: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { reservations: true } },
      },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Pachetul nu a fost găsit" },
        { status: 404 }
      );
    }

    return NextResponse.json(pkg);
  } catch {
    return NextResponse.json(
      { error: "Eroare la încărcarea pachetului" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acces neautorizat" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const newMaxSlots = parseInt(body.maxSlots);

    // Check existing reservations total
    const totalReservations = await prisma.reservation.aggregate({
      where: { 
        packageId: id, 
        status: { not: "CANCELLED" } 
      },
      _sum: { numberOfPeople: true },
    });

    const bookedSlots = totalReservations._sum.numberOfPeople || 0;

    if (newMaxSlots < bookedSlots) {
      return NextResponse.json(
        { 
          error: `Capacitatea nu poate fi mai mică decât numărul actual de rezervări (${bookedSlots} persoane).` 
        },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        title: body.title,
        destination: body.destination,
        description: body.description,
        price: parseFloat(body.price),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        maxSlots: newMaxSlots,
        imageUrl: body.imageUrl || "",
      },
    });

    return NextResponse.json(pkg);
  } catch {
    return NextResponse.json(
      { error: "Eroare la actualizarea pachetului" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acces neautorizat" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Delete related reservations first
    await prisma.reservation.deleteMany({ where: { packageId: id } });
    await prisma.package.delete({ where: { id } });

    return NextResponse.json({ message: "Pachetul a fost șters" });
  } catch {
    return NextResponse.json(
      { error: "Eroare la ștergerea pachetului" },
      { status: 500 }
    );
  }
}
