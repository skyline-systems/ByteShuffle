import { createClient } from "@/utils/supbase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("stories").select("*").limit(20);
  if (error) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
  const randomStory = data[Math.floor(Math.random() * data.length)];

  return NextResponse.json(randomStory);
}
