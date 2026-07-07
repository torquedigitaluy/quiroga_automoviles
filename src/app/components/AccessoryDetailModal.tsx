import { useState } from "react";
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import type { Accessory } from "../contexts/AccessoriesContext";

interface Props {
  accessory: Accessory;
  onClose: () => void;
}

export function AccessoryDetailModal({ accessory, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const total = accessory.images.length;
  const waText = encodeURIComponent(`Hola, quisiera consultar por ${accessory.name} (USD ${accessory.priceNum})`);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative bg-white rounded-2xl overflow-hidden w-full max-w-3xl md:max-w-5xl lg:max-w-6xl max-h-[94vh] flex flex-col shadow-2xl"
        style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 hover:bg-gray-100 transition-colors shadow"
          aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
          {/* Gallery */}
          <div className="md:w-[65%] flex-shrink-0 flex flex-col bg-white">
            <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-gray-50" style={{ minHeight: "280px" }}>
              {total > 0 ? (
                <img key={activeIdx} src={accessory.images[activeIdx]} alt={`${accessory.name} ${activeIdx + 1}`}
                  className="w-full h-full object-contain max-h-[420px] md:max-h-none" />
              ) : (
                <span style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af", fontSize: "0.85rem" }}>Sin imagen</span>
              )}
              {total > 1 && (
                <>
                  <button onClick={() => setActiveIdx((i) => (i - 1 + total) % total)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setActiveIdx((i) => (i + 1) % total)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            {total > 1 && (
              <div className="flex gap-2 px-3 py-3 overflow-x-auto bg-white border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                {accessory.images.map((src, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)}
                    className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100"
                    style={{ outline: i === activeIdx ? "2px solid #0936B3" : "2px solid transparent", outlineOffset: "1px" }}>
                    <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-6 flex flex-col gap-4 md:overflow-y-auto">
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#0936B3", lineHeight: 1.1 }}>
                {accessory.name}
              </h2>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#0d0d14", marginTop: "6px" }}>
                {accessory.priceNum > 0 ? `USD ${accessory.priceNum.toLocaleString("es-UY")}` : "—"}
              </p>
            </div>

            {accessory.description && (
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {accessory.description}
              </p>
            )}

            <a href={`https://wa.me/598092852725?text=${waText}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-auto py-3 rounded-xl transition-all hover:brightness-110"
              style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
              <MessageCircle size={16} />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
