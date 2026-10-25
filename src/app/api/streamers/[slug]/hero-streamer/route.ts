import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { streamerImageResponse } from "@/lib/streamer-image-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const streamer = await prisma.streamer.findUnique({
    where: { slug },
    select: { heroStreamerImage: true, heroStreamerImageMimeType: true },
  });

  if (!streamer?.heroStreamerImage) {
    return new NextResponse(null, { status: 404 });
  }

  return streamerImageResponse(
    streamer.heroStreamerImage,
    streamer.heroStreamerImageMimeType,
    "image/png",
  );
}
