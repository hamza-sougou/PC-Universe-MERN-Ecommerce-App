import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const count = useSelector((state) => state.favorites.length);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] font-bold text-white bg-[var(--primary)] rounded-full leading-none">
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default FavoritesCount;