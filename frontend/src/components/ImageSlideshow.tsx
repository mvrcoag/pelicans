import "../styles/ImageSlideshow.css";
import { useCallback, useEffect, useRef, useState } from "react";

type ImageSlideshowProps = {
  imageUrls: string[];
  interval?: number;
};

export function ImageSlideshow({
  imageUrls,
  interval = 2000,
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const timerRef = useRef<number | null>(null);
  const isEmpty = imageUrls.length === 0;

  const handleNext = useCallback(() => {
    if (isEmpty) return;
    if (showPlaceholder) {
      setShowPlaceholder(false);
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  }, [isEmpty, showPlaceholder, imageUrls.length]);

  const handlePrevious = useCallback(() => {
    if (isEmpty) return;
    if (currentIndex === 0) {
      setShowPlaceholder(true);
      return;
    }
    setShowPlaceholder(false);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length,
    );
  }, [currentIndex, isEmpty, imageUrls.length]);

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
  }, [handleNext, handlePrevious]);

  useEffect(() => {
    if (isEmpty) {
      setCurrentIndex(0);
      setShowPlaceholder(false);
      return;
    }

    if (currentIndex >= imageUrls.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, imageUrls.length, isEmpty]);

  useEffect(() => {
    if (isEmpty) return;

    if (isPaused) {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(handleNext, interval);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [handleNext, interval, isEmpty, isPaused]);

  return (
    <div className="image-slideshow">
      <button
        className="prev-button"
        onClick={handlePrevious}
        disabled={isEmpty || showPlaceholder}
      >
        {"<"}
      </button>
      {isEmpty ? (
        <div className="placeholder">No images</div>
      ) : showPlaceholder ? (
        <div className="placeholder">No previous image</div>
      ) : (
        <img src={imageUrls[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
      )}
      <button className="next-button" onClick={handleNext} disabled={isEmpty}>
        {">"}
      </button>

      <button className="pause-button" onClick={handlePause}>
        {isPaused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
