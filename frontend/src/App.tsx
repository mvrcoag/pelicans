import "./App.css";
import { ImageSlideshow } from "./components/ImageSlideshow";
import { usePelicanImage } from "./hooks/usePelicanImage";

function App() {
  const { imageUrls } = usePelicanImage();

  return <ImageSlideshow imageUrls={imageUrls} />;
}

export default App;
