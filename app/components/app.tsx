"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { ShuffleButton } from "./shuffle-button";
import { Database } from "database.types";
import Image from "next/image";
import { Header } from "./header";
import { Main } from "./main";
import { updateLikesAction } from "../actions";

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
  const [like, setLike] = useState<number | null>(null);
  const [fresh, setFresh] = useState(true);
  const [likeResponse, updateLikes, isPending] = useActionState(
    updateLikesAction,
    null
  );

  useEffect(() => {
    if (likeResponse?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFresh(false);
    }
  }, [likeResponse]);

  const handleLike = (likeValue: number) => {
    setLike(likeValue);
    const siteId = getDataSlice(currentIndex).id;

    const fd = new FormData();
    fd.set("siteId", siteId.toString());
    fd.set("like", likeValue.toString());

    startTransition(() => updateLikes(fd));
  };

  const handleShuffle = () => {
    setStart(start + 1);
    setCurrentIndex((currentIndex + 1) % 5);
    setLike(null);
    setFresh(true);
  };

  const getDataSlice = (index: number) =>
    data[shuffledIndexes.slice(start, start + 5)[index]];

  const sliceOfImages = new Array(5).fill(1).map((_, i) => {
    const IMG_WIDTH = 800;
    const IMG_HEIGHT = (720 / 1280) * 800;
    const site = getDataSlice(i);
    const siteScreenshot =
      site.screenshot_url ?? `https://placehold.co/${IMG_WIDTH}x${IMG_HEIGHT}`;

    return (
      <Image
        key={i}
        loading="eager"
        className="rounded-lg"
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header handleShuffle={handleShuffle} />
        <Main
          siteData={getDataSlice(currentIndex)}
          siteImage={sliceOfImages[currentIndex]}
          like={like}
          handleLike={handleLike}
          isPending={isPending}
          likeResponse={!fresh ? likeResponse : null}
        />
        <div className="hidden">{sliceOfImages}</div>
      </div>
      <div className="absolute h-[48px] bottom-10 md:top-4 left-[calc(50%-75px)]">
        <ShuffleButton handleShuffle={handleShuffle} />
      </div>
    </>
  );
};
