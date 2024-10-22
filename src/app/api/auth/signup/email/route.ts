import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { username, supabaseUserId } = await request.json()

    const user = await prisma.user.create({
      data: {
        username,
        auth: supabaseUserId,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
