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

    const [totalPackages, totalReservations, totalUsers, recentReservations, allReservations] =
      await Promise.all([
        prisma.package.count(),
        prisma.reservation.count(),
        prisma.user.count(),
        prisma.reservation.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true } },
            package: { select: { title: true, titleEn: true } },
          },
        }),
        prisma.reservation.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            package: { select: { title: true, titleEn: true } },
          },
        }),
      ]);

    const totalRevenue = await prisma.reservation.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { totalPrice: true },
    });

    return NextResponse.json({
      totalPackages,
      totalReservations,
      totalUsers,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentReservations,
      allReservations,
    });
  } catch {
    return NextResponse.json(
      { error: "Eroare la încărcarea statisticilor" },
      { status: 500 }
    );
  }
}
