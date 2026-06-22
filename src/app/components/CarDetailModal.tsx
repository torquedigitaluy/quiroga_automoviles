import { useState } from "react";
import { X, ChevronLeft, ChevronRight, CheckCircle2, Play } from "lucide-react";

export interface CarDetail {
  id: number;
  name: string;
  year: number;
  price: string;
  moneda?: string;
  km: string;
  fuel: string;
  transmission: string;
  badge?: string;
  images: string[];
  videos?: string[];
  features: string[];
  description?: string;
  whatsappText: string;
}

function formatKm(km: string) {
  if (!km) return km;
  return /km/i.test(km) ? km : `${km} km`;
}

interface MediaItem { type: "image" | "video"; src: string; }
interface Props { car: CarDetail; onClose: () => void; }

function WAIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function WazeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#33ccff">
      <path d="M20.54 6.6C19.08 3.25 15.71 1 12 1 7.58 1 3.88 3.86 2.65 7.9 1.2 12.5 3.5 17.35 7.8 19.6l.2.1v2.8c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-2.8l.2-.1c3.3-1.7 5.5-5.1 5.5-8.6 0-1.5-.4-3-.16-4.4zM12 3c3.31 0 6.13 2.14 7.07 5.24.3 1 .43 1.8.43 2.76 0 3.07-1.87 5.93-4.74 7.3l-.76.37V21h-4v-2.33l-.76-.37C6.37 16.93 4.5 14.07 4.5 11c0-.55.06-1.1.17-1.64C5.3 5.7 8.38 3 12 3zm1 10h-2v-5h2v5zm0-7h-2V4h2v2z" />
    </svg>
  );
}

export function CarDetailModal({ car, onClose }: Props) {
  const media: MediaItem[] = [
    ...car.images.map((src) => ({ type: "image" as const, src })),
    ...(car.videos ?? []).map((src) => ({ type: "video" as const, src })),
  ];
  const [activeIdx, setActiveIdx] = useState(0);
  const total = media.length;
  const active = media[activeIdx];

  const isElectric = car.fuel === "Eléctrico";
  const isNew = car.km === "0 km" || car.km === "";

  const financingLines = isElectric && isNew
    ? ["Financiación bancaria hasta 72 cuotas en pesos, UI o dólares."]
    : isNew
    ? ["Financiación bancaria hasta 60 cuotas en pesos, UI o dólares."]
    : [
        "Financiación propia en pesos o USD hasta 24 cuotas.",
        "Financiación bancaria en pesos, UI o USD hasta 60 cuotas.",
      ];

  const typeLabel = isNew ? "0 KM" : "Usado";
  const waText = encodeURIComponent(car.whatsappText);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative bg-white rounded-2xl overflow-hidden w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl"
        style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 hover:bg-gray-100 transition-colors shadow"
          aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
          {/* Gallery — white background */}
          <div className="md:w-[62%] flex-shrink-0 flex flex-col bg-white">
            <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-gray-50" style={{ minHeight: "340px" }}>
              {active.type === "image"
                ? <img key={activeIdx} src={active.src} alt={`${car.name} ${activeIdx + 1}`}
                    className="w-full h-full object-contain" style={{ maxHeight: "500px" }} />
                : <video key={activeIdx} src={active.src} controls playsInline
                    className="w-full h-full object-contain" style={{ maxHeight: "500px" }} />
              }
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
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs"
                    style={{ backgroundColor: "rgba(0,0,0,0.45)", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                    {activeIdx + 1} / {total}
                  </div>
                </>
              )}
            </div>
            {total > 1 && (
              <div className="flex gap-2 px-3 py-3 overflow-x-auto bg-white border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                {media.map((item, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)}
                    className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-100"
                    style={{ outline: i === activeIdx ? "2px solid #0936B3" : "2px solid transparent", outlineOffset: "1px" }}>
                    {item.type === "image"
                      ? <img src={item.src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center bg-gray-200"><Play size={18} className="text-gray-500" /></div>
                    }
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="flex-1 p-6 flex flex-col gap-4 md:overflow-y-auto">
            <div>
              {car.badge && (
                <span className="inline-block px-3 py-0.5 rounded-full text-xs mb-2"
                  style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}>
                  {car.badge}
                </span>
              )}
              {/* Title — lighter weight */}
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1.6rem", color: "#0936B3", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                {car.name}
              </h2>
              <p style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af", fontSize: "0.82rem", marginTop: "3px" }}>
                {car.year} · {typeLabel}
              </p>
              {/* Price below name — black bold */}
              {car.price && (
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#0d0d14", marginTop: "4px", lineHeight: 1 }}>
                  {car.moneda ? `${car.moneda} ${car.price}` : car.price}
                </p>
              )}
            </div>

            {/* Specs */}
            <div className="flex flex-wrap gap-2">
              {[car.fuel, car.transmission, formatKm(car.km)].filter(Boolean).map((spec, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs"
                  style={{ backgroundColor: "#eef0f8", color: "#0d0d14", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                  {spec}
                </span>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.15em", color: "#9ca3af", marginBottom: "6px" }}>
                  DESCRIPCIÓN
                </p>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {car.description}
                </p>
              </div>
            )}

            {/* Features */}
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.15em", color: "#9ca3af", marginBottom: "8px" }}>
                EQUIPAMIENTO
              </p>
              <ul className="grid grid-cols-1 gap-1.5">
                {car.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#0936B3" }} />
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#374151" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Financing — conditional by type */}
            <div className="rounded-xl p-4" style={{ backgroundColor: "#f0f4ff", border: "1.5px solid #0936B3" }}>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", color: "#0936B3", marginBottom: "6px" }}>
                FINANCIACIÓN DISPONIBLE
              </p>
              {financingLines.map((line, i) => (
                <p key={i} style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#374151", lineHeight: 1.6 }}>{line}</p>
              ))}
            </div>

            {/* Contact by branch + Waze */}
            <div className="flex flex-col gap-2 mt-auto pt-1">
              <a href={`https://wa.me/598099802299?text=${waText}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:brightness-95 transition-all"
                style={{ backgroundColor: "#f0f9f4", border: "1px solid rgba(37,211,102,0.25)" }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#374151" }}>Zonamerica</span>
                <span className="flex items-center gap-1.5" style={{ color: "#25D366" }}>
                  <WAIcon />
                </span>
              </a>
              <a href={`https://wa.me/598091644585?text=${waText}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:brightness-95 transition-all"
                style={{ backgroundColor: "#f0f9f4", border: "1px solid rgba(37,211,102,0.25)" }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#374151" }}>San Luis</span>
                <span className="flex items-center gap-1.5" style={{ color: "#25D366" }}>
                  <WAIcon />
                </span>
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a href="https://waze.com/ul?q=Quiroga+Autom%C3%B3viles+Zonamerica&navigate=yes" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.72rem", color: "#374151" }}>
                  <WazeIcon /> Waze Zonamerica
                </a>
                <a href="https://waze.com/ul?q=Quiroga+Automoviles+San+Luis&navigate=yes" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.72rem", color: "#374151" }}>
                  <WazeIcon /> Waze San Luis
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
