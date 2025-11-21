import { createClient } from "@/utils/supbase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .limit(20)
    .order("score", { ascending: false });
  return NextResponse.json(data);
}

interface Story {
  _tags: string[];
  url: string;
  title: string;
  author: string;
  points: number;
  created_at: string;
}

interface HackerNewsAPI {
  hits: Story[];
}

export async function POST() {
  const hn: HackerNewsAPI = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=front_page"
  ).then((res) => res.json());
  const supabase = await createClient();

  try {
    if (hn.hits) {
      const { error } = await supabase.from("stories").insert(
        hn.hits
          .filter((story) => !story._tags.includes("ask_hn") || story.url)
          .map((story) => ({
            title: story.title,
            url: story.url,
            domain: "",
            author: story.author,
            score: story.points,
            created_at: story.created_at,
            fetched_at: new Date().toISOString(),
          }))
      );
      if (error) {
        throw error;
      }
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json(hn);
}
