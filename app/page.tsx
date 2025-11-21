import { createClient } from "@/utils/supbase/server";

function addBaseTag(htmlString: string, baseUrl: string) {
  const baseTag = `<base href="${baseUrl}">`;
  // insert into <head> if present, otherwise add at top
  if (/<head[^>]*>/i.test(htmlString)) {
    return htmlString.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
  } else {
    return baseTag + htmlString;
  }
}

function getBaseUrl(url: string, useDirectory = false) {
  try {
    // directory base: "https://allenai.org/blog/"  (good for relative "styles.css")
    if (useDirectory) return new URL(".", url).toString();
    // origin base: "https://allenai.org/" (good for root-relative "/assets/*")
    return new URL(url).origin + "/";
  } catch {
    return "/";
  }
}

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("stories").select("*").limit(20);
  if (error || !data || data.length === 0) {
    return (
      <>
        <h1>No story available</h1>
      </>
    );
  }
  const story = data[Math.floor(Math.random() * data.length)];

  const storyUrl = story.url;

  const html = await fetch(story.url).then((res) => res.text());

  return (
    <>
      <h1>{process.env.VERCEL_ENV}</h1>
      <h1>{process.env.VERCEL_URL}</h1>
      <h1>{story.url}</h1>
      {/* TODO: use dompurify for html */}
      {/* <iframe src={"https://allenai.org/blog/olmo3"} width={600} height={500} /> */}
      <iframe
        srcDoc={addBaseTag(html, getBaseUrl(story.url))}
        sandbox="allow-scripts allow-forms allow-same-origin"
        width={600}
        height={500}
      />
    </>
  );
}
