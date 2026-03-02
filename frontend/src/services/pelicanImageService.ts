import { api } from "../lib/api";

type PelicanImage = {
  id: string;
  url: string;
};

export const pelicanImageService = {
  async getRandomImage() {
    try {
      const response = await api.get<PelicanImage>("/pelicans/random");
      return response.data;
    } catch (error) {
      console.error("Error fetching pelican image:", error);
      throw error;
    }
  },
};
