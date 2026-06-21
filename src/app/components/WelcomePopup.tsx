import { useEffect, useState } from "react";
import { X } from "lucide-react";
import cartelImg from "../../imports/ChatGPT_Image_19_jun_2026__10_25_13.png";

export function WelcomePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-full max-w-sm md:max-w-xl lg:max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "popupIn 0.3s ease-out" }}
      >
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#fff" }}
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <img
          src={cartelImg}
          alt="Quiroga Automóviles — Oferta"
          className="w-full h-auto block"
          style={{ maxHeight: "85vh", objectFit: "contain" }}
        />
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
