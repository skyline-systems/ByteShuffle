"use client";

import { useState } from "react";
import { ShuffleButton } from "./shuffle-button";
import { Database } from "database.types";
import Image from "next/image";

interface AppProps {
  data: Array<
    Pick<
      Database["public"]["Tables"]["stories"]["Row"],
      "id" | "url" | "screenshot_url" | "title"
    >
  >;
  shuffledIndexes: Array<number>;
}

export const App = ({ data, shuffledIndexes }: AppProps) => {
  const [start, setStart] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        alt={site.title}
        priority
      />
    );
  });

  return (
    <>
      <ShuffleButton handleShuffle={handleShuffle} />
      <div className="hidden">{sliceOfImages}</div>
      {sliceOfImages[currentIndex]}
      <p>{getDataSlice(currentIndex).title}</p>
      <p>{getDataSlice(currentIndex).url}</p>
    </>
  );
};
