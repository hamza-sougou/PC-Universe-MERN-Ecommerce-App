import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop,
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            const price = product.price;
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Infinity;
            return price >= min && price <= max;
          },
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    dispatch,
    minPrice,
    maxPrice,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand,
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined),
      ),
    ),
  ];

  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  const handleResetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    dispatch(setChecked([]));
  };

  const activeBrand = radio?.[0];

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col gap-6 w-[220px] min-w-[220px] bg-white border-r border-stone-200 px-5 py-7 sticky top-0 h-screen overflow-y-auto">
        {/* Catégories */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-widest text-stone-400 mb-1">
            Catégories
          </span>
          {categories?.map((c) => (
            <label
              key={c._id}
              className="flex items-center gap-2.5 py-1 cursor-pointer group"
            >
              <input
                type="checkbox"
                id={c._id}
                onChange={(e) => handleCheck(e.target.checked, c._id)}
                checked={checked.includes(c._id)}
                className="w-4 h-4 rounded accent-[var(--primary)] cursor-pointer"
              />
              <span className="text-[13px] text-stone-500 group-hover:text-stone-800 transition-colors">
                {c.name}
              </span>
            </label>
          ))}
        </div>

        <div className="h-px bg-stone-100" />

        {/* Marque */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-widest text-stone-400 mb-1">
            Marque
          </span>
          {uniqueBrands?.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 py-1 cursor-pointer group"
            >
              <input
                type="radio"
                name="brand"
                id={brand}
                onChange={() => handleBrandClick(brand)}
                checked={activeBrand === brand}
                className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
              />
              <span className="text-[13px] text-stone-500 group-hover:text-stone-800 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>

        <div className="h-px bg-stone-100" />

        {/* Prix */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-widest text-stone-400 mb-1">
            Prix
          </span>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="w-0 flex-1 px-3 py-1.5 text-[13px] bg-stone-50 border border-stone-200 rounded-md text-stone-800 placeholder-stone-400 outline-none focus:border-[var(--primary)] transition-colors"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-0 flex-1 px-3 py-1.5 text-[13px] bg-stone-50 border border-stone-200 rounded-md text-stone-800 placeholder-stone-400 outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={handleResetFilters}
          className="mt-auto w-full py-2 text-[13px] font-medium text-stone-500 border border-stone-200 rounded-md hover:bg-stone-50 hover:text-stone-800 hover:border-stone-300 transition-all"
        >
          Réinitialiser les filtres
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 px-6 py-7">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <p className="text-sm text-stone-400 mr-auto">
            {products?.length ?? 0} produit{products?.length !== 1 ? "s" : ""}{" "}
            trouvé{products?.length !== 1 ? "s" : ""}
          </p>

          {/* Active filter tags */}
          {(checked.length > 0 || activeBrand) && (
            <div className="flex flex-wrap gap-2 w-full">
              {checked.map((id) => {
                const cat = categories?.find((c) => c._id === id);
                return cat ? (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium"
                  >
                    {cat.name}
                    <button
                      onClick={() => handleCheck(false, id)}
                      aria-label={`Retirer ${cat.name}`}
                      className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-base leading-none transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
              {activeBrand && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium">
                  {activeBrand}
                  <button
                    onClick={handleResetFilters}
                    aria-label={`Retirer ${activeBrand}`}
                    className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-base leading-none transition-colors"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products?.length === 0 ? (
            <div className="col-span-full flex justify-center py-16">
              <Loader />
            </div>
          ) : (
            products?.map((p) => <ProductCard key={p._id} p={p} />)
          )}
        </div>
      </main>
    </div>
  );
};

export default Shop;
