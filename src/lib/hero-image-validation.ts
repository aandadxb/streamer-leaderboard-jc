import { imageSize } from "image-size";
import {
  HERO_IMAGE_REQUIREMENTS,
  HERO_MAX_IMAGE_SIZE_BYTES,
  type HeroImageKind,
} from "@/lib/hero-config";

export async function readValidatedHeroImage(
  file: File,
  kind: HeroImageKind
): Promise<
  { bytes: Uint8Array<ArrayBuffer>; mimeType: string } | { error: string }
> {
  const requirement = HERO_IMAGE_REQUIREMENTS[kind];

  if (!(requirement.mimeTypes as readonly string[]).includes(file.type)) {
    return {
      error: `${requirement.label} must be ${requirement.formatsLabel}.`,
    };
  }

  if (file.size > HERO_MAX_IMAGE_SIZE_BYTES) {
    return {
      error: `${requirement.label} must be 5MB or smaller.`,
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let dimensions: ReturnType<typeof imageSize>;
  try {
    dimensions = imageSize(Buffer.from(bytes));
  } catch {
    return {
      error: `${requirement.label} could not be read as a valid image.`,
    };
  }

  if (
    dimensions.width !== requirement.width ||
    dimensions.height !== requirement.height
  ) {
    return {
      error: `${requirement.label} must be exactly ${requirement.width}x${requirement.height}px.`,
    };
  }

  return { bytes, mimeType: file.type };
}
