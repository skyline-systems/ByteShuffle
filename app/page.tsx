import { createClient } from "@/utils/supbase/server";

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

  return (
    <>
      <h1>{process.env.VERCEL_ENV}</h1>
      <h1>{process.env.VERCEL_URL}</h1>
      <iframe src={story.url} width={600} height={500} />
    </>
  );
}
