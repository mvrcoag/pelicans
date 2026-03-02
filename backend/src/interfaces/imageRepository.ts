import type { Image } from "./image.js";

export interface ImageRepository {
  getRandomImage(query: string): Promise<Image>;
}
