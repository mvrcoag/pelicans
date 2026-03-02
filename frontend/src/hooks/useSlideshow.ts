import { useCallback, useEffect, useReducer, useRef, useState } from "react";

type FetchImage = () => Promise<{ url: string }>;

type UseSlideshowOptions = {
  fetchImage: FetchImage;
  maxImages?: number;
  fetchOnMount?: boolean;
};

type SlideshowState = {
  imageUrls: string[];
  currentIndex: number;
  noMoreImages: boolean;
};

type SlideshowAction =
  | { type: "append"; url: string; maxImages: number }
  | { type: "next" }
  | { type: "previous" }
  | { type: "resetNoMore" };

const initialState: SlideshowState = {
  imageUrls: [],
  currentIndex: 0,
  noMoreImages: false,
};

function slideshowReducer(
  state: SlideshowState,
  action: SlideshowAction,
): SlideshowState {
  switch (action.type) {
    case "append": {
      const nextUrls = [...state.imageUrls, action.url];
      const trimmedUrls = nextUrls.slice(-action.maxImages);

      return {
        imageUrls: trimmedUrls,
        currentIndex: Math.max(trimmedUrls.length - 1, 0),
        noMoreImages: false,
      };
    }
    case "next": {
      if (state.currentIndex >= state.imageUrls.length - 1) {
        return state;
      }

      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        noMoreImages: false,
      };
    }
    case "previous": {
      if (state.currentIndex <= 0) {
        return {
          ...state,
          noMoreImages: true,
        };
      }

      return {
        ...state,
        currentIndex: state.currentIndex - 1,
        noMoreImages: false,
      };
    }
    case "resetNoMore": {
      if (!state.noMoreImages) return state;
      return {
        ...state,
        noMoreImages: false,
      };
    }
  }
}

export function useSlideshow({
  fetchImage,
  maxImages = 5,
  fetchOnMount = true,
}: UseSlideshowOptions) {
  const [state, dispatch] = useReducer(slideshowReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const fetchAndAppend = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const image = await fetchImage();
      dispatch({ type: "append", url: image.url, maxImages });
    } catch (fetchError) {
      console.error("Error fetching slideshow image:", fetchError);
      setError("Failed to load image");
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
    }
  }, [fetchImage, maxImages]);

  useEffect(() => {
    if (!fetchOnMount) return;
    fetchAndAppend();
  }, [fetchAndAppend, fetchOnMount]);

  const showNextImage = useCallback(async () => {
    setError(null);
    if (state.noMoreImages) {
      dispatch({ type: "resetNoMore" });
      return;
    }

    dispatch({ type: "resetNoMore" });

    if (state.currentIndex < state.imageUrls.length - 1) {
      dispatch({ type: "next" });
      return;
    }

    await fetchAndAppend();
  }, [fetchAndAppend, state.currentIndex, state.imageUrls.length, state.noMoreImages]);

  const showPreviousImage = useCallback(() => {
    if (state.imageUrls.length === 0) return;
    setError(null);
    dispatch({ type: "previous" });
  }, [state.imageUrls.length]);

  return {
    imageUrls: state.imageUrls,
    currentIndex: state.currentIndex,
    noMoreImages: state.noMoreImages,
    isLoading,
    error,
    showNextImage,
    showPreviousImage,
  };
}
