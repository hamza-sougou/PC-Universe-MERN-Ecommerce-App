import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Message from "../components/Message";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="min-h-screen bg-stone-50">
      {!keyword && <Header />}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader />
        </div>
      ) : isError ? (
        <div className="mx-auto max-w-[1200px] px-5 lg:px-10 py-10">
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        </div>
      ) : (
        <section className="mx-auto max-w-[1200px] px-5 lg:px-10 py-12">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              {keyword ? (
                <>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
                    Résultats de recherche
                  </p>
                  <h1 className="text-2xl font-semibold text-stone-800">
                    « {keyword} »
                  </h1>
                </>
              ) : (
                <>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
                    Sélection du moment
                  </p>
                  <h1 className="text-2xl font-semibold text-stone-800">
                    Produits spéciaux
                  </h1>
                </>
              )}
              <p className="mt-1 text-sm text-stone-400">
                {data.products?.length ?? 0} produit
                {data.products?.length !== 1 ? "s" : ""}
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              Voir la boutique
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Products grid */}
          {data.products?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-stone-400 text-sm">Aucun produit trouvé.</p>
              <Link
                to="/shop"
                className="mt-4 text-sm text-[var(--primary)] hover:underline"
              >
                Retour à la boutique
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {data.products?.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
