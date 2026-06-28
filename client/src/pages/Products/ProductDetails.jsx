import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FiArrowLeft,
  FiShoppingCart,
  FiPackage,
  FiClock,
  FiStar,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import moment from "moment";
import "moment/locale/fr";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

moment.locale("fr");

const formatPrice = (price) => new Intl.NumberFormat("fr-FR").format(price);

const MetaItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm">
    <Icon size={14} className="text-stone-400 shrink-0" />
    <span className="text-stone-400">{label}</span>
    <span className="font-medium text-stone-700">{value}</span>
  </div>
);

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Avis soumis avec succès");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-8">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8"
        >
          <FiArrowLeft size={15} /> Retour
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>
            {/* ── Product section ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
              {/* Image */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <HeartIcon product={product} />
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-5">
                {/* Name & brand */}
                <div>
                  {product.brand && (
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-2">
                      {product.brand}
                    </p>
                  )}
                  <h1 className="text-2xl font-semibold text-stone-800 leading-snug">
                    {product.name}
                  </h1>
                  <div className="mt-2">
                    <Ratings
                      value={product.rating}
                      text={`${product.numReviews} avis`}
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="py-4 border-y border-stone-100">
                  <p className="text-3xl font-bold text-stone-800">
                    {formatPrice(product.price)}
                    <span className="text-lg font-medium text-stone-400 ml-2">
                      F CFA
                    </span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-500 leading-relaxed">
                  {product.description}
                </p>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3 bg-white border border-stone-200 rounded-2xl p-4">
                  <MetaItem
                    icon={FaStore}
                    label="Marque"
                    value={product.brand}
                  />
                  <MetaItem
                    icon={FiStar}
                    label="Note"
                    value={`${Math.round(product.rating)} / 5`}
                  />
                  <MetaItem
                    icon={FiClock}
                    label="Ajouté"
                    value={moment(product.createdAt).fromNow()}
                  />
                  <MetaItem
                    icon={FiStar}
                    label="Avis"
                    value={product.numReviews}
                  />
                  <MetaItem
                    icon={FiShoppingCart}
                    label="Quantité"
                    value={product.quantity}
                  />
                  <MetaItem
                    icon={FiPackage}
                    label="En stock"
                    value={product.countInStock}
                  />
                </div>

                {/* Add to cart */}
                <div className="flex items-center gap-3 pt-2">
                  {product.countInStock > 0 ? (
                    <>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 text-stone-700 outline-none focus:border-[var(--primary)] transition-colors"
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={addToCartHandler}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors"
                      >
                        <FiShoppingCart size={15} />
                        Ajouter au panier
                      </button>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-100 text-stone-400 text-sm font-medium">
                      Rupture de stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Tabs section ── */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
