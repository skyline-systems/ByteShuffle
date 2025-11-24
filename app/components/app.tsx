"use client";

import { useState } from "react";
import { ShuffleButton } from "./shuffle-button";
import { Database } from "database.types";
import Image from "next/image";
import { Heart, ThumbsDown } from "lucide-react";
import { Button } from "@heroui/button";

interface AppProps {
  data: Array<
    Pick<
      Database["public"]["Tables"]["websites"]["Row"],
      "id" | "url" | "screenshot_url" | "title" | "description"
    >
  >;
  shuffledIndexes: Array<number>;
}

export const App = ({ data, shuffledIndexes }: AppProps) => {
  const [start, setStart] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLikeClick = () => {};

  const handleShuffle = () => {
    setStart(start + 1);
    setCurrentIndex((currentIndex + 1) % 5);
  };

  const getDataSlice = (index: number) =>
    data[shuffledIndexes.slice(start, start + 5)[index]];

  const sliceOfImages = new Array(5).fill(1).map((_, i) => {
    const IMG_WIDTH = 800;
    const IMG_HEIGHT = (720 / 1280) * 800;
    const site = getDataSlice(i);
    let siteScreenshot =
      site.screenshot_url ?? `https://placehold.co/${IMG_WIDTH}x${IMG_HEIGHT}`;

    return (
      <Image
        key={i}
        loading="eager"
        className="mt-4"
        src={siteScreenshot}
        width={IMG_WIDTH}
        height={IMG_HEIGHT}
        alt={site.title || ""}
        priority
      />
    );
  });

  return (
    <>
      <div className="p-2 bg-blue-100 flex items-center justify-center gap-2">
        <Button isIconOnly aria-label="Like" color="danger" radius="sm">
          <Heart />
        </Button>
        <ShuffleButton handleShuffle={handleShuffle} />
        <Button
          isIconOnly
          aria-label="Like"
          // color="blue.200"
          variant="flat"
          radius="sm"
          className="bg-blue-200"
        >
          <ThumbsDown />
        </Button>
      </div>
      <div className="hidden">{sliceOfImages}</div>
      {sliceOfImages[currentIndex]}
      <p>{getDataSlice(currentIndex).title}</p>
      <p>{getDataSlice(currentIndex).url}</p>
      <p>{getDataSlice(currentIndex).description}</p>
    </>
  );
};
