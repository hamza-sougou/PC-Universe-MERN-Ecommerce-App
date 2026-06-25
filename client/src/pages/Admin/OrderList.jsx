import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";

const Badge = ({ ok, labelOk = "Complétée", labelNo = "En attente" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      ok
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-amber-50 text-amber-700 border border-amber-200"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${ok ? "bg-emerald-500" : "bg-amber-500"}`}
    />
    {ok ? labelOk : labelNo}
  </span>
);

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100">
            <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium">
              Article
            </th>
            <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium hidden md:table-cell">
              ID
            </th>
            <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium">
              Client
            </th>
            <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium hidden sm:table-cell">
              Date
            </th>
            <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium hidden sm:table-cell">
              Total
            </th>
            <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium">
              Paiement
            </th>
            <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium hidden sm:table-cell">
              Livraison
            </th>
            <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-stone-400 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-stone-50 transition-colors">
              <td className="px-4 py-3">
                <img
                  src={order.orderItems[0].image}
                  alt={order._id}
                  className="w-12 h-12 object-cover rounded-lg border border-stone-100"
                />
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-stone-400 font-mono text-xs">
                {order._id.slice(-8)}
              </td>
              <td className="px-4 py-3 text-stone-700 font-medium">
                {order.user ? order.user.username : "N/A"}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell text-stone-400">
                {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell text-stone-700 font-medium whitespace-nowrap">
                {new Intl.NumberFormat("fr-FR").format(order.totalPrice)} F
              </td>
              <td className="px-4 py-3">
                <Badge ok={order.isPaid} />
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <Badge ok={order.isDelivered} />
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/order/${order._id}`}
                  className="text-xs font-medium text-[var(--primary)] hover:underline"
                >
                  Détails →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
