import express from "express";
import cors from "cors";
import { pelicanRouter } from "./routers/pelicanRouter.js";
import env from "./env.js";

const app = express();
const port = env.PORT;

app.use(cors());
app.use(express.json());

app.use("/pelicans", pelicanRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
