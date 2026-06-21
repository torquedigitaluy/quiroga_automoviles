import { Fuel, Settings2, Calendar, ChevronRight } from "lucide-react";
import type { CarDetail } from "./CarDetailModal";

export type { CarDetail };

interface CarCardProps {
  car: CarDetail;
  onOpen: (car: CarDetail) => void;
}

export function CarCard({ car, onOpen }: CarCardProps) {
  return (
    <div
      className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col cursor-pointer"
      style={{ backgroundColor: "#ffffff", borderColor: "rgba(0,0,0,0.08)" }}
      onClick={() => onOpen(car)}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52 bg-gray-100">
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {car.badge && (
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs"
            style={{
              backgroundColor: "#1634D4",
              color: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            {car.badge}
          </div>
        )}
        {car.images.length > 1 && (
          <div
            className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-xs"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
          >
            +{car.images.length} fotos
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#0d0d14",
                lineHeight: 1.1,
              }}
            >
              {car.name}
            </h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "#9ca3af", marginTop: "2px" }}>
              {car.year}
            </p>
          </div>
          {car.price && (
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "1.3rem",
                color: "#1634D4",
                whiteSpace: "nowrap",
              }}
            >
              {car.price}
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-3 mb-5 mt-1">
          <span className="flex items-center gap-1.5 text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280" }}>
            <Fuel size={13} style={{ color: "#1634D4" }} /> {car.fuel}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280" }}>
            <Settings2 size={13} style={{ color: "#1634D4" }} /> {car.transmission}
          </span>
          {car.km && (
            <span className="flex items-center gap-1.5 text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280" }}>
              <Calendar size={13} style={{ color: "#1634D4" }} /> {car.km}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-200 hover:bg-[#1634D4] hover:border-[#1634D4] hover:text-white"
          style={{
            borderColor: "rgba(22,52,212,0.3)",
            color: "#1634D4",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            letterSpacing: "0.06em",
          }}
        >
          VER DETALLES
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
