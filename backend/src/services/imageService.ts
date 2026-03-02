import type { Image } from "../interfaces/image.js";
import type { ImageRepository } from "../interfaces/imageRepository.js";

export const createImageService = (imageRepository: ImageRepository) => {
  const getRandomImage = async (query: string): Promise<Image> => {
    try {
      const image = await imageRepository.getRandomImage(query);
      return image;
    } catch (error) {
      console.error("Error fetching random image:", error);
      throw new Error("Failed to fetch random image");
    }
  };

  return {
    getRandomImage,
  };
};
