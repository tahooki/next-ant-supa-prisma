import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { User } from '../../../../../models/user.model'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { username, supabaseUserId, email } = await request.json()

    console.log('username : ', username);
    console.log('supabaseUserId : ', supabaseUserId);
    console.log('email : ', email);

    // 이미 존재하는 유저인지 확인
    const existingUser = await prisma.user.findUnique({ where: { auth: supabaseUserId } });
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const user = new User({ username, auth: supabaseUserId, email });
    console.log('user : ', user);
    await user.create();

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
