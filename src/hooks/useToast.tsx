import toast from "react-hot-toast";

export type ToastVariant = "success" | "error" | "warning" | "achievement" | "loading";

export interface ToastFunction {
  (variant: ToastVariant, message: string, code?: string): void;
}

export function useToast(): { use: ToastFunction } {
  const triggerToast: ToastFunction = (variant, message, code?) => {
    if ((variant === 'error' || variant === 'warning') && code) {

      toast.custom(
        <ToastCard message={message} code={code} variant={variant} />
      );
      return;
    }

    // Casos padrões sem código específico
    switch (variant) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast(message, { icon: "⚠️" });
        break;
      case "achievement":
        toast(message, { icon: "🏆" });
        break;
      case "loading":
        toast.loading(message, { position: "bottom-right", duration: 1000 });
        break;
      default:
        toast(message);
    }
  };

  return { use: triggerToast };
}

export function ToastCard({ variant, message, code }: { variant: ToastVariant, message: string, code?: string }) {
  const variantIconMap = (variant: ToastVariant) => {
    switch (variant) {
      case "success":
        return "🎉";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "achievement":
        return "🏆";
      case "loading":
        return "⏳";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="relative animate-appearance-in bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
      <div className="flex flex-row items-center">
        <div className="px-2">
          {variantIconMap(variant)}
        </div>
        <div
          className="flex flex-col"
          style={{
            maxWidth: "360px"
          }}>
          <div className="text-gray-500 mb-2">{message}</div>

          {/* TO DO criar a rota de help com a documentação dos erros e mudar para link */}
          <span
            className="text-primary-light text-sm"
          // target="_blank"
          // href={`/help?search=${code?.toLowerCase()}`}
          >
            code: {code}
          </span>
        </div>
      </div>
    </div>
  )
}