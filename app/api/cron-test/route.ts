import { createClient } from "@/utils/supbase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  await supabase.from("tester").insert({});

  return NextResponse.json({});
}
