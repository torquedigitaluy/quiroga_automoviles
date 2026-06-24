import { useState } from "react";
import { useVehicles } from "../contexts/VehiclesContext";
import { StockCard } from "./StockCard";
import { CarDetailModal } from "./CarDetailModal";
import type { Vehicle } from "../contexts/VehiclesContext";
import type { CarDetail } from "./CarDetailModal";

function toCarDetail(v: Vehicle): CarDetail {
  return {
    id: typeof v.id === "string" ? parseInt(v.id) || 0 : v.id,
    name: v.name, year: v.year, price: v.price, moneda: v.moneda, km: v.km,
    fuel: v.fuel, transmission: v.transmission, badge: v.badge,
    images: v.images, videos: v.videos, features: v.features, description: v.description, whatsappText: v.whatsappText,
  };
}

export function StockVehiculos() {
  const { vehicles } = useVehicles();
  const [selectedCar, setSelectedCar] = useState<CarDetail | null>(null);

  const filtered = vehicles.filter((v) => v.featured);

  return (
    <section id="stock" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0936B3", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            VEHÍCULOS DESTACADOS
          </h2>
          <a href="/autos"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-[#0936B3] hover:bg-[#0936B3] hover:text-white hover:border-[#0936B3]"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.82rem", borderColor: "#0936B3" }}>
            Ver Vehículos
          </a>
        </div>

        {/* Grid — 3 cols, 6 vehicles */}
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>
            No hay vehículos destacados por el momento.
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
