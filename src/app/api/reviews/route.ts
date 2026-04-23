import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  reservationId: z.string().min(1, "Reservation ID is required"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(3, "Comment must be at least 3 characters long").max(1000, "Comment is too long"),
});

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 });
    }

    const body = await request.json();
    const validation = reviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { reservationId, rating, comment } = validation.data;

    // Verify reservation belongs to user, is CONFIRMED, and endDate is passed
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { package: true, review: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Rezervarea nu a fost găsită" }, { status: 404 });
    }

    if (reservation.userId !== user.userId) {
      return NextResponse.json({ error: "Acces neautorizat" }, { status: 403 });
    }

    if (reservation.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Rezervarea nu este confirmată" }, { status: 400 });
    }

    if (new Date(reservation.package.endDate) > new Date()) {
      return NextResponse.json({ error: "Nu puteți lăsa o recenzie înainte de finalizarea pachetului" }, { status: 400 });
    }

    if (reservation.review) {
      return NextResponse.json({ error: "Ați lăsat deja o recenzie pentru această rezervare" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: user.userId,
        packageId: reservation.packageId,
        reservationId: reservation.id,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json(
      { error: "Eroare la crearea recenziei" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        package: { select: { title: true, titleEn: true, destination: true, destinationEn: true } }
      },
      take: 6,
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET Reviews Error:", error);
    return NextResponse.json(
      { error: "Eroare la încărcarea recenziilor" },
      { status: 500 }
    );
  }
}
