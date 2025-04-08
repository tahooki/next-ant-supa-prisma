import initAxios from "@/app/init-axios";
import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
await initAxios();

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();
    const supabase = await createClient();

    // 1. Supabase 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    try {
      // 2. Prisma DB에 사용자 생성
      await prisma.user.create({
        data: {
          username,
          email,
          auth: authData.user!.id,
        },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      // 3. Prisma DB 생성 실패시 Supabase 사용자 삭제
      if (authData.user?.id) {
        await supabase.auth.admin.deleteUser(authData.user.id);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 400 }
    );
  }
}
