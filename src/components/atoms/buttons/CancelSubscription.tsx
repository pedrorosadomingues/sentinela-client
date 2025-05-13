import { motion } from "framer-motion";
import { X } from "lucide-react";

type CancelSubscriptionButtonProps = {
  onClick?: () => void;
};

export function CancelSubscriptionButton({
  onClick,
}: CancelSubscriptionButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label="Cancelar assinatura"
      whileTap={{ scale: 0.95 }}        // feedback tátil
      whileHover={{ y: -2 }}            // leve “flutuar”
      onClick={onClick ?? (() => alert("CANCEL"))}
      className="
        group relative inline-flex items-center justify-center gap-2
        rounded-3xl border-2 border-red-600
        bg-white px-7 py-3
        text-sm font-semibold tracking-wide text-red-600
        shadow-sm transition-all duration-300
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2
        hover:bg-red-50 hover:shadow-md
      "
    >
      {/* Ícone X vermelho */}
      <X className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden="true" />
      Cancelar assinatura
    </motion.button>
  );
}
