import { createClient } from "@/utils/supbase/server";

export default async function Page() {
  const supabase = await createClient();
  // TODO: Implement caching with redis
  const { data, error } = await supabase.from("stories").select("*").limit(20);
  if (error || !data || data.length === 0) {
    return (
      <>
        <h1>No site available</h1>
      </>
    );
  }
  const site = data[Math.floor(Math.random() * data.length)];

  console.log(site);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col h-screen justify-center items-center">
        <a href={site.url} target="_blank">
          <img className="mt-4" src={site.screenshot_url} width={800} />
          <h1 className="text-xl">{site.title}</h1>
        </a>
      </div>
    </div>
  );
}
