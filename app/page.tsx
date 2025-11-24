import { createClient } from "@/utils/supbase/server";
import { App } from "./components/app";
import { shuffle } from "lodash";

export default async function Page() {
  const supabase = await createClient();
  // TODO: Implement caching with redis
  const { data, error } = await supabase
    .from("websites")
    .select("id, url, screenshot_url, title, description")
    .not("screenshot_url", "is", null);

  if (error || !data || data.length === 0) {
    return (
      <>
        <h1>No site available</h1>
      </>
    );
  }

  console.log({ data });

  /**
   * the `shuffledIndexes` array is an array of shuffled indices that correspond to an element
   * in the sites dataset.
   */

  const shuffledIndexes = shuffle(
    new Array(data.length).fill(1).map((x, i) => i)
  );

  return <App data={data} shuffledIndexes={shuffledIndexes} />;
}
