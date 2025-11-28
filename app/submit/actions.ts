"use server";

import { createClient } from "@/utils/supbase/server";
import { preserveDomainAndTLD } from "../utils";

export const addWebsiteAction = async (_: unknown, formData: FormData) => {
  try {
    const supabase = await createClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert(
        { username: String(formData.get("username")) },
        { onConflict: "username" }
      )
      .select("id")
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    const newUrl = preserveDomainAndTLD(
      String(formData.get("websiteUrl"))
    ).toLowerCase();

    await supabase.from("websites").insert({
      title: String(formData.get("websiteTitle")),
      url: newUrl,
      domain: preserveDomainAndTLD(newUrl),
      description: String(formData.get("websiteDescription")),
      user_submitted: true,
      submitted_by: user.id,
    });
  } catch (error) {
    // TODO: Log error to Sentry
    return {
      error: {
        message: "Something went wrong.",
      },
    };
  }
};
