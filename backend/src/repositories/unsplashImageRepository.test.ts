import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { unsplashImageRepository } from "./unsplashImageRepository.js";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

type MockedAxios = {
  get: ReturnType<typeof vi.fn>;
  isAxiosError: ReturnType<typeof vi.fn>;
};

const mockedAxios = axios as unknown as MockedAxios;

describe("unsplashImageRepository", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.isAxiosError.mockReset();
  });

  it("maps the Unsplash response into an image", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        id: "img-1",
        urls: { regular: "http://example.com/image.jpg" },
      },
    });

    const image = await unsplashImageRepository.getRandomImage("pelican");

    expect(image).toEqual({
      id: "img-1",
      url: "http://example.com/image.jpg",
    });
  });

  it("returns the fallback image on 403 responses", async () => {
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedAxios.get.mockRejectedValue({ status: 403 });

    const image = await unsplashImageRepository.getRandomImage("pelican");

    expect(image.id).toBe("default");
    expect(image.url).toContain("images.unsplash.com");
  });
});
