import { Database } from "@/database.types";
import { Button, ButtonGroup, Card, CardBody } from "@heroui/react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { ExternalLink, Heart, HeartCrack, ThumbsDown } from "lucide-react";
import { JSX } from "react";

interface MainProps {
  siteData: Pick<
    Database["public"]["Tables"]["websites"]["Row"],
    "id" | "url" | "screenshot_url" | "title" | "description"
  >;
  siteImage: JSX.Element;
  like: number | null;
  handleLike: (likeValue: number) => void;
  isPending: boolean;
  likeResponse: PostgrestSingleResponse<number> | null;
}

export const Main = ({
  siteData,
  siteImage,
  like,
  handleLike,
  isPending,
  likeResponse,
}: MainProps) => {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="flex-1">
        <Card className="py-4">
          <CardBody className="overflow-visible py-2">{siteImage}</CardBody>
        </Card>
      </div>
      <div className="flex-1">
        <a
          href={siteData.url}
          target="_blank"
          className="flex items-center gap-2 text-gray-900 hover:text-blue-600"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            {siteData.title}
          </h2>
          <ExternalLink />
        </a>
        <p>{siteData.description}</p>
        <ButtonGroup className="mt-4 w-full">
          {like === null || like === 1 ? (
            <Button
              endContent={<Heart size="24" />}
              aria-label="Like"
              color="success"
              onPress={() => handleLike(1)}
              className="w-full text-white"
              isLoading={isPending}
              disabled={like === 1}
            >
              Like {likeResponse?.data ?? ""}
            </Button>
          ) : null}
          {like === null || like === 0 ? (
            <Button
              endContent={<HeartCrack size="24" />}
              aria-label="Dislike"
              color="danger"
              onPress={() => handleLike(0)}
              className="w-full text-white"
              isLoading={isPending}
              disabled={like === 0}
            >
              Dislike {likeResponse?.data ?? ""}
            </Button>
          ) : null}
        </ButtonGroup>
      </div>
    </div>
  );
};
