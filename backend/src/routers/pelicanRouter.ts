import { Router } from "express";
import { unsplashImageRepository } from "../repositories/unsplashImageRepository.js";
import { createImageService } from "../services/imageService.js";

export const pelicanRouter = Router();
const imageService = createImageService(unsplashImageRepository);

pelicanRouter.get("/random", async (req, res) => {
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
