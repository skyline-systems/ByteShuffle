export default async function Page() {
  const data = await fetch(`https://${process.env.VERCEL_URL}/api/random`);
  const story = await data.json();
  console.log({ story });
  return <iframe src={story.url} width={600} height={500} />;
}
