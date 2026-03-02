import express from "express";
import cors from "cors";
import { createPelicanRouter } from "./routers/pelicanRouter.js";
import { unsplashImageRepository } from "./repositories/unsplashImageRepository.js";
import { createImageService } from "./services/imageService.js";
import env from "./env.js";

const app = express();
const port = env.PORT;

app.use(cors());
app.use(express.json());

const imageService = createImageService(unsplashImageRepository);
app.use("/pelicans", createPelicanRouter(imageService));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
