import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800">
            Impossible de charger les meilleurs produits
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  const featured = data?.slice(0, 3) || [];

  return (
    <section className="bg-stone-50 py-10">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] items-start">
          <div className="relative overflow-hidden rounded-2xl bg-stone-900 p-8 text-white shadow-lg">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(192,90,48,0.25),_transparent_55%)]" />

            <div className="relative z-10 flex flex-col h-full gap-6">
              <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.22em] text-stone-300">
                Offres phares
              </span>

              <div>
                <h1 className="max-w-xl text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
                  Découvrez les meilleures promotions PC et accessoires haut de
                  gamme.
                </h1>
                <p className="mt-4 max-w-lg text-sm text-stone-400 leading-relaxed">
                  Composants, périphériques et accessoires soigneusement choisis
                  pour une expérience gamer ou créative exceptionnelle.
                </p>
              </div>

              <Link
                to="/shop"
                className="w-fit inline-flex items-center gap-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-5 py-2.5 text-sm font-semibold text-white transition-colors"
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

              <div className="grid gap-3 sm:grid-cols-2 mt-2">
                {featured.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-0.5"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--primary)] mb-1">
                        Produit vedette
                      </p>
                      <h3 className="text-sm font-semibold text-white truncate">
                        {product.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium">
                    Tendances
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-stone-800">
                    Nos best-sellers
                  </h2>
                </div>
                <span className="rounded-full bg-[var(--primary)/10] border border-[var(--primary)/20] px-3 py-1 text-xs font-medium text-[var(--primary)]">
                  Top 3
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {featured.map((product, index) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group flex items-center gap-3 rounded-xl border border-stone-100 p-3 hover:border-[var(--primary)] hover:bg-[var(--primary)/10] transition-all"
                  >
                    <span className="shrink-0 w-6 text-center text-xs font-bold text-stone-300">
                      {index + 1}
                    </span>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-14 w-14 rounded-lg object-cover shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-stone-800 truncate group-hover:text-[var(--primary)] transition-colors">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400 line-clamp-1">
                        {product.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-semibold text-stone-700 whitespace-nowrap">
                      {new Intl.NumberFormat("fr-FR").format(product.price)} F
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
              <ProductCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
