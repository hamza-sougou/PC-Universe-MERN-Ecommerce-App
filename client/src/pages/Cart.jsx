import { FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const formatPrice = (price) => new Intl.NumberFormat("fr-FR").format(price);

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0,
  );

  const addToCartHandler = (product, qty) =>
    dispatch(addToCart({ ...product, qty }));
  const removeFromCartHandler = (id) => dispatch(removeFromCart(id));
  const checkoutHandler = () => navigate("/login?redirect=/shipping");

  /* ── Empty state ── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-5">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-stone-100">
          <FiShoppingBag size={28} className="text-stone-400" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-stone-800 mb-1">
            Votre panier est vide
          </h2>
          <p className="text-sm text-stone-400 mb-4">
            Découvrez notre sélection de produits.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors"
          >
            Voir la boutique <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="max-w-4xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Récapitulatif
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            Mon panier
            <span className="ml-2 text-base font-normal text-stone-400">
              ({cartItems.length} article{cartItems.length > 1 ? "s" : ""})
            </span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Item list ── */}
          <div className="flex-1 flex flex-col gap-3">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white border border-stone-200 rounded-2xl p-4"
              >
                {/* Image */}
                <Link to={`/product/${item._id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-100"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-sm font-semibold text-stone-800 truncate block hover:text-[var(--primary)] transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-stone-400 mt-0.5">{item.brand}</p>
                  <p className="text-sm font-semibold text-stone-700 mt-1">
                    {formatPrice(item.price)} F CFA
                  </p>
                </div>

                {/* Qty selector */}
                <select
                  className="px-2 py-1.5 text-sm border border-stone-200 rounded-lg bg-stone-50 text-stone-700 outline-none focus:border-[var(--primary)] transition-colors"
                  value={item.qty}
                  onChange={(e) =>
                    addToCartHandler(item, Number(e.target.value))
                  }
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>

                {/* Line total */}
                <span className="text-sm font-semibold text-stone-700 w-24 text-right hidden sm:block">
                  {formatPrice(item.qty * item.price)} F
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeFromCartHandler(item._id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Supprimer"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* ── Order summary ── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 sticky top-6">
              <h2 className="text-sm font-semibold text-stone-800 mb-4">
                Résumé de la commande
              </h2>

              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between text-stone-500">
                  <span>Sous-total ({totalQty} art.)</span>
                  <span>{formatPrice(totalPrice)} F</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Livraison</span>
                  <span className="text-emerald-600 font-medium">Gratuite</span>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4 mb-5">
                <div className="flex justify-between text-base font-semibold text-stone-800">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)} F CFA</span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Commander <FiArrowRight size={14} />
              </button>

              <Link
                to="/shop"
                className="mt-3 w-full inline-flex items-center justify-center text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
