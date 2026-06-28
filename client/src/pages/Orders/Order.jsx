import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import {
  FiMapPin,
  FiCreditCard,
  FiUser,
  FiMail,
  FiPackage,
  FiCheck,
} from "react-icons/fi";

const formatPrice = (price) => new Intl.NumberFormat("fr-FR").format(price);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-100 shrink-0 mt-0.5">
      <Icon size={13} className="text-stone-500" />
    </div>
    <div>
      <p className="text-[11px] uppercase tracking-wide text-stone-400 font-medium">
        {label}
      </p>
      <p className="text-sm text-stone-700">{value}</p>
    </div>
  </div>
);

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid && !window.paypal) loadPaypalScript();
    }
  }, [errorPaypal, loadingPaypal, order, paypal, paypalDispatch]);

  const onApprove = (data, actions) =>
    actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Commande payée avec succès");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });

  const createOrder = (data, actions) =>
    actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    });

  const onError = (err) => toast.error(err.message);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-24">
        <Loader />
      </div>
    );
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Commande
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            Détails de la commande
          </h1>
          <p className="text-xs text-stone-400 font-mono mt-1">#{order._id}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Left: items + shipping info ── */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Items list */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100">
                <h2 className="text-sm font-semibold text-stone-700">
                  Articles ({order.orderItems.reduce((a, i) => a + i.qty, 0)})
                </h2>
              </div>

              {order.orderItems.length === 0 ? (
                <div className="p-5">
                  <Message>Votre commande est vide</Message>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {order.orderItems.map((item, index) => (
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
              )}
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Client */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Client
                </h3>
                <InfoRow
                  icon={FiUser}
                  label="Nom"
                  value={order.user.username}
                />
                <InfoRow icon={FiMail} label="Email" value={order.user.email} />
              </div>

              {/* Shipping */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Livraison
                  </h3>
                  {order.isDelivered ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                      <FiCheck size={10} /> Livrée
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                      En attente
                    </span>
                  )}
                </div>
                <InfoRow
                  icon={FiMapPin}
                  label="Adresse"
                  value={`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
                />
                <InfoRow
                  icon={FiCreditCard}
                  label="Paiement"
                  value={order.paymentMethod}
                />
              </div>
            </div>
          </div>

          {/* ── Right: order summary + payment ── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 sticky top-6 flex flex-col gap-4">
              {/* Status */}
              <div>
                <h2 className="text-sm font-semibold text-stone-800 mb-3">
                  Statut du paiement
                </h2>
                {order.isPaid ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <FiCheck size={14} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">
                        Paiement confirmé
                      </p>
                      <p className="text-[11px] text-emerald-600">
                        {order.paidAt?.substring(0, 10)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <FiPackage size={14} className="text-amber-600 shrink-0" />
                    <p className="text-xs font-semibold text-amber-700">
                      En attente de paiement
                    </p>
                  </div>
                )}
              </div>

              <div className="h-px bg-stone-100" />

              {/* Price breakdown */}
              <div>
                <h2 className="text-sm font-semibold text-stone-800 mb-3">
                  Récapitulatif
                </h2>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-stone-500">
                    <span>Articles</span>
                    <span>{formatPrice(order.itemsPrice)} F</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Livraison</span>
                    {Number(order.shippingPrice) === 0 ? (
                      <span className="text-emerald-600 font-medium">
                        Gratuite
                      </span>
                    ) : (
                      <span>{formatPrice(order.shippingPrice)} F</span>
                    )}
                  </div>
                  {Number(order.taxPrice) > 0 && (
                    <div className="flex justify-between text-stone-500">
                      <span>
                        Taxes <span className="text-xs">(18%)</span>
                      </span>
                      <span>{formatPrice(order.taxPrice)} F</span>
                    </div>
                  )}
                  <div className="border-t border-stone-100 pt-2 mt-1 flex justify-between font-semibold text-stone-800">
                    <span>Total</span>
                    <span>{formatPrice(order.totalPrice)} F CFA</span>
                  </div>
                </div>
              </div>

              {/* PayPal */}
              {!order.isPaid && (
                <div>
                  {loadingPay || isPending ? (
                    <div className="flex justify-center py-4">
                      <Loader />
                    </div>
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  )}
                </div>
              )}

              {/* Admin: mark delivered */}
              {loadingDeliver && (
                <div className="flex justify-center">
                  <Loader />
                </div>
              )}
              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <button
                  type="button"
                  onClick={deliverHandler}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors"
                >
                  <FiCheck size={14} />
                  Marquer comme livrée
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
