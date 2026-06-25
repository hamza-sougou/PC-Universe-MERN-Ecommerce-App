import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="max-w-[1200px] mx-auto px-5 lg:px-10 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Ma liste
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            Mes favoris
            <span className="ml-2 text-base font-normal text-stone-400">
              ({favorites.length})
            </span>
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-stone-100">
              <FiHeart size={28} className="text-stone-400" />
            </div>
            <div className="text-center">
              <h2 className="text-base font-semibold text-stone-800 mb-1">Aucun favori pour l'instant</h2>
              <p className="text-sm text-stone-400 mb-4">Ajoutez des produits à votre liste en cliquant sur le cœur.</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors"
              >
                Voir la boutique
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Favorites;