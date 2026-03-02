import "./App.css";
import { ImageSlideshow } from "./components/ImageSlideshow";
import { useSlideshow } from "./hooks/useSlideshow";
import { pelicanImageService } from "./services/pelicanImageService";

function App() {
  const {
    imageUrls,
    currentIndex,
    error,
    isLoading,
    noMoreImages,
    showNextImage,
    showPreviousImage,
  } = useSlideshow({ fetchImage: pelicanImageService.getRandomImage });

  return (
    <ImageSlideshow
      imageUrls={imageUrls}
      currentIndex={currentIndex}
      error={error}
      isLoading={isLoading}
      noMoreImages={noMoreImages}
      onNext={showNextImage}
      onPrevious={showPreviousImage}
    />
  );
}

export default App;
