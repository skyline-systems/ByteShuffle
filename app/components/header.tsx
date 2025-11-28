"use client";

import { Button } from "@heroui/react";

import { Plus } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="my-4 p-4 flex justify-between items-center">
      <Link
        className="text-3xl font-bold tracking-tight text-gray-900"
        href="/"
      >
        ByteShuffle
      </Link>
      <Button as={Link} endContent={<Plus />} color="warning" href="/submit">
        Submit
      </Button>
    </div>
  );
};
