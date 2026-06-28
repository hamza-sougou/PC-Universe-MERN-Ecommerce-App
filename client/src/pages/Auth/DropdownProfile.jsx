import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiShoppingBag,
  FiHelpCircle,
  FiLogOut,
  FiGrid,
  FiBox,
  FiTag,
  FiList,
  FiUsers,
} from "react-icons/fi";

const NavLink = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
  >
    <Icon size={14} className="text-stone-400 shrink-0" />
    {label}
  </Link>
);

const DropdownProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-52 bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden py-2">
      {!userInfo ? (
        <div className="px-4 py-3 flex flex-col gap-2">
          <Link to="/login">
            <button className="w-full py-2 rounded-full bg-stone-900 text-white text-sm font-semibold hover:bg-stone-700 transition-colors">
              Connexion
            </button>
          </Link>
          <Link to="/register">
            <button className="w-full py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors">
              Inscription
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* User info */}
          <div className="px-4 py-3 border-b border-stone-100">
            <p className="text-xs font-semibold text-stone-800 truncate">
              {userInfo.username}
            </p>
            <p className="text-[11px] text-stone-400 truncate">
              {userInfo.email}
            </p>
          </div>

          {/* User links */}
          {!userInfo.isAdmin && (
            <div className="py-1">
              <NavLink to="/profile" icon={FiUser} label="Mon profil" />
              <NavLink
                to="/user-orders"
                icon={FiShoppingBag}
                label="Mes commandes"
              />
              <NavLink to="/" icon={FiHelpCircle} label="Aide & Contact" />
            </div>
          )}

          {/* Admin links */}
          {userInfo.isAdmin && (
            <div className="py-1">
              <p className="px-4 pt-2 pb-1 text-[10px] font-medium uppercase tracking-widest text-stone-400">
                Administration
              </p>
              <NavLink
                to="/admin/dashboard"
                icon={FiGrid}
                label="Tableau de bord"
              />
              <NavLink to="/admin/productlist" icon={FiBox} label="Produits" />
              <NavLink
                to="/admin/categorylist"
                icon={FiTag}
                label="Catégories"
              />
              <NavLink to="/admin/orderlist" icon={FiList} label="Commandes" />
              <NavLink
                to="/admin/userlist"
                icon={FiUsers}
                label="Utilisateurs"
              />
            </div>
          )}

          {/* Logout */}
          <div className="border-t border-stone-100 mt-1 pt-1">
            <button
              onClick={logoutHandler}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <FiLogOut size={14} className="shrink-0" />
              Déconnexion
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownProfile;
