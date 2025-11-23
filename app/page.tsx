import { createClient } from "@/utils/supbase/server";
import { App } from "./components/app";
import { shuffle } from "lodash";

export default async function Page() {
  const supabase = await createClient();
  // TODO: Implement caching with redis
  const { data, error } = await supabase
    .from("stories")
    .select("id, url, screenshot_url, title")
    .not("screenshot_url", "is", null);

  if (error || !data || data.length === 0) {
    return (
      <>
        <h1>No site available</h1>
      </>
    );
  }

  /**
   * the `shuffledIndexes` array is an array of shuffled indices that correspond to an element
   * in the sites dataset.
   */

  const shuffledIndexes = shuffle(
    new Array(data.length).fill(1).map((x, i) => i)
  );

  return (
    <div className="container mx-auto">
      <App data={data} shuffledIndexes={shuffledIndexes} />
    </div>
  );
}
