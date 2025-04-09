import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received registration request:', body);

    const { 
      name, 
      email, 
      password, 
      age, 
      gender, 
      location, 
      occupation, 
      bio,
      hairColor,
      eyeColor,
      height,
      ethnicity,
      religion,
      hasChildren
    } = body;

    // Validate required fields
    if (!name || !email || !password || !age || !gender || !location || !occupation || !bio ||
        !hairColor || !eyeColor || !height || !ethnicity || !religion || !hasChildren) {
      console.error('Missing required fields:', { 
        name, email, age, gender, location, occupation, bio,
        hairColor, eyeColor, height, ethnicity, religion, hasChildren 
      });
      return new NextResponse(
        JSON.stringify({ message: 'All fields are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Age validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18) {
      return new NextResponse(
        JSON.stringify({ message: 'You must be 18 or older to register' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Bio validation
    if (bio.length > 120) {
      return new NextResponse(
        JSON.stringify({ message: 'Bio must not exceed 120 characters' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid email format' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: 'User already exists' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age: ageNum,
        gender,
        location,
        occupation,
        bio,
        hairColor,
        eyeColor,
        height,
        ethnicity,
        religion,
        hasChildren
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return new NextResponse(
      JSON.stringify({ 
        message: 'User created successfully', 
        user: userWithoutPassword 
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({ message: `Error creating user: ${error.message}` }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: 'Error creating user' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } finally {
    await prisma.$disconnect();
  }
} 