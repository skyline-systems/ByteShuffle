import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/utils/supbase/server";
import Firecrawl from "@mendable/firecrawl-js";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { preserveDomainAndTLD } from "@/app/utils";

// import scrapeJob from "@/dataset/scrapejob.json";
// import scrapeJob from "@/dataset/scrapejob2.json";
// import scrapeJob from "@/dataset/scrapejob3.json";

/**
 * `domain` is the website URL with the scheme and subdomain stripped
 */
const uploadImageToSupabaseS3 = async ({
  imageArrayBuffer,
  domain,
  imageFileName,
}: {
  imageArrayBuffer: ArrayBuffer;
  domain: string;
  imageFileName: string;
}) => {
  const s3Client = new S3Client({
    forcePathStyle: true,
    region: "us-west-2",
    endpoint: process.env.S3_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_ACCESS_KEY!,
    },
  });

  const BUCKET_NAME = "websites";
  const KEY_NAME = `${domain}/${imageFileName}.png`;

  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: KEY_NAME,
    Body: Buffer.from(imageArrayBuffer),
    ContentType: "image/png",
  });

  await s3Client.send(uploadCommand);

  return `https://aiijacfkmnacrzrsduta.storage.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${KEY_NAME}`;
};

export async function POST() {
  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });
  const supabase = await createClient();

  try {
    const { data: urlsWithoutScreenshot } = await supabase
      .from("websites")
      .select("id, url, screenshot_url")
      .is("screenshot_url", null);
    // .limit(20);

    if (urlsWithoutScreenshot && urlsWithoutScreenshot.length > 0) {
      // const scrapeResult = await Promise.all(
      //   urlsWithoutScreenshot.map((site) =>
      //     firecrawl
      //       .scrape(site.url, {
      //         proxy: "basic",
      //         waitFor: 2000, // 2 seconds in milliseconds
      //         formats: [
      //           {
      //             type: "screenshot",
      //             quality: 90,
      //             viewport: {
      //               width: 1280,
      //               height: 720,
      //             },
      //           },
      //         ],
      //         maxAge: 604800000, // 1 week in milliseconds
      //       })
      //       .catch((error) => {
      //         console.log(site);
      //         console.log(error);
      //       })
      //   )
      // );

      // return NextResponse.json({ scrapeResult });

      console.log(preserveDomainAndTLD("https://zoomquilt.org"));

      /*

      const reMapScrapedWebsites = scrapeJob.scrapeResult
        .filter((scrapedWebsite) => scrapedWebsite !== null)
        .map((scrapedWebsite) => ({
          screenshot: scrapedWebsite.screenshot,
          domain: preserveDomainAndTLD(scrapedWebsite.metadata.url),
          url: scrapedWebsite.metadata.sourceURL,
        }));

      // return NextResponse.json({ reMapScrapedWebsites });

      const imageArrayBuffers = await Promise.all(
        reMapScrapedWebsites
          .filter((scrapeResponse) => scrapeResponse.screenshot)
          .map((scrapeResponse) =>
            fetch(scrapeResponse.screenshot as string).then(async (res) => ({
              arrayBuffer: await res.arrayBuffer(),
              domain: scrapeResponse.domain,
              url: scrapeResponse.url,
            }))
          )
      );

      const fileUrls = await Promise.all(
        imageArrayBuffers.map(async (image) => ({
          screenshot_url: await uploadImageToSupabaseS3({
            imageArrayBuffer: image.arrayBuffer,
            domain: image.domain,
            imageFileName: uuidv4(),
          }),
          url: image.url,
          domain: image.domain,
        }))
      );

      await Promise.all(
        fileUrls.map((fileUrl) => {
          return (
            supabase
              .from("websites")
              .update({
                url: fileUrl.url,
                screenshot_url: fileUrl.screenshot_url,
                domain: fileUrl.domain,
              })
              // update the website whose url matches the stripped domain
              .eq(
                "url",
                urlsWithoutScreenshot.find((u) =>
                  fileUrl.domain.includes(preserveDomainAndTLD(u.url))
                )?.url ?? ""
              )
          );
        })
      );
      */

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
