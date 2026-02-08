/** @format */

import { NextRequest, NextResponse } from 'next/server';
import { calculateQuoteAction } from '@/lib/actions/quoteActions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { busRef, furnitureItems, homeSize, distanceMiles, drivingMinutes, noParking, noLift, customerAssistance, difficultAccess, jobId } = body;

    // Validate required fields
    if (!busRef || !furnitureItems || !homeSize) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: busRef, furnitureItems, homeSize' },
        { status: 400 }
      );
    }

    if (!Array.isArray(furnitureItems)) {
      return NextResponse.json(
        { success: false, error: 'furnitureItems must be an array' },
        { status: 400 }
      );
    }

    const result = await calculateQuoteAction({
      busRef,
      furnitureItems,
      homeSize,
      distanceMiles: distanceMiles ?? 0,
      drivingMinutes: drivingMinutes ?? 0,
      noParking: noParking ?? false,
      noLift: noLift ?? false,
      customerAssistance: customerAssistance ?? false,
      difficultAccess: difficultAccess ?? false,
      jobId: jobId ?? undefined,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error('Quote API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
