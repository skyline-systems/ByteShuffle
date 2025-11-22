import { createClient } from "@/utils/supbase/server";
import { NextResponse } from "next/server";

interface Url {
  url: string;
  id: string;
  title: string;
  author: string;
  score: number;
  subreddit: string;
  content_source_url: string;
  created_at: number;
}

export async function POST() {
  const supabase = await createClient();
  const response = await fetch(
    "https://reddit.com/r/InternetIsBeautiful/top.json?t=all&limit=100",
    {
      headers: {
        "User-Agent": "ByteShuffle/0.1",
      },
    }
  ).then((res) => res.json());

  if (response) {
    const urls: Url[] = response.data.children.map((item: any) => ({
      url: item.data.url,
      id: item.data.id,
      title: item.data.title,
      author: item.data.author,
      score: item.data.score,
      subreddit: item.data.subreddit,
      content_source_url: `https://reddit.com${item.data.permalink}`,
      created_at: item.data.created * 1000, // convert to milliseconds
    }));
    console.log({ urls });

    const { data, error } = await supabase.from("stories").upsert(
      urls.map((site) => ({
        hn_object_id: site.id,
        title: site.title,
        url: site.url,
        domain: "",
        author: site.author,
        score: site.score,
        subreddit: site.subreddit,
        content_source_url: site.content_source_url,
        created_at: new Date(site.created_at).toISOString(),
        fetched_at: new Date().toISOString(),
      })),
      {
        onConflict: "hn_object_id",
      }
    );

    console.log({ data, error });

    return NextResponse.json({ items: urls.length, data: urls });
  }

  return NextResponse.json({ error: "Failed to fetch URLs" });
}
