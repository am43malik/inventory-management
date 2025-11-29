import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const user = await validateRequest();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 200 }
    );
  }
}
