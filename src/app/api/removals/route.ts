/** @format */

import { NextRequest, NextResponse } from "next/server";
import {
  insertRemovalRecordSupabase,
  validateRemovalFormData,
  RemovalFormData,
} from "../../../lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData: RemovalFormData = await request.json();

    // Validate form data
    const validation = validateRemovalFormData(formData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Insert into database
    const recordId = await insertRemovalRecordSupabase(formData);

    return NextResponse.json({
      success: true,
      message: "Removal request submitted successfully",
      id: recordId,
    });
  } catch (error) {
    console.error("Error processing removal form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Removal API endpoint is working",
    methods: ["POST"],
  });
}
