import { useEffect, useState } from "react";
import { pelicanImageService } from "../services/pelicanImageService";

export function usePelicanImage({
  fetchOnMount = true,
}: {
  fetchOnMount?: boolean;
} = {}) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  async function fetchRandomImage() {
    try {
      const image = await pelicanImageService.getRandomImage();
      setImageUrls((prevUrls) => [...prevUrls, image.url]);
    } catch (error) {
      console.error("Error fetching pelican image:", error);
    }
  }

  useEffect(() => {
    if (!fetchOnMount) return;
    fetchRandomImage();
  }, []);

  return {
    imageUrls,
    fetchRandomImage,
  };
}
