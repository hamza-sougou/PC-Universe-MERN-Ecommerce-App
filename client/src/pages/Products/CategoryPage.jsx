import { useParams, Link } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import Loader from "../../components/Loader";
import Product from "./Product";
import { FiArrowLeft } from "react-icons/fi";

const CategoryPage = () => {
  const { categoryId } = useParams();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useGetProductsByCategoryQuery(categoryId);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const category = categories.find((c) => c._id === categoryId);

  if (isLoading)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader />
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-sm text-stone-400">
          Erreur de chargement des produits.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="max-w-[1200px] mx-auto px-5 lg:px-10 py-10">
        {/* Back */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8"
        >
          <FiArrowLeft size={15} /> Retour à la boutique
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Catégorie
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            {category?.name ?? "Produits"}
            <span className="ml-2 text-base font-normal text-stone-400">
              ({products?.length ?? 0})
            </span>
          </h1>
        </div>

        {/* Other categories */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories
              .filter((c) => c._id !== categoryId)
              .map((c) => (
                <Link
                  key={c._id}
                  to={`/category/${c._id}`}
                  className="px-4 py-1.5 rounded-full text-xs font-medium text-stone-500 border border-stone-200 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        )}

        {/* Products */}
        {products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-stone-400 text-sm">
              Aucun produit dans cette catégorie pour le moment.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors"
            >
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
