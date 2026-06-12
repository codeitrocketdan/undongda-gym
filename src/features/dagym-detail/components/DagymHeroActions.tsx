"use client";

import { clientFetcher } from "@/shared/api/clientFetcher";
import Button from "@/shared/ui/button/Button";
import { HeartButton } from "@/shared/ui/heart-button/HeartButton";

interface Props {
  dagymId: number;
  isFavorited: boolean;
}

export default function DagymHeroActions({ dagymId, isFavorited }: Props) {
  const handleFavorite = async () => {};

  const handleJoin = async () => {
    const res = await clientFetcher.post(
      `${process.env.NEXT_PUBLIC_API_URL}/meetings/1578/join)`
    );
    console.log(res);
  };

  return (
    <div className="flex items-center gap-4">
      <HeartButton
        className="shrink-0"
        isFavorited={isFavorited}
        onClick={handleFavorite}
      />

      <Button onClick={handleJoin}>참여하기</Button>
    </div>
  );
}
