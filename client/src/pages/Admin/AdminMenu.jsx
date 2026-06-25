import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  FiX,
  FiGrid,
  FiTag,
  FiPlusSquare,
  FiList,
  FiUsers,
  FiShoppingBag,
} from "react-icons/fi";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/admin/categorylist", label: "Créer catégorie", icon: FiTag },
  { to: "/admin/productlist", label: "Créer produit", icon: FiPlusSquare },
  { to: "/admin/allproductslist", label: "Tous les produits", icon: FiList },
  { to: "/admin/userlist", label: "Utilisateurs", icon: FiUsers },
  { to: "/admin/orderlist", label: "Commandes", icon: FiShoppingBag },
];

const AdminMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed top-5 right-5 z-40 w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-stone-200 shadow-sm hover:border-[var(--primary)] transition-colors"
        aria-label="Menu admin"
      >
        {open ? (
          <FiX size={18} className="text-stone-600" />
        ) : (
          <MdAdminPanelSettings size={20} className="text-stone-600" />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          <nav className="fixed top-16 right-5 z-40 w-52 bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden py-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "text-[var(--primary)] bg-[var(--primary)]/5 font-medium"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`
                }
              >
                <Icon size={15} className="shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </>
  );
};

export default AdminMenu;
