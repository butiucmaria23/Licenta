import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const destination = searchParams.get("destination") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { destination: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (destination) {
      where.destination = { contains: destination };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { reservations: true } },
      },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("GET Packages Error:", error);
    return NextResponse.json(
      { error: "Eroare la încărcarea pachetelor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acces neautorizat" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const pkg = await prisma.package.create({
      data: {
        title: body.title,
        destination: body.destination,
        description: body.description,
        price: parseFloat(body.price),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        maxSlots: parseInt(body.maxSlots),
        imageUrl: body.imageUrl || "",
      },
    });

    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    console.error("POST Packages Error:", error);
    return NextResponse.json(
      { error: "Eroare la crearea pachetului" },
      { status: 500 }
    );
  }
}
