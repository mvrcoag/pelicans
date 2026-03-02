import { describe, expect, it } from "vitest";
import { createImageService } from "./imageService.js";

describe("createImageService", () => {
  it("returns image from repository", async () => {
    const repository = {
      getRandomImage: async () => ({ id: "1", url: "http://example.com" }),
    };
    const service = createImageService(repository);

    await expect(service.getRandomImage("pelican")).resolves.toEqual({
      id: "1",
      url: "http://example.com",
    });
  });

  it("throws a wrapped error when repository fails", async () => {
    const repository = {
      getRandomImage: async () => {
        throw new Error("boom");
      },
    };
    const service = createImageService(repository);

    await expect(service.getRandomImage("pelican")).rejects.toThrow(
      "Failed to fetch random image",
    );
  });
});
