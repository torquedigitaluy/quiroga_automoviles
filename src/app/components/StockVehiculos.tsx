import { useState } from "react";
import { useVehicles } from "../contexts/VehiclesContext";
import { StockCard } from "./StockCard";
import { CarDetailModal } from "./CarDetailModal";
import type { Vehicle } from "../contexts/VehiclesContext";
import type { CarDetail } from "./CarDetailModal";

function toCarDetail(v: Vehicle): CarDetail {
  return {
    id: typeof v.id === "string" ? parseInt(v.id) || 0 : v.id,
    name: v.name, year: v.year, price: v.price, km: v.km,
    fuel: v.fuel, transmission: v.transmission, badge: v.badge,
    images: v.images, videos: v.videos, features: v.features, whatsappText: v.whatsappText,
  };
}

const MAX_PRICE = 80000;
type FilterType = "todos" | "nuevo" | "usado" | "electrico";

export function StockVehiculos() {
  const { vehicles } = useVehicles();
  const [filterType, setFilterType] = useState<FilterType>("todos");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [selectedCar, setSelectedCar] = useState<CarDetail | null>(null);

  const filtered = vehicles.filter((v) => {
    if (filterType === "electrico") return v.fuel === "Eléctrico";
    if (filterType !== "todos" && v.type !== filterType) return false;
    if (v.priceNum > 0 && v.priceNum > maxPrice) return false;
    return true;
  });

  const btn = (f: FilterType, label: string) => (
    <button key={f} onClick={() => setFilterType(f)} style={{
      fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.8rem",
      letterSpacing: "0.06em", padding: "7px 18px", borderRadius: "999px",
      border: `1px solid ${filterType === f ? "#0936B3" : "rgba(0,0,0,0.1)"}`,
      backgroundColor: filterType === f ? "#0936B3" : "#fff",
      color: filterType === f ? "#fff" : "#6b7280",
      cursor: "pointer", transition: "all 0.2s",
    } as React.CSSProperties}>
      {label}
    </button>
  );

  return (
    <section id="stock" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0936B3", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            VEHÍCULOS
          </h2>
          <a href="/autos"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-[#0936B3] hover:bg-[#0936B3] hover:text-white hover:border-[#0936B3]"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.82rem", borderColor: "#0936B3" }}>
            Ver Vehículos
          </a>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl" style={{ backgroundColor: "#f4f6fb" }}>
          <div className="flex flex-wrap gap-2">
            {btn("todos", "TODOS")}
            {btn("usado", "USADOS")}
            {btn("nuevo", "0 KM")}
            {btn("electrico", "⚡ ELÉCTRICOS")}
          </div>
          <div className="flex items-center gap-3 ml-auto flex-wrap">
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "#6b7280" }}>
              Precio máx: {maxPrice >= MAX_PRICE ? "Sin límite" : `USD ${maxPrice.toLocaleString()}`}
            </span>
            <input type="range" min={5000} max={MAX_PRICE} step={1000} value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)} style={{ accentColor: "#0936B3", width: "130px" }} />
          </div>
        </div>

        {/* Grid — 3 cols, 6 vehicles */}
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>
            No hay vehículos que coincidan con los filtros.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(0, 6).map((v) => (
              <StockCard key={v.id} vehicle={v} onOpen={(veh) => setSelectedCar(toCarDetail(veh))} />
            ))}
          </div>
        )}
      </div>
      {selectedCar && <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </section>
  );
}
