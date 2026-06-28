import { FiCheck } from "react-icons/fi";

const STEPS = [
  { label: "Connexion", sub: "Votre compte" },
  { label: "Livraison", sub: "Adresse & paiement" },
  { label: "Validation", sub: "Confirmation" },
];

const ProgressSteps = ({ step1, step2, step3 }) => {
  const completed = [step1, step2, step3];

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-px bg-stone-200 z-0" />

        {/* Active line — grows based on steps */}
        <div
          className="absolute top-5 left-0 h-px bg-[var(--primary)] z-0 transition-all duration-500"
          style={{
            width: step3 ? "100%" : step2 ? "50%" : step1 ? "0%" : "0%",
          }}
        />

        {STEPS.map((step, i) => {
          const done = completed[i];
          const current = !done && (i === 0 ? true : completed[i - 1]);

          return (
            <div key={i} className="flex flex-col items-center z-10 gap-2">
              {/* Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold border-2 transition-all duration-300 ${
                  done
                    ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                    : current
                      ? "bg-white border-[var(--primary)] text-[var(--primary)]"
                      : "bg-white border-stone-200 text-stone-300"
                }`}
              >
                {done ? <FiCheck size={16} strokeWidth={2.5} /> : i + 1}
              </div>

              {/* Labels */}
              <div className="text-center">
                <p
                  className={`text-xs font-semibold ${done || current ? "text-stone-700" : "text-stone-300"}`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-[10px] ${done || current ? "text-stone-400" : "text-stone-300"}`}
                >
                  {step.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
