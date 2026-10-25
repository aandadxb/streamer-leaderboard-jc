import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { streamerImageResponse } from "@/lib/streamer-image-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const streamerId = parseInt(id, 10);
  if (isNaN(streamerId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const streamer = await prisma.streamer.findUnique({
    where: { id: streamerId },
    select: { avatar: true, avatarMimeType: true },
  });

  if (!streamer || !streamer.avatar) {
    return new NextResponse(null, { status: 404 });
  }

  return streamerImageResponse(
    streamer.avatar,
    streamer.avatarMimeType,
    "image/jpeg",
  );
}
