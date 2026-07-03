import { Share2 } from "lucide-react";
import type { Vehicle } from "../contexts/VehiclesContext";
import { vehicleSlug } from "../../lib/slug";

interface Props {
  vehicle: Vehicle;
  onOpen: (v: Vehicle) => void;
}

function WAIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function StockCard({ vehicle, onOpen }: Props) {
  const waText = encodeURIComponent(`Hola, vi el ${vehicle.name} ${vehicle.year} en su página web. ¿Está disponible?`);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/autos/${vehicleSlug(vehicle)}`;
    if (navigator.share) navigator.share({ title: vehicle.name, url });
    else { navigator.clipboard.writeText(url); alert("Enlace copiado"); }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
      style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
      onClick={() => onOpen(vehicle)}
    >
      {/* Image — 9:16 */}
      <div className="relative overflow-hidden bg-gray-100 h-64 sm:h-auto" style={{ aspectRatio: "9/16", maxHeight: "360px" }}>
        <img src={vehicle.images[0]} alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {vehicle.images.length > 1 && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs"
            style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            +{vehicle.images.length} fotos
          </div>
        )}
        <button onClick={handleShare}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/85 hover:bg-white transition-colors"
          aria-label="Compartir">
          <Share2 size={13} style={{ color: "#0936B3" }} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Name, price, year/type */}
        <div>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "0.95rem", color: "#0936B3", lineHeight: 1.2 }}>
            {vehicle.name}
          </h3>
          {vehicle.price && (
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#0d0d14", marginTop: "2px" }}>
              {vehicle.moneda} {vehicle.price}
            </p>
          )}
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>
            {vehicle.year} · {vehicle.type === "usado" ? "Usado" : "0 KM"}
          </p>
        </div>

        {/* Equipment snippet */}
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.7rem", color: "#6b7280", lineHeight: 1.5 }}>
          {vehicle.features.slice(0, 2).join(" · ")}
        </p>

        {/* Financing banner — blue border, below image */}
        <div className="rounded-xl px-3 py-2 text-center" style={{ border: "1.5px solid #0936B3" }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.6rem", color: "#0936B3", lineHeight: 1.4 }}>
            Financiación propia con entrega del 50% del valor del vehículo
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.6rem", color: "#0936B3", lineHeight: 1.4 }}>
            100% Financiación Bancaria
          </p>
        </div>

        {/* WhatsApp by location — no CONSULTAR, no phone numbers */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <a href={`https://wa.me/598099802299?text=${waText}`} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:brightness-95 transition-all"
            style={{ backgroundColor: "#f0f9f4", border: "1px solid rgba(37,211,102,0.2)" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.7rem", color: "#374151" }}>Zonamerica</span>
            <span className="flex items-center gap-1" style={{ color: "#25D366" }}><WAIcon /></span>
          </a>
          <a href={`https://wa.me/598091644585?text=${waText}`} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between px-3 py-2 rounded-xl hover:brightness-95 transition-all"
            style={{ backgroundColor: "#f0f9f4", border: "1px solid rgba(37,211,102,0.2)" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.7rem", color: "#374151" }}>San Luis</span>
            <span className="flex items-center gap-1" style={{ color: "#25D366" }}><WAIcon /></span>
          </a>
        </div>
      </div>
    </div>
  );
}
