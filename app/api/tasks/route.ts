import { supabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const { taskId, isComplete } = await request.json();
    console.log(taskId);
    const { data, error } = await supabase
      .from("tasks")
      .update({ isComplete })
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
