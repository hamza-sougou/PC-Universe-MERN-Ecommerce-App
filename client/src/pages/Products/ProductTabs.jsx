import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const TABS = [
  { id: 1, label: "Laisser un avis" },
  { id: 2, label: "Tous les avis" },
  { id: 3, label: "Produits similaires" },
];

const inputClass =
  "w-full px-4 py-2.5 text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder-stone-400";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="w-full">
      {/* Tab nav */}
      <div className="flex gap-1 border-b border-stone-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-[var(--primary)]"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab 1 — Write review */}
      {activeTab === 1 && (
        <div className="max-w-lg">
          {userInfo ? (
            <form onSubmit={submitHandler} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5">
                  Note
                </label>
                <select
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Sélectionner une note</option>
                  <option value="1">⭐ Très mauvais</option>
                  <option value="2">⭐⭐ Mauvais</option>
                  <option value="3">⭐⭐⭐ Décent</option>
                  <option value="4">⭐⭐⭐⭐ Bon</option>
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5">
                  Commentaire
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit..."
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProductReview ? "Envoi..." : "Soumettre l'avis"}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-stone-500">
              Veuillez{" "}
              <Link
                to="/login"
                className="text-[var(--primary)] hover:underline font-medium"
              >
                vous connecter
              </Link>{" "}
              pour laisser un avis.
            </p>
          )}
        </div>
      )}

      {/* Tab 2 — All reviews */}
      {activeTab === 2 && (
        <div className="flex flex-col gap-3 max-w-2xl">
          {product.reviews.length === 0 ? (
            <p className="text-sm text-stone-400 py-6 text-center">
              Aucun avis pour le moment. Soyez le premier !
            </p>
          ) : (
            product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-stone-200 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-stone-800">
                      {review.name}
                    </p>
                    <Ratings value={review.rating} />
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">
                    {review.createdAt.substring(0, 10)}
                  </span>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3 — Similar products */}
      {activeTab === 3 && (
        <div>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
