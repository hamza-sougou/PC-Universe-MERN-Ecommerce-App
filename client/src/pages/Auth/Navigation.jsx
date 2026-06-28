import { useState, useRef } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiSearch,
  FiX,
  FiMenu,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import FavoritesCount from "../Products/FavoritesCount";
import logo from "../../assets/logo.svg";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import DropdownProfile from "./DropdownProfile.jsx";
import { useGetProductsQuery } from "../../redux/api/productApiSlice.js";

const Navigation = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [isSideMenuOpen, setMenu] = useState(false);
  const [isHoveringProfile, setHoveringProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  const { data: searchResults = { products: [] }, isFetching } =
    useGetProductsQuery({ keyword: searchTerm }, { skip: !searchTerm });

  const products = searchResults?.products ?? searchResults ?? [];
  const cartQty = cartItems.reduce((a, c) => a + c.qty, 0);

  const clearSearch = () => setSearchTerm("");

  return (
    <>
      {/* ── Main navbar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <div className="flex items-center gap-4 h-16">
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenu(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <FiMenu size={20} />
            </button>

            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img src={logo} className="h-9" alt="Jayma" />
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-xl mx-4 relative">
              <div className="relative flex items-center">
                <FiSearch
                  size={15}
                  className="absolute left-3.5 text-stone-400 shrink-0 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-9 pr-9 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder-stone-400"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 text-stone-400 hover:text-stone-600"
                  >
                    <FiX size={14} />
                  </button>
                )}
              </div>

              {/* Search dropdown */}
              {searchFocused &&
                searchTerm &&
                !isFetching &&
                products.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden z-50">
                    {products.slice(0, 6).map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        onClick={clearSearch}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 object-cover rounded-lg border border-stone-100 shrink-0"
                        />
                        <span className="text-sm text-stone-700 truncate">
                          {product.name}
                        </span>
                        <span className="ml-auto text-xs text-stone-400 shrink-0">
                          {new Intl.NumberFormat("fr-FR").format(product.price)}{" "}
                          F
                        </span>
                      </Link>
                    ))}
                    {products.length > 6 && (
                      <Link
                        to={`/search/${searchTerm}`}
                        onClick={clearSearch}
                        className="block px-4 py-2.5 text-xs text-center text-[var(--primary)] hover:bg-stone-50 border-t border-stone-100 font-medium transition-colors"
                      >
                        Voir tous les résultats ({products.length})
                      </Link>
                    )}
                  </div>
                )}

              {searchFocused &&
                searchTerm &&
                !isFetching &&
                products.length === 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-lg px-4 py-4 text-sm text-stone-400 text-center z-50">
                    Aucun résultat pour « {searchTerm} »
                  </div>
                )}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-4 ml-auto shrink-0">
              {/* Profile */}
              <div
                ref={dropdownRef}
                onMouseEnter={() => setHoveringProfile(true)}
                onMouseLeave={() => setHoveringProfile(false)}
                className="relative"
              >
                <button className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 transition-colors">
                  <FiUser size={18} />
                </button>
                {isHoveringProfile && (
                  <div className="absolute right-0 top-full pt-2 z-50">
                    <DropdownProfile />
                  </div>
                )}
              </div>

              {/* Favorites */}
              <Link
                to="/favorite"
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <FiHeart size={18} />
                <FavoritesCount />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-3 h-9 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-medium transition-colors"
              >
                <FiShoppingCart size={16} />
                {cartQty > 0 && (
                  <span className="text-xs font-semibold">{cartQty}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Category sub-navbar ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-stone-100">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
            <Link
              to="/shop"
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors"
            >
              Tous les produits
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c._id}`}
                className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors whitespace-nowrap"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile side drawer ── */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/40 z-50 transition-opacity lg:hidden",
          isSideMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMenu(false)}
      >
        <aside
          className={clsx(
            "absolute left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300",
            isSideMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <img src={logo} className="h-8" alt="Jayma" />
            <button
              onClick={() => setMenu(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Drawer links */}
          <nav className="px-3 py-4 flex flex-col gap-1 overflow-y-auto">
            <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-widest text-stone-400">
              Catégories
            </p>
            <Link
              to="/shop"
              onClick={() => setMenu(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 transition-colors"
            >
              Tous les produits
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c._id}`}
                onClick={() => setMenu(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
};

export default Navigation;
