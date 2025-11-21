import { NextResponse } from "next/server";

export async function GET() {
  const html = await fetch(
    "https://www.rochester.edu/newscenter/employee-turnover-why-top-firms-churn-good-workers-681832/"
  ).then((res) => res.text());

  return new NextResponse(html);
}
