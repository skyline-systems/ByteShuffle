import { createClient } from "@/utils/supbase/server";
import { NextResponse } from "next/server";

import dataset from "@/dataset/geminiinteresting.json";

export async function GET() {
  return NextResponse.json({ data: dataset });
}

export async function POST() {
  const supabase = await createClient();
  // const response = await fetch(
  //   "https://reddit.com/r/InternetIsBeautiful/top.json?t=all&limit=100",
  //   {
  //     headers: {
  //       "User-Agent": "ByteShuffle/0.1",
  //     },
  //   }
  // ).then((res) => res.json());
  const response = dataset;

  if (response) {
    // const urls: Url[] = response.websites.map((item) => ({
    //   url: item.data.url,
    //   id: item.data.id,
    //   title: item.data.title,
    //   author: item.data.author,
    //   score: item.data.score,
    //   subreddit: item.data.subreddit,
    //   content_source_url: `https://reddit.com${item.data.permalink}`,
    //   created_at: item.data.created * 1000, // convert to milliseconds
    // }));
    // console.log({ urls });

    try {
      const { data, error } = await supabase.from("websites").upsert(
        response.websites.map((site) => ({
          title: site.name,
          url: site.url,
          category: site.category,
          description: site.description,
        })),
        {
          onConflict: "url",
        }
      );

      if (error) throw error;

      return NextResponse.json({ items: response.websites.length, data });
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        error: "internal server error",
      });
    }
  }

  return NextResponse.json({ error: "Failed to fetch URLs" });
}
