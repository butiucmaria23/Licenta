import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresa de email nu este validă"),
  password: z.string().min(1, "Parola este obligatorie"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Email sau parolă incorectă" },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email sau parolă incorectă" },
        { status: 401 }
      );
    }

    const token = signToken(user.id, user.role);

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Eroare internă a serverului" },
      { status: 500 }
    );
  }
}
