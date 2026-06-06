"use client";

import { useEffect } from "react";
import { fbpTrack } from "@/lib/fbpixel";

export function TrackViewContent({
  id,
  name,
  value,
}: {
  id: string;
  name: string;
  value: number;
}) {
  useEffect(() => {
    fbpTrack("ViewContent", {
      content_ids: [id],
      content_name: name,
      content_type: "product",
      value,
      currency: "BRL",
    });
  }, [id, name, value]);

  return null;
}
