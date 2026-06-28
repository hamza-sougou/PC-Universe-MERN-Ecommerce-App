import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { FiCheck, FiClock, FiArrowRight } from "react-icons/fi";

const formatPrice = (price) => new Intl.NumberFormat("fr-FR").format(price);

const Badge = ({ ok, labelOk = "Complétée", labelNo = "En attente" }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
      ok
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-amber-50 text-amber-700 border border-amber-200"
    }`}
  >
    {ok ? <FiCheck size={10} strokeWidth={2.5} /> : <FiClock size={10} />}
    {ok ? labelOk : labelNo}
  </span>
);

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="max-w-4xl mx-auto px-5 lg:px-10 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Mon compte
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            Mes commandes
            {orders && (
              <span className="ml-2 text-base font-normal text-stone-400">
                ({orders.length})
              </span>
            )}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.error || error.error}
          </Message>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-sm text-stone-400">
              Vous n'avez pas encore de commandes.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors"
            >
              Voir la boutique
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium">
                      Article
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium hidden md:table-cell">
                      ID
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium">
                      Date
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium">
                      Total
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium hidden sm:table-cell">
                      Paiement
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium hidden sm:table-cell">
                      Livraison
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] uppercase tracking-wide text-stone-400 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <img
                          src={order.orderItems[0].image}
                          alt="article"
                          className="w-12 h-12 object-cover rounded-xl border border-stone-100"
                        />
                      </td>

                      <td className="px-5 py-4 hidden md:table-cell text-stone-400 font-mono text-xs">
                        #{order._id.slice(-8)}
                      </td>

                      <td className="px-5 py-4 text-stone-500 text-xs">
                        {order.createdAt.substring(0, 10)}
                      </td>

                      <td className="px-5 py-4 text-stone-700 font-semibold whitespace-nowrap">
                        {formatPrice(order.totalPrice)} F
                      </td>

                      <td className="px-5 py-4 hidden sm:table-cell">
                        <Badge ok={order.isPaid} />
                      </td>

                      <td className="px-5 py-4 hidden sm:table-cell">
                        <Badge ok={order.isDelivered} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                        >
                          Détails <FiArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserOrder;
