import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import logo from "../../assets/logo.svg";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";

const inputClass =
  "w-full px-4 py-3 text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder-stone-400";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisiblePassword, setVisiblePassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne sont pas identiques");
      return;
    }
    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success(`Bienvenue ${res.username} !`);
    } catch (err) {
      toast.error(err.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Jayma" className="h-10" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">
            Créer un compte
          </h1>
          <p className="text-sm text-stone-400">
            Bienvenue chez Jayma. C'est gratuit !
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                placeholder="johndoe"
                required
              />
            </div>

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
              <PasswordStrengthMeter password={password} />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClass} ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : confirmPassword && confirmPassword === password
                      ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200"
                      : ""
                }`}
                placeholder="••••••••"
                required
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-500 mt-1.5">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? (
                "Inscription..."
              ) : (
                <>
                  Créer mon compte <FiArrowRight size={14} />
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
          Déjà inscrit ?{" "}
          <Link
            to={`/login?redirect=${redirect}`}
            className="text-[var(--primary)] font-medium hover:underline"
          >
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
