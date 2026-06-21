import { MapPin, MessageCircle } from "lucide-react";

const WA_ZONA = "https://wa.me/598099802299?text=Hola%2C%20quisiera%20obtener%20informaci%C3%B3n";
const WA_SAN_LUIS = "https://wa.me/598091644585?text=Hola%2C%20quisiera%20obtener%20informaci%C3%B3n";
const WAZE_ZONA = "https://waze.com/ul?q=Quiroga+Autom%C3%B3viles+Zonamerica&navigate=yes";
const WAZE_SAN_LUIS = "https://waze.com/ul?q=Quiroga+Automoviles+San+Luis&navigate=yes";

const branches = [
  {
    city: "MONTEVIDEO",
    address: "Zonamerica, Ruta 8 km 19",
    detail: "Montevideo, Uruguay",
    mapsUrl: "https://maps.google.com/?q=Quiroga+Autom%C3%B3viles+Zonamerica",
    wazeUrl: WAZE_ZONA,
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.875516126946!2d-56.06124019999999!3d-34.783909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a029002311039f%3A0x517c005ad2c08ea6!2sQuiroga%20Autom%C3%B3viles%20Zonamerica!5e0!3m2!1ses-419!2suy!4v1781456366166!5m2!1ses-419!2suy",
  },
  {
    city: "SAN LUIS, CANELONES",
    address: "Zorrilla de San Martín esq. Interbalnearia",
    detail: "15400 San Luis, Canelones, Uruguay",
    mapsUrl: "https://maps.google.com/?q=Quiroga+Automoviles+San+Luis",
    wazeUrl: WAZE_SAN_LUIS,
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3288.9254365773654!2d-55.58079996131023!3d-34.767011783502284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959ffd007d3ee4e7%3A0xec47a34a498ad6!2sQuiroga%20Automoviles%20San%20Luis!5e0!3m2!1ses-419!2suy!4v1781456321892!5m2!1ses-419!2suy",
  },
];

function WazeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#33ccff">
      <path d="M20.54 6.6C19.08 3.25 15.71 1 12 1 7.58 1 3.88 3.86 2.65 7.9 1.2 12.5 3.5 17.35 7.8 19.6l.2.1v2.8c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-2.8l.2-.1c3.3-1.7 5.5-5.1 5.5-8.6 0-1.5-.4-3-.16-4.4zM12 3c3.31 0 6.13 2.14 7.07 5.24.3 1 .43 1.8.43 2.76 0 3.07-1.87 5.93-4.74 7.3l-.76.37V21h-4v-2.33l-.76-.37C6.37 16.93 4.5 14.07 4.5 11c0-.55.06-1.1.17-1.64C5.3 5.7 8.38 3 12 3zm1 10h-2v-5h2v5zm0-7h-2V4h2v2z" />
    </svg>
  );
}

export function Sucursales() {
  return (
    <section id="sucursales" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title only */}
        <div className="mb-12 text-center">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0d0d14", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            UBICACIONES
          </h2>
        </div>

        {/* Branch cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {branches.map((b, i) => (
            <div key={i} className="group rounded-2xl border overflow-hidden hover:shadow-lg hover:border-[#0936B3]/30 transition-all"
              style={{ backgroundColor: "#f4f6fb", borderColor: "rgba(0,0,0,0.07)" }}>
              <div className="relative w-full h-52 bg-gray-200">
                <iframe src={b.embedSrc} width="100%" height="100%"
                  style={{ border: 0, display: "block" }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title={`Mapa ${b.city}`} />
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#0936B3] group-hover:text-white transition-colors"
                    style={{ backgroundColor: "rgba(9,54,179,0.1)", color: "#0936B3" }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#0d0d14", lineHeight: 1 }}>{b.city}</h3>
                    <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: "'Poppins', sans-serif", color: "#0936B3", fontSize: "0.88rem", marginTop: "3px", display: "block" }}
                      className="hover:underline">{b.address}</a>
                    <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280", fontSize: "0.78rem" }}>{b.detail}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border transition-colors hover:border-[#0936B3] hover:text-[#0936B3]"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "#374151", borderColor: "rgba(0,0,0,0.1)" }}>
                    <MapPin size={13} /> Google Maps
                  </a>
                  <a href={b.wazeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border transition-colors hover:border-sky-300"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "#374151", borderColor: "rgba(0,0,0,0.1)" }}>
                    <WazeIcon /> Waze
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Road-style banner — 2 WA buttons, no "sin compromiso" */}
        <div className="rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0936B3 100%)" }}>
          {/* Road lane lines */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 2px, transparent 2px, transparent 60px)",
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 opacity-20" style={{
            background: "repeating-linear-gradient(90deg, #fff 0px, #fff 40px, transparent 40px, transparent 70px)"
          }} />

          <div className="relative z-10">
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#fff", lineHeight: 1, letterSpacing: "-0.01em" }}>
              ¿LISTO PARA TU PRÓXIMO AUTO?
            </h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", marginTop: "6px" }}>
              Contactanos directamente desde cualquier sucursal.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3">
            <a href={WA_ZONA} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:scale-105 hover:brightness-110"
              style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
              <MessageCircle size={16} />
              Zona América
            </a>
            <a href={WA_SAN_LUIS} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:scale-105 hover:brightness-110"
              style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
              <MessageCircle size={16} />
              San Luis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
