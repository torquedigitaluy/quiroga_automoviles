import { MessageCircle } from "lucide-react";
import bseLogo from "../../imports/bse-logo.png";
import suraLogo from "../../imports/sura.png";
import portoLogo from "../../imports/Porto-Seguro-Logo.png";
import sanCristobalLogo from "../../imports/sancristobal.png";
import mapfreLogo from "../../imports/mapfre_logo.png";

const WA_SEGUROS = "https://wa.me/598091087058?text=Hola%2C%20quisiera%20cotizar%20un%20seguro%20para%20mi%20veh%C3%ADculo";

const aseguradoras = [
  { name: "BSE", logo: bseLogo, url: "https://www.bse.com.uy/portal-comercial/seguros/seguros-vehiculos/" },
  { name: "Sura", logo: suraLogo, url: "https://www.segurossura.com.uy/cotizadores/Autos/" },
  { name: "Porto Seguro", logo: portoLogo, url: "https://www.portoseguro.com.uy/cotizador-automovil" },
  { name: "San Cristóbal", logo: sanCristobalLogo, url: "https://www.sancristobalseguros.com.uy/corredor/rb-seguros/cotizar" },
  { name: "Mapfre", logo: mapfreLogo, url: "https://mapfre-web.com.uy/formulario_consulta/" },
];

export function Seguros() {
  return (
    <section id="seguros" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#0d0d14", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            Cotizá tu Seguro
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {aseguradoras.map((a) => (
            <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#0936B3]/25 hover:bg-[#0936B3]/5"
              style={{ backgroundColor: "#f4f6fb", borderColor: "rgba(0,0,0,0.07)" }}>
              <div className="w-full h-12 flex items-center justify-center">
                <img src={a.logo} alt={a.name} className="max-h-10 max-w-full object-contain" />
              </div>
              <span className="w-full text-center py-2 rounded-lg transition-all"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.08em", color: "#0d0d14", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "8px", padding: "6px 8px" }}>
                COTIZAR
              </span>
            </a>
          ))}
        </div>

        {/* WA button centered below logos */}
        <div className="flex justify-center">
          <a href={WA_SEGUROS} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full transition-all hover:brightness-110"
            style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.04em" }}>
            <MessageCircle size={18} />
            COTIZÁ TU SEGURO POR WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
}
