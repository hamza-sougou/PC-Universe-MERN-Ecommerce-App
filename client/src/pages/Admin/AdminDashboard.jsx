import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { FiTrendingUp, FiUsers, FiShoppingBag } from "react-icons/fi";

const StatCard = ({ icon: Icon, label, value, isLoading }) => (
  <div className="flex-1 min-w-[160px] bg-[var(--light-bg)]  rounded-2xl p-5 shadow-sm">
    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--primary)]/10 mb-4">
      <Icon size={16} className="text-[var(--primary)]" />
    </div>
    <p className="text-[11px] uppercase tracking-wide text-stone-400 font-medium mb-1">
      {label}
    </p>
    <p className="text-xl font-semibold text-stone-800">
      {isLoading ? <Loader /> : value}
    </p>
  </div>
);

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
      colors: ["var(--primary)"],
      plotOptions: {
        bar: { borderRadius: 6, columnWidth: "50%" },
      },
      dataLabels: { enabled: false },
      stroke: { show: false },
      grid: {
        borderColor: "#f1f0ef",
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      xaxis: {
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
      },
      yaxis: {
        labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
        min: 0,
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => `${new Intl.NumberFormat("fr-FR").format(val)} F`,
        },
      },
      legend: { show: false },
    },
    series: [{ name: "Ventes", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formatted = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));
      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: formatted.map((i) => i.x),
          },
        },
        series: [{ name: "Ventes", data: formatted.map((i) => i.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminMenu />

      <main className="max-w-[1200px] mx-auto px-5 lg:px-10 py-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Administration
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">Dashboard</h1>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <StatCard
            icon={FiTrendingUp}
            label="Ventes totales"
            value={`${new Intl.NumberFormat("fr-FR").format(sales?.totalSales ?? 0)} F CFA`}
            isLoading={isLoading}
          />
          <StatCard
            icon={FiUsers}
            label="Clients"
            value={customers?.length ?? 0}
            isLoading={loading}
          />
          <StatCard
            icon={FiShoppingBag}
            label="Commandes"
            value={orders?.totalOrders ?? 0}
            isLoading={loadingTwo}
          />
        </div>

        {/* Chart */}
        <div className="bg-[var(--light-bg)] border border-stone-200 rounded-2xl shadow-sm p-6 mb-8">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-wide text-stone-400 font-medium mb-1">
              Aperçu
            </p>
            <h2 className="text-base font-semibold text-stone-800">
              Ventes en tendance
            </h2>
          </div>
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="100%"
            height={280}
          />
        </div>

        {/* Orders table */}
        <div>
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-wide text-stone-400 font-medium mb-1">
              Suivi
            </p>
            <h2 className="text-base font-semibold text-stone-800">
              Commandes récentes
            </h2>
          </div>
          <OrderList />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
