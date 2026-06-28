import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import logo from "../../assets/logo.svg";

const inputClass =
  "w-full px-4 py-3 text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder-stone-400";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisiblePassword, setVisiblePassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Jayma" className="h-10" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">
            Bon retour !
          </h1>
          <p className="text-sm text-stone-400">
            Connectez-vous à votre compte Jayma.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="vous@exemple.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={isVisiblePassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass + " pr-12"}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setVisiblePassword(!isVisiblePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {isVisiblePassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  className="text-xs text-stone-400 hover:text-[var(--primary)] transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? (
                "Connexion..."
              ) : (
                <>
                  Se connecter <FiArrowRight size={14} />
                </>
              )}
            </button>

            {isLoading && (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-stone-400 mt-5">
          Pas encore de compte ?{" "}
          <Link
            to={`/register?redirect=${redirect}`}
            className="text-[var(--primary)] font-medium hover:underline"
          >
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
