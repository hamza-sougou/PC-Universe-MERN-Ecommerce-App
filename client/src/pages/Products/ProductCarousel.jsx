import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import "moment/locale/fr";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

moment.locale("fr");

/* ── Custom arrows ── */
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md backdrop-blur-sm transition-all hover:scale-105"
    aria-label="Précédent"
  >
    <FiChevronLeft size={18} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md backdrop-blur-sm transition-all hover:scale-105"
    aria-label="Suivant"
  >
    <FiChevronRight size={18} />
  </button>
);

const formatPrice = (price) => new Intl.NumberFormat("fr-FR").format(price);

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm text-stone-500">
    <Icon size={13} className="text-stone-400 shrink-0" />
    <span className="text-stone-400">{label}</span>
    <span className="font-medium text-stone-700">{value}</span>
  </div>
);

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots) => (
      <div className="!bottom-4">
        <ul className="flex justify-center gap-1.5">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-1.5 h-1.5 rounded-full bg-white/50 hover:bg-white transition-colors" />
    ),
  };

  if (isLoading) return null;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error.message}
      </Message>
    );

  return (
    <div className="w-full max-w-2xl">
      <Slider
        {...settings}
        className="relative rounded-2xl overflow-hidden shadow-lg"
      >
        {products.map(
          ({
            image,
            _id,
            name,
            price,
            description,
            brand,
            createdAt,
            numReviews,
            rating,
            quantity,
            countInStock,
          }) => (
            <div key={_id} className="outline-none">
              {/* Image */}
              <div className="relative h-72 w-full">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Price badge over image */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[var(--primary)] text-white text-sm font-semibold shadow">
                  {formatPrice(price)} F CFA
                </div>
              </div>

              {/* Info panel */}
              <div className="bg-white px-6 py-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-base font-semibold text-stone-800 leading-snug">
                      {name}
                    </h2>
                    <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                      <FaStore size={10} /> {brand}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[var(--light-bg)] text-[var(--primary)] px-2.5 py-1 rounded-full text-xs font-semibold shrink-0">
                    <FaStar size={10} />
                    {Math.round(rating)} / 5
                  </div>
                </div>

                <p className="text-[13px] text-stone-500 leading-relaxed mb-4 line-clamp-2">
                  {description}
                </p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-stone-100">
                  <StatItem
                    icon={FaClock}
                    label="Ajouté"
                    value={moment(createdAt).fromNow()}
                  />
                  <StatItem icon={FaStar} label="Avis" value={numReviews} />
                  <StatItem
                    icon={FaShoppingCart}
                    label="Quantité"
                    value={quantity}
                  />
                  <StatItem
                    icon={FaBox}
                    label="En stock"
                    value={countInStock}
                  />
                </div>
              </div>
            </div>
          ),
        )}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
