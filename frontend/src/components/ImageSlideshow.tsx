import "../styles/ImageSlideshow.css";
import { useCallback, useEffect, useRef, useState } from "react";

type ImageSlideshowProps = {
  imageUrls: string[];
  currentIndex: number;
  error: string | null;
  isLoading: boolean;
  noMoreImages: boolean;
  onNext: () => void;
  onPrevious: () => void;
  interval?: number;
};

export function ImageSlideshow({
  imageUrls,
  currentIndex,
  error,
  isLoading,
  noMoreImages,
  onNext,
  onPrevious,
  interval = 2000,
}: ImageSlideshowProps) {
  const [isPaused, setIsPaused] = useState(true);
  const timerRef = useRef<number | null>(null);
  const isEmpty = imageUrls.length === 0;
  const hasImage = !isEmpty && currentIndex >= 0 && currentIndex < imageUrls.length;
  const showIndicators = imageUrls.length > 0;

  const handlePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        onNext();
      } else if (event.key === "ArrowLeft") {
        onPrevious();
      } else if (event.code === "Space" || event.key === " ") {
        event.preventDefault();
        handlePause();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePause, onNext, onPrevious]);

  useEffect(() => {
    if (isEmpty || isLoading) return;

    if (isPaused) {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(onNext, interval);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [interval, isEmpty, isLoading, isPaused, onNext]);

  const placeholderMessage = (() => {
    if (isLoading && isEmpty) return "Loading...";
    if (error) return error;
    if (noMoreImages) return "No more images!";
    if (isEmpty) return "No images";
    return null;
  })();

  return (
    <div className="image-slideshow">
      <h1 className="slideshow-title">Pelicanslide!</h1>
      <button
        className="prev-button"
        onClick={onPrevious}
        disabled={isEmpty}
      >
        {"<"}
      </button>
      <div className="slideshow-content">
        {placeholderMessage ? (
          <div className="placeholder">{placeholderMessage}</div>
        ) : hasImage ? (
          <img
            key={`${currentIndex}-${imageUrls[currentIndex]}`}
            className="slide-image"
            src={imageUrls[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
          />
        ) : (
          <div className="placeholder">No images</div>
        )}
      </div>
      <div className="loading-slot" aria-live="polite">
        <span
          className={`loading-indicator${isLoading && !isEmpty ? " is-visible" : ""}`}
          aria-hidden={!isLoading || isEmpty}
        >
          Loading new image...
        </span>
      </div>
      {showIndicators ? (
        <div className="indicators" aria-label="Slideshow indicators">
          {imageUrls.map((url, index) => (
            <span
              key={`${index}-${url}`}
              className={`indicator${index === currentIndex ? " active" : ""}`}
              aria-current={index === currentIndex ? "true" : undefined}
            />
          ))}
        </div>
      ) : null}
      <button
        className="next-button"
        onClick={onNext}
        disabled={isEmpty || isLoading}
      >
        {">"}
      </button>

      <button className="pause-button" onClick={handlePause} disabled={isEmpty}>
        {isPaused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
