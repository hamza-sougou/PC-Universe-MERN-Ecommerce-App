import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";
import {
  addFavoriteToLocalStorage,
  removeFavoriteFromLocalStorage,
  getFavoritesFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const toggleFavorites = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFavorites}
      className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[var(--primary)] shadow-md transition hover:scale-105"
    >
      {isFavorite ? (
        <FaHeart className="text-lg" />
      ) : (
        <FaRegHeart className="text-lg" />
      )}
    </button>
  );
};

export default HeartIcon;
