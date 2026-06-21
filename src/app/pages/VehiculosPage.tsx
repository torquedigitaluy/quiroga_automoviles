import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useVehicles } from "../contexts/VehiclesContext";
import { StockCard } from "../components/StockCard";
import { CarDetailModal } from "../components/CarDetailModal";
import type { Vehicle } from "../contexts/VehiclesContext";
import type { CarDetail } from "../components/CarDetailModal";
import logoImg from "../../imports/LOGO_QUIROGA_AUTOMOVILES.png";

function toCarDetail(v: Vehicle): CarDetail {
  return {
    id: typeof v.id === "string" ? parseInt(v.id) || 0 : v.id,
    name: v.name, year: v.year, price: v.price, km: v.km,
    fuel: v.fuel, transmission: v.transmission, badge: v.badge,
    images: v.images, videos: v.videos, features: v.features, whatsappText: v.whatsappText,
  };
}

const MAX_PRICE = 80000;

export function VehiculosPage() {
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const [filterType, setFilterType] = useState<"todos" | "nuevo" | "usado">("todos");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [selectedCar, setSelectedCar] = useState<CarDetail | null>(null);

  const filtered = vehicles.filter((v) => {
    if (filterType !== "todos" && v.type !== filterType) return false;
    if (v.priceNum > 0 && v.priceNum > maxPrice) return false;
    return true;
  });

  const filterBtnStyle = (active: boolean) => ({
    fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.82rem",
    letterSpacing: "0.06em", padding: "8px 20px", borderRadius: "999px",
    border: `1px solid ${active ? "#0936B3" : "rgba(0,0,0,0.1)"}`,
    backgroundColor: active ? "#0936B3" : "#fff",
    color: active ? "#fff" : "#6b7280", cursor: "pointer", transition: "all 0.2s",
  } as React.CSSProperties);

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
          Stock completo — <span style={{ color: "#0936B3" }}>{filtered.length} vehículos</span>
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl" style={{ backgroundColor: "#f4f6fb" }}>
          <div className="flex flex-wrap gap-2">
            {(["todos", "usado", "nuevo"] as const).map((f) => (
              <button key={f} onClick={() => setFilterType(f)} style={filterBtnStyle(filterType === f)}>
                {f === "todos" ? "TODOS" : f === "nuevo" ? "0 KM" : "USADOS"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto flex-wrap">
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "#6b7280" }}>
              Precio máx: {maxPrice >= MAX_PRICE ? "Sin límite" : `USD ${maxPrice.toLocaleString()}`}
            </span>
            <input type="range" min={5000} max={MAX_PRICE} step={1000} value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)} style={{ accentColor: "#0936B3", width: "140px" }} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>
            No hay vehículos que coincidan con los filtros.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((v) => (
              <StockCard key={v.id} vehicle={v} onOpen={(veh) => setSelectedCar(toCarDetail(veh))} />
            ))}
          </div>
        )}
      </div>

      {selectedCar && <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </div>
  );
}
