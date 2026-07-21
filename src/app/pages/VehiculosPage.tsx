import { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useVehicles } from "../contexts/VehiclesContext";
import { StockCard } from "../components/StockCard";
import { CarDetailModal } from "../components/CarDetailModal";
import type { Vehicle } from "../contexts/VehiclesContext";
import type { CarDetail } from "../components/CarDetailModal";
import { shortIdFromSlug, vehicleSlug } from "../../lib/slug";
import logoImg from "../../imports/LOGO_QUIROGA_AUTOMOVILES.png";

function toCarDetail(v: Vehicle): CarDetail {
  return {
    id: typeof v.id === "string" ? parseInt(v.id) || 0 : v.id,
    slug: vehicleSlug(v),
    name: v.name, year: v.year, price: v.price, moneda: v.moneda, km: v.km,
    fuel: v.fuel, transmission: v.transmission, badge: v.badge,
    images: v.images, videos: v.videos, features: v.features, description: v.description, whatsappText: v.whatsappText,
  };
}

const MAX_PRICE = 80000;

export function VehiculosPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const { vehicles, loading } = useVehicles();
  const [filterType, setFilterType] = useState<"todos" | "nuevo" | "usado" | "electrico">("todos");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [search, setSearch] = useState("");
  const [selectedCar, setSelectedCar] = useState<CarDetail | null>(null);

  // Deep link from the "Compartir" button (/autos/:slug, e.g.
  // peugeot-208-active-2015-d7e1c84f) — the trailing segment is the
  // vehicle's short id, used to find it once the list loads, then the
  // slug is dropped from the URL.
  useEffect(() => {
    if (!slug || loading) return;
    const shortId = shortIdFromSlug(slug);
    const match = vehicles.find((v) => v.id.startsWith(shortId));
    if (match) setSelectedCar(toCarDetail(match));
    navigate("/autos", { replace: true });
  }, [slug, loading, vehicles, navigate]);

  const q = search.trim().toLowerCase();
  const filtered = vehicles.filter((v) => {
    if (filterType === "electrico") return v.fuel === "Eléctrico";
    if (filterType !== "todos" && v.type !== filterType) return false;
    if (v.priceNum > 0 && v.priceNum > maxPrice) return false;
    if (q && !v.name.toLowerCase().includes(q) && !String(v.year).includes(q)) return false;
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
          <a
            href={`https://wa.me/?text=${encodeURIComponent("Mirá todos los vehículos de Quiroga Automóviles: " + window.location.origin + "/autos")}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full transition-all hover:brightness-110 flex-shrink-0"
            style={{ backgroundColor: "#25D366", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#fff", whiteSpace: "nowrap" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="hidden sm:inline">Compartir</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#0d0d14", marginBottom: "24px" }}>
          Todos los vehículos — <span style={{ color: "#0936B3" }}>{filtered.length} vehículos</span>
        </h1>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-8 p-4 rounded-2xl" style={{ backgroundColor: "#f4f6fb" }}>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#0936B3" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por marca, modelo, año..."
              style={{
                fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem", fontWeight: 500, color: "#0d0d14",
                backgroundColor: "#fff", border: "1.5px solid #0936B3", borderRadius: "12px",
                padding: "10px 14px 10px 38px", width: "100%", outline: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1rem", lineHeight: 1 }}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>

          {/* Type filters + price */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {(["todos", "usado", "nuevo", "electrico"] as const).map((f) => (
                <button key={f} onClick={() => setFilterType(f)} style={filterBtnStyle(filterType === f)}>
                  {f === "todos" ? "TODOS" : f === "nuevo" ? "0 KM" : f === "usado" ? "USADOS" : "⚡ ELÉCTRICOS"}
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
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>
            No hay vehículos que coincidan con los filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
