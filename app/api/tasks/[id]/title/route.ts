import { supabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { title } = await request.json();
    const { id: taskId } = await params;
    console.log(taskId);
    const { data, error } = await supabase
      .from("tasks")
      .update({ title })
      .eq("id", taskId)
      .select();
    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update task",
      },
      { status: 500 }
    );
  }
}
