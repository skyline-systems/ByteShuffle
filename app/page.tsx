export default async function Page() {
  const data = await fetch(
    `http://${
      process.env.VERCEL_ENV === "development"
        ? "localhost:3000"
        : process.env.VERCEL_URL
    }/api/random`
  );
  const story = await data.json();
  return <iframe src={story.url} width={600} height={500} />;
}
