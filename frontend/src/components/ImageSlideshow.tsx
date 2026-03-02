import "../styles/ImageSlideshow.css";
import { useEffect, useState } from "react";

type ImageSlideshowProps = {
  imageUrls: string[];
  interval?: number;
};

let timer: number | undefined;

export function ImageSlideshow({
  imageUrls,
  interval = 2000,
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const isEmpty = imageUrls.length === 0;

  function handleNext() {
    if (isEmpty) return;
    if (currentIndex === -1) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  }

  function handlePrevious() {
    if (isEmpty) return;
    if (currentIndex === 0) {
      setCurrentIndex(-1);
      return;
    }
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length,
    );
  }

  function handlePause() {
    setIsPaused((prev) => !prev);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageUrls.length]);

  useEffect(() => {
    if (isEmpty) return;

    if (isPaused) {
      if (timer) {
        clearInterval(timer);
      }
      return;
    }

    timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [imageUrls.length, interval, isPaused]);

  return (
    <div className="image-slideshow">
      <button
        className="prev-button"
        onClick={handlePrevious}
        disabled={isEmpty || currentIndex === -1}
      >
        {"<"}
      </button>
      {currentIndex === -1 ? (
        <div className="placeholder">No previous image</div>
      ) : (
        <img src={imageUrls[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
      )}
      <button className="next-button" onClick={handleNext}>
        {">"}
      </button>

      <button className="pause-button" onClick={handlePause}>
        {isPaused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
