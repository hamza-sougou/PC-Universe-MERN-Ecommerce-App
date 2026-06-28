import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { FiEye, FiEyeOff, FiArrowRight, FiUser, FiMail, FiShoppingBag } from "react-icons/fi";

const inputClass =
  "w-full px-4 py-2.5 text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder-stone-400";

const labelClass =
  "block text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5";

const Profile = () => {
  const [username,          setUserName]        = useState("");
  const [email,             setEmail]           = useState("");
  const [password,          setPassword]        = useState("");
  const [confirmPassword,   setConfirmPassword] = useState("");
  const [isVisiblePassword, setVisiblePassword] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profil mis à jour avec succès");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="max-w-xl mx-auto px-5 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
            Mon compte
          </p>
          <h1 className="text-2xl font-semibold text-stone-800">
            Mon profil
          </h1>
        </div>

        {/* Avatar + info */}
        <div className="flex items-center gap-4 bg-white border border-stone-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
            <FiUser size={24} className="text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">{userInfo.username}</p>
            <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
              <FiMail size={11} /> {userInfo.email}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-5">
            Modifier mes informations
          </h2>

          <form onSubmit={submitHandler} className="flex flex-col gap-4">

            <div>
              <label className={labelClass}>Nom d'utilisateur</label>
              <input
                type="text"
                className={inputClass}
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nom d'utilisateur"
              />
            </div>

            <div>
              <label className={labelClass}>Adresse email</label>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
              />
            </div>

            <div className="h-px bg-stone-100" />

            <div>
              <label className={labelClass}>Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={isVisiblePassword ? "text" : "password"}
                  className={inputClass + " pr-12"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Laisser vide pour ne pas modifier"
                />
                <button
                  type="button"
                  onClick={() => setVisiblePassword(!isVisiblePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {isVisiblePassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Confirmer le mot de passe</label>
              <input
                type="password"
                className={`${inputClass} ${
                  confirmPassword && confirmPassword !== password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : confirmPassword && confirmPassword === password
                    ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200"
                    : ""
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-500 mt-1.5">
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            <div className="h-px bg-stone-100" />

            <div className="flex items-center justify-between gap-3">
              <Link
                to="/user-orders"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 text-sm font-semibold transition-colors"
              >
                <FiShoppingBag size={14} />
                Mes commandes
              </Link>

              <button
                type="submit"
                disabled={loadingUpdateProfile}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {loadingUpdateProfile ? "Mise à jour..." : (
                  <>Enregistrer <FiArrowRight size={14} /></>
                )}
              </button>
            </div>

            {loadingUpdateProfile && (
              <div className="flex justify-center"><Loader /></div>
            )}
          </form>
        </div>

      </main>
    </div>
  );
};

export default Profile;