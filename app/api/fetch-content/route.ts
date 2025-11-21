import { createClient } from "@/utils/supbase/server";
import { NextResponse } from "next/server";

interface Story {
  id: number;
  url: string;
  title: string;
  by: string;
  score: number;
  time: string;
}

export async function POST() {
  const hn: Array<number> = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  ).then((res) => res.json());
  const supabase = await createClient();

  try {
    if (hn.length) {
      const response = await Promise.all(
        hn.slice(0, 20).map((id: number) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then((resp) => resp.json())
            .then(
              async (story: Story) =>
                await fetch(story.url, { method: "HEAD" }).then((resp) =>
                  resp.headers.get("x-frame-options") === null ? story : null
                )
            )
        )
      );

      const filteredUrls = response.filter((story) => story !== null);

      const { error } = await supabase.from("stories").upsert(
        filteredUrls.map((story) => ({
          hn_object_id: story.id,
          title: story.title,
          url: story.url,
          domain: "",
          author: story.by,
          score: story.score,
          created_at: new Date(story.time).toISOString(),
          fetched_at: new Date().toISOString(),
        })),
        {
          onConflict: "hn_object_id",
        }
      );

      if (error) throw error;

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }

  return NextResponse.json({});
}
