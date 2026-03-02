import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSlideshow } from "./useSlideshow";

describe("useSlideshow", () => {
  it("fetches an initial image on mount", async () => {
    const fetchImage = vi.fn().mockResolvedValue({ url: "http://image-1" });

    const { result } = renderHook(() =>
      useSlideshow({ fetchImage, maxImages: 5 }),
    );

    await waitFor(() => expect(result.current.imageUrls).toHaveLength(1));
    expect(fetchImage).toHaveBeenCalledTimes(1);
    expect(result.current.imageUrls[0]).toBe("http://image-1");
  });

  it("uses cached images before fetching new ones", async () => {
    const fetchImage = vi
      .fn()
      .mockResolvedValueOnce({ url: "http://image-1" })
      .mockResolvedValueOnce({ url: "http://image-2" });

    const { result } = renderHook(() =>
      useSlideshow({ fetchImage, maxImages: 5 }),
    );

    await waitFor(() => expect(result.current.imageUrls).toHaveLength(1));

    await act(async () => {
      await result.current.showNextImage();
    });

    await waitFor(() => expect(result.current.imageUrls).toHaveLength(2));

    await act(async () => {
      result.current.showPreviousImage();
    });

    await act(async () => {
      await result.current.showNextImage();
    });

    expect(fetchImage).toHaveBeenCalledTimes(2);
    expect(result.current.currentIndex).toBe(1);
  });

  it("sets noMoreImages when there is no previous image", async () => {
    const fetchImage = vi.fn().mockResolvedValue({ url: "http://image-1" });

    const { result } = renderHook(() =>
      useSlideshow({ fetchImage, maxImages: 5 }),
    );

    await waitFor(() => expect(result.current.imageUrls).toHaveLength(1));

    await act(async () => {
      result.current.showPreviousImage();
    });

    expect(result.current.noMoreImages).toBe(true);
  });

  it("keeps only the most recent five images", async () => {
    const fetchImage = vi
      .fn()
      .mockResolvedValueOnce({ url: "http://image-1" })
      .mockResolvedValueOnce({ url: "http://image-2" })
      .mockResolvedValueOnce({ url: "http://image-3" })
      .mockResolvedValueOnce({ url: "http://image-4" })
      .mockResolvedValueOnce({ url: "http://image-5" })
      .mockResolvedValueOnce({ url: "http://image-6" });

    const { result } = renderHook(() =>
      useSlideshow({ fetchImage, maxImages: 5 }),
    );

    await waitFor(() => expect(result.current.imageUrls).toHaveLength(1));

    for (let i = 0; i < 5; i += 1) {
      await act(async () => {
        await result.current.showNextImage();
      });
    }

    await waitFor(() => expect(result.current.imageUrls).toHaveLength(5));
    expect(result.current.imageUrls[0]).toBe("http://image-2");
    expect(result.current.imageUrls[4]).toBe("http://image-6");
    expect(result.current.currentIndex).toBe(4);
  });
});
