import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImageSlideshow } from "./ImageSlideshow";

const baseProps = {
  imageUrls: ["http://image-1"],
  currentIndex: 0,
  error: null,
  isLoading: false,
  noMoreImages: false,
  onNext: vi.fn(),
  onPrevious: vi.fn(),
};

describe("ImageSlideshow", () => {
  it("renders a loading state when there are no images", () => {
    render(
      <ImageSlideshow
        {...baseProps}
        imageUrls={[]}
        isLoading={true}
      />,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the no-more-images message", () => {
    render(
      <ImageSlideshow
        {...baseProps}
        noMoreImages={true}
      />,
    );

    expect(screen.getByText("No more images!")).toBeInTheDocument();
  });

  it("renders indicators for each image", () => {
    const { container } = render(
      <ImageSlideshow
        {...baseProps}
        imageUrls={["http://image-1", "http://image-2", "http://image-3"]}
        currentIndex={1}
      />,
    );

    expect(container.querySelectorAll(".indicator")).toHaveLength(3);
    expect(container.querySelectorAll(".indicator.active")).toHaveLength(1);
  });

  it("toggles play and pause with the space bar", () => {
    render(<ImageSlideshow {...baseProps} />);

    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();

    fireEvent.keyDown(window, { code: "Space", key: " " });
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

    fireEvent.keyDown(window, { code: "Space", key: " " });
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });
});
