export default async function Page() {
  const data = await fetch("http://localhost:3000//api/random");
  const story = await data.json();
  console.log({ story });
  return <iframe src={story.url} width={600} height={500} />;
}
