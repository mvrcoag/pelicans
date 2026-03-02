import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createPelicanRouter } from "./pelicanRouter.js";

describe("pelicanRouter", () => {
  it("returns a random pelican image", async () => {
    const imageService = {
      getRandomImage: vi
        .fn()
        .mockResolvedValue({ id: "img-1", url: "http://example.com/image.jpg" }),
    };

    const app = express();
    app.use("/pelicans", createPelicanRouter(imageService));

    const response = await request(app).get("/pelicans/random");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ url: "http://example.com/image.jpg" });
    expect(imageService.getRandomImage).toHaveBeenCalledWith("pelican");
  });

  it("returns 500 when the image service fails", async () => {
    const imageService = {
      getRandomImage: vi.fn().mockRejectedValue(new Error("boom")),
    };

    const app = express();
    app.use("/pelicans", createPelicanRouter(imageService));

    const response = await request(app).get("/pelicans/random");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "boom" });
  });
});
