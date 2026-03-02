import type { Image } from "../interfaces/image.js";
import type { ImageRepository } from "../interfaces/imageRepository.js";
import axios from "axios";
import env from "../env.js";

const BASE_URL = "https://api.unsplash.com";

type UnsplashImageResponse = {
  id: string;
  urls: {
    regular: string;
  };
};

export const unsplashImageRepository: ImageRepository = {
  getRandomImage: async (query: string): Promise<Image> => {
    try {
      const response = await axios.get<UnsplashImageResponse>(
        `${BASE_URL}/photos/random?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
          },
        },
      );
      const image: Image = {
        id: response.data.id,
        url: response.data.urls.regular,
      };
      return image;
    } catch (error) {
      console.error("Error fetching random image from Unsplash:", error);
      throw new Error("Failed to fetch random image from Unsplash");
    }
  },
};
