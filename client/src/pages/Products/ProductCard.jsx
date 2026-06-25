import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...p, qty: 1 }));
    toast.success("Article ajouté au panier.");
  };

  return (
    <div className="group relative bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-stone-300 transition-all duration-300">
      {/* Image */}
      <Link
        to={`/product/${p._id}`}
        className="block relative overflow-hidden aspect-square bg-stone-100"
      >
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Brand badge */}
        {p.brand && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-medium text-stone-600 border border-stone-200">
            {p.brand}
          </span>
        )}

        <HeartIcon product={p} />
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link
            to={`/product/${p._id}`}
            className="text-sm font-semibold text-stone-800 line-clamp-1 hover:text-[var(--primary)] transition-colors"
          >
            {p.name}
          </Link>
          <span className="shrink-0 text-sm font-semibold text-stone-700">
            {new Intl.NumberFormat("fr-FR").format(p.price)} F
          </span>
        </div>

        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
          {p.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/product/${p._id}`}
            className="flex-1 inline-flex items-center justify-center py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            Voir plus
          </Link>
          <button
            onClick={addToCartHandler}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-colors"
            aria-label="Ajouter au panier"
          >
            <FiShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
