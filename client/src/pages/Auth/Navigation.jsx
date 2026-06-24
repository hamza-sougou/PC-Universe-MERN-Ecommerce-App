import { useState, useRef } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { GrFavorite } from "react-icons/gr";
import { Link } from "react-router-dom";
import { RiMenu2Fill } from "react-icons/ri";
import "./Navigation.css";
import { useSelector } from "react-redux";
import FavoritesCount from "../Products/FavoritesCount";
import pcu_logo from "../../assets/PCU_logo.svg";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import clsx from "clsx";
import DropdownProfile from "./DropdownProfile.jsx";
import { useGetProductsQuery } from "../../redux/api/productApiSlice.js";

const Navigation = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [isSideMenuOpen, setMenu] = useState(false);
  const [isHoveringProfile, setHoveringProfile] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => setHoveringProfile(true);
  const handleMouseLeave = () => setHoveringProfile(false);

  const [searchTerm, setSearchTerm] = useState("");

  const { data: searchResults = [], isFetching } = useGetProductsQuery(
    { keyword: searchTerm },
    {
      skip: !searchTerm,
    },
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <RiMenu2Fill
              onClick={() => setMenu(true)}
              className="text-2xl cursor-pointer lg:hidden text-gray-700"
            />
            <Link to="/" className="flex items-center gap-3">
              <img src={pcu_logo} className="w-14" alt="PCU logo" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c._id}`}
                className="px-4 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 transition"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="flex-1 mx-6 max-w-[540px]">
            <div className="relative">
              <input
                type="text"
                id="searchBar"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher des produits..."
                className="w-full rounded-full border border-gray-200 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />

              {searchTerm && !isFetching && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 bg-white border mt-2 rounded-md shadow-md overflow-hidden z-30">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-800"
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <button className="p-2 rounded-full hover:bg-gray-100 transition">
                <FiUser className="text-2xl text-gray-700" />
              </button>
              {isHoveringProfile && (
                <div className="absolute right-0">
                  <DropdownProfile />
                </div>
              )}
            </div>

            <Link
              to="/favorite"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <GrFavorite className="text-2xl text-gray-700" />
              <FavoritesCount />
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition flex items-center"
            >
              <AiOutlineShoppingCart className="text-2xl text-gray-700" />
              {cartItems.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>

      <div
        className={clsx(
          "fixed inset-0 bg-black/40 z-40 transition-transform lg:hidden",
          isSideMenuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        onClick={() => setMenu(false)}
      >
        <aside
          className={clsx(
            "absolute left-0 top-0 h-full w-72 bg-white p-6 shadow-lg transform transition-transform",
            isSideMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="font-semibold">Menu</div>
            <IoCloseOutline
              onClick={() => setMenu(false)}
              className="text-2xl cursor-pointer"
            />
          </div>
          <nav className="flex flex-col gap-3">
            {categories?.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c._id}`}
                onClick={() => setMenu(false)}
                className="py-2 px-3 rounded hover:bg-gray-100"
              >
                {c.name}
              </Link>
            ))}
            <Link
              to="/shop"
              onClick={() => setMenu(false)}
              className="mt-4 py-2 px-3 rounded bg-indigo-50 text-indigo-600"
            >
              Voir la Boutique
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
};

export default Navigation;
