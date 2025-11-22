import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/utils/supbase/server";
import Firecrawl from "@mendable/firecrawl-js";
import { NextResponse } from "next/server";

const uploadImageToSupabaseS3 = async (
  imageArrayBuffer: ArrayBuffer,
  imageId: string
) => {
  const s3Client = new S3Client({
    forcePathStyle: true,
    region: "us-west-2",
    endpoint: process.env.S3_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_ACCESS_KEY!,
    },
  });

  const uploadCommand = new PutObjectCommand({
    Bucket: "screenshots",
    Key: `${imageId}.png`,
    Body: Buffer.from(imageArrayBuffer),
    ContentType: "image/png",
  });

  await s3Client.send(uploadCommand);

  return `https://aiijacfkmnacrzrsduta.storage.supabase.co/storage/v1/object/public/screenshots/${imageId}.png`;
};

export async function POST() {
  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });
  const supabase = await createClient();

  try {
    const { data: urlsWithoutScreenshot } = await supabase
      .from("stories")
      .select("url, hn_object_id, screenshot_url")
      .is("screenshot_url", null)
      .limit(20);

    if (urlsWithoutScreenshot && urlsWithoutScreenshot.length > 0) {
      const screenshotResponses = await Promise.all(
        urlsWithoutScreenshot.map((site) =>
          firecrawl
            .scrape(site.url, {
              formats: [
                {
                  type: "screenshot",
                  options: {
                    width: 1280,
                    height: 720,
                    quality: 90,
                  },
                },
              ],
            })
            .then((scrapeResponse) => ({
              hn_object_id: site.hn_object_id,
              screenshot: scrapeResponse.screenshot,
            }))
            .catch((error) => {
              if (error.toString().toLowerCase().includes("error")) {
                console.warn(
                  `Firecrawl error for ${site.url} | ${site.hn_object_id}`
                );
                return {
                  screenshot: null,
                  hn_object_id: site.hn_object_id,
                };
              }
              throw error;
            })
        )
      );

      console.log("screenshotResponses", screenshotResponses);

      const imageArrayBuffers = await Promise.all(
        screenshotResponses
          .filter((scrapeResponse) => scrapeResponse.screenshot)
          .map((scrapeResponse) =>
            fetch(scrapeResponse.screenshot as string).then(async (res) => ({
              arrayBuffer: await res.arrayBuffer(),
              hn_object_id: scrapeResponse.hn_object_id,
            }))
          )
      );

      console.log("imageArrayBuffers", imageArrayBuffers);

      const fileUrls = await Promise.all(
        imageArrayBuffers.map(async (image) => ({
          screenshot_url: await uploadImageToSupabaseS3(
            image.arrayBuffer,
            image.hn_object_id
          ),
          hn_object_id: image.hn_object_id,
        }))
      );

      console.log("fileUrls", fileUrls);

      await Promise.all(
        fileUrls.map((fileUrl) =>
          supabase
            .from("stories")
            .update({
              screenshot_url: fileUrl.screenshot_url,
              screenshot_at: new Date().toISOString(),
            })
            .eq("hn_object_id", fileUrl.hn_object_id)
        )
      );

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
