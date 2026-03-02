import { Router } from "express";
import type { Image } from "../interfaces/image.js";

type ImageService = {
  getRandomImage: (query: string) => Promise<Image>;
};

export const createPelicanRouter = (imageService: ImageService) => {
  const router = Router();

  router.get("/random", async (req, res) => {
    try {
      const pelicanQuery = "pelican";
      const image = await imageService.getRandomImage(pelicanQuery);
      res.json({ url: image.url });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: errorMessage });
    }
  });

  return router;
};
