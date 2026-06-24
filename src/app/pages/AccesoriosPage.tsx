import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useAccessories } from "../contexts/AccessoriesContext";
import { AccessoryCard } from "../components/AccessoryCard";
import { AccessoryDetailModal } from "../components/AccessoryDetailModal";
import type { Accessory } from "../contexts/AccessoriesContext";
import logoImg from "../../imports/LOGO_QUIROGA_AUTOMOVILES.png";

export function AccesoriosPage() {
  const navigate = useNavigate();
  const { accessories, loading } = useAccessories();
  const [selected, setSelected] = useState<Accessory | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-[#0936B3] transition-colors">
            <ArrowLeft size={18} />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.85rem" }}>Volver</span>
          </button>
          <img src={logoImg} alt="Quiroga Automóviles" className="h-9 w-auto object-contain" />
          <div style={{ width: "80px" }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#0d0d14", marginBottom: "24px" }}>
          Accesorios — <span style={{ color: "#0936B3" }}>{accessories.length} productos</span>
        </h1>

        {loading ? (
          <div className="text-center py-16" style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>Cargando...</div>
        ) : accessories.length === 0 ? (
          <div className="text-center py-16" style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>
            No hay accesorios disponibles por el momento.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {accessories.map((a) => (
              <AccessoryCard key={a.id} accessory={a} onOpen={setSelected} />
            ))}
          </div>
        )}
      </div>

      {selected && <AccessoryDetailModal accessory={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
