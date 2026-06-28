import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { FiMapPin, FiCreditCard, FiArrowRight } from "react-icons/fi";

const formatPrice = (price) => new Intl.NumberFormat("fr-FR").format(price);

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) navigate("/shipping");
  }, [cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-10">
        {/* Progress */}
        <div className="mb-12">
          <ProgressSteps step1 step2 step3 />
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Étape 3
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            Validation de la commande
          </h1>
        </div>

        {cart.cartItems.length === 0 ? (
          <Message>Votre panier est vide</Message>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* ── Left: items list ── */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-100">
                  <h2 className="text-sm font-semibold text-stone-700">
                    Articles ({cart.cartItems.reduce((a, i) => a + i.qty, 0)})
                  </h2>
                </div>

                <div className="divide-y divide-stone-100">
                  {cart.cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-xl border border-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-sm font-semibold text-stone-800 truncate block hover:text-[var(--primary)] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Qté : {item.qty}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-stone-700">
                          {formatPrice(item.qty * item.price)} F
                        </p>
                        <p className="text-xs text-stone-400">
                          {formatPrice(item.price)} F / unité
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & payment info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-stone-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FiMapPin size={14} className="text-[var(--primary)]" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Adresse de livraison
                    </h3>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {cart.shippingAddress.address}
                    <br />
                    {cart.shippingAddress.city},{" "}
                    {cart.shippingAddress.postalCode}
                    <br />
                    {cart.shippingAddress.country}
                  </p>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FiCreditCard size={14} className="text-[var(--primary)]" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Méthode de paiement
                    </h3>
                  </div>
                  <p className="text-sm font-semibold text-stone-700">
                    {cart.paymentMethod}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Paiement sécurisé
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right: order summary ── */}
            <div className="w-full lg:w-72 shrink-0">
              <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 sticky top-6">
                <h2 className="text-sm font-semibold text-stone-800 mb-4">
                  Récapitulatif
                </h2>

                <div className="flex flex-col gap-2.5 text-sm mb-4">
                  <div className="flex justify-between text-stone-500">
                    <span>Sous-total</span>
                    <span>{formatPrice(cart.itemsPrice)} F</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Livraison</span>
                    {Number(cart.shippingPrice) === 0 ? (
                      <span className="text-emerald-600 font-medium">
                        Gratuite
                      </span>
                    ) : (
                      <span>{formatPrice(cart.shippingPrice)} F</span>
                    )}
                  </div>
                  {Number(cart.taxPrice) > 0 && (
                    <div className="flex justify-between text-stone-500">
                      <span>Taxes</span>
                      <span>{formatPrice(cart.taxPrice)} F</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-stone-100 pt-4 mb-5">
                  <div className="flex justify-between text-base font-semibold text-stone-800">
                    <span>Total</span>
                    <span>{formatPrice(cart.totalPrice)} F CFA</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4">
                    <Message variant="danger">{error.data.message}</Message>
                  </div>
                )}

                <button
                  type="button"
                  onClick={placeOrderHandler}
                  disabled={cart.cartItems.length === 0 || isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    "Traitement..."
                  ) : (
                    <>
                      Passer la commande
                      <FiArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
