import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const inputClass =
  "w-full px-4 py-2.5 text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder-stone-400";

const labelClass =
  "block text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || "",
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress.address) navigate("/shipping");
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-10">
        {/* Progress */}
        <div className="mb-12">
          <ProgressSteps step1 step2 />
        </div>

        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--primary)] font-medium mb-1">
              Étape 2
            </p>
            <h1 className="text-2xl font-semibold text-stone-800">
              Livraison & paiement
            </h1>
          </div>

          <form onSubmit={submitHandler}>
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 flex flex-col gap-5">
              {/* Address section */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-4">
                  Adresse de livraison
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass}>Adresse</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Ex : 12 rue de la Paix"
                      value={address}
                      required
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Ville</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Ex : Dakar"
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Code postal</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Ex : 10700"
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Pays</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Ex : Sénégal"
                      value={country}
                      required
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-stone-100" />

              {/* Payment section */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-4">
                  Méthode de paiement
                </p>

                <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl cursor-pointer hover:border-[var(--primary)] transition-colors has-[:checked]:border-[var(--primary)] has-[:checked]:bg-[var(--primary)]/5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[var(--primary)] w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-semibold text-stone-700">
                      PayPal
                    </p>
                    <p className="text-xs text-stone-400">
                      PayPal ou carte de crédit
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors"
            >
              Continuer vers la validation
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
