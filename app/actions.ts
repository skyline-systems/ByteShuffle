"use server";

import { createClient } from "@/utils/supbase/server";

export async function updateLikesAction(_: unknown, fd: FormData) {
  const supabase = await createClient();

  const like = Boolean(Number(fd.get("like")));

  const response = await supabase.rpc(
    like ? "increment_likes" : "increment_dislikes",
    {
      site_id: Number(fd.get("siteId")),
    }
  );

  return response;
}
