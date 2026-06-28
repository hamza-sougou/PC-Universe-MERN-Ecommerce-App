import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import { useState } from "react";

const PRODUCTS_PER_PAGE = 10;

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <Loader />
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-sm text-stone-400">Erreur de chargement des produits.</p>
    </div>
  );

  const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const current = sorted.slice(start, start + PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminMenu />

      <main className="max-w-4xl mx-auto px-5 py-10">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Administration
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            Tous les produits
            <span className="ml-2 text-base font-normal text-stone-400">
              ({sorted.length})
            </span>
          </h1>
        </div>

        {/* Product list */}
        <div className="flex flex-col gap-3 mb-8">
          {current.map((product) => (
            <Link
              key={product._id}
              to={`/admin/product/update/${product._id}`}
              className="group flex items-center gap-4 bg-white border border-stone-200 rounded-2xl p-4 hover:border-[var(--primary)]/40 hover:shadow-sm transition-all"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shrink-0 border border-stone-100"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="text-sm font-semibold text-stone-800 truncate group-hover:text-[var(--primary)] transition-colors">
                    {product.name}
                  </h2>
                  <span className="text-xs text-stone-400 whitespace-nowrap shrink-0">
                    {moment(product.createdAt).format("D MMM YYYY")}
                  </span>
                </div>
                <p className="text-xs text-stone-400 line-clamp-1 mb-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-700">
                    {new Intl.NumberFormat("fr-FR").format(product.price)} F CFA
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Modifier <FiArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-stone-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[var(--primary)] text-white"
                    : "border border-stone-200 text-stone-500 hover:border-stone-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:border-stone-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight size={15} />
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default AllProducts;