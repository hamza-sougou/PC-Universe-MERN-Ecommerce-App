import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const formatPrice = (price) => new Intl.NumberFormat("fr-FR").format(price);

const Product = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-stone-300">
        {/* Image */}
        <div className="relative overflow-hidden bg-stone-100 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <HeartIcon product={product} />

          {/* Price badge */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-semibold shadow">
              {formatPrice(product.price)} F CFA
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3.5">
          <h2 className="text-sm font-semibold text-stone-800 truncate group-hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h2>
          {product.brand && (
            <p className="text-xs text-stone-400 mt-0.5">{product.brand}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Product;
