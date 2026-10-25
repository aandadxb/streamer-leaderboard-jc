import { NextResponse } from "next/server";

const STREAMER_IMAGE_CACHE_CONTROL = "public, max-age=31536000, immutable";

export function streamerImageResponse(
  image: BodyInit,
  mimeType: string | null | undefined,
  fallbackMimeType: string,
) {
  return new NextResponse(image, {
    headers: {
      "Content-Type": mimeType || fallbackMimeType,
      "Cache-Control": STREAMER_IMAGE_CACHE_CONTROL,
    },
  });
}
