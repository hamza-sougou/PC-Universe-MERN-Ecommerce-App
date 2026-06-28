import { FiCheck, FiX } from "react-icons/fi";

const criteria = [
  { label: "Au moins 6 caractères", test: (p) => p.length >= 6 },
  { label: "Une majuscule", test: (p) => /[A-Z]/.test(p) },
  { label: "Une minuscule", test: (p) => /[a-z]/.test(p) },
  { label: "Un chiffre", test: (p) => /\d/.test(p) },
  { label: "Un caractère spécial", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const getStrength = (p) => criteria.filter((c) => c.test(p)).length;

const strengthConfig = [
  { label: "Très faible", color: "bg-red-500", text: "text-red-500" },
  { label: "Faible", color: "bg-orange-400", text: "text-orange-400" },
  { label: "Moyen", color: "bg-amber-400", text: "text-amber-400" },
  { label: "Bon", color: "bg-lime-500", text: "text-lime-500" },
  { label: "Excellent", color: "bg-emerald-500", text: "text-emerald-500" },
];

const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null;

  const strength = getStrength(password);
  const config = strengthConfig[Math.min(strength, 4)];

  return (
    <div className="mt-3 flex flex-col gap-2">
      {/* Bar */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < strength ? config.color : "bg-stone-200"
              }`}
            />
          ))}
        </div>
        <span className={`text-[11px] font-medium shrink-0 ${config.text}`}>
          {config.label}
        </span>
      </div>

      {/* Criteria */}
      <div className="grid grid-cols-1 gap-1">
        {criteria.map((c) => {
          const met = c.test(password);
          return (
            <div key={c.label} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 flex items-center justify-center rounded-full shrink-0 ${
                  met
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                {met ? (
                  <FiCheck size={9} strokeWidth={3} />
                ) : (
                  <FiX size={9} strokeWidth={3} />
                )}
              </div>
              <span
                className={`text-xs ${met ? "text-emerald-600" : "text-stone-400"}`}
              >
                {c.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
