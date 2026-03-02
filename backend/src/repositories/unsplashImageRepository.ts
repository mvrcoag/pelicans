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
      if (axios.isAxiosError(error)) {
        if (error.status === 403) {
          console.warn(
            "Unsplash API rate limit exceeded. Returning default image.",
          );
          return {
            id: "default",
            url: "https://images.unsplash.com/photo-1600962044096-b22c3a9dd596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4ODU5OTh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI0NTM5OTZ8&ixlib=rb-4.1.0&q=80&w=1080",
          };
        }
      }
      console.error("Error fetching random image from Unsplash:", error);
      throw new Error("Failed to fetch random image from Unsplash");
    }
  },
};
