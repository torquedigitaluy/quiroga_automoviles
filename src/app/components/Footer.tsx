import { MapPin, Phone } from "lucide-react";
import logoImg from "../../imports/LOGO_QUIROGA_AUTOMOVILES.png";

function IGIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
}
function FBIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
}
function TTIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.53V6.76a4.85 4.85 0 01-1.01-.07z" /></svg>;
}

export function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Same links as header
  const navLinks = [
    { label: "Inicio", href: "#inicio" },
    { label: "Financiación", href: "#financiacion" },
    { label: "Vehículos", href: "#stock" },
    { label: "Seguros", href: "#seguros" },
    { label: "Taller", href: "#taller" },
    { label: "Localidades", href: "#sucursales" },
    { label: "Contacto", href: "#cotizador" },
  ];

  return (
    <footer style={{ backgroundColor: "#f4f6fb", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-5">
              <img src={logoImg} alt="Quiroga Automóviles" className="h-14 w-auto object-contain" />
            </div>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: "300px" }}>
              Usados y 0 km. Ventas, permutas y financiación. Tu concesionaria de confianza en Uruguay.
            </p>
            {/* Social icons — B&W */}
            <div className="flex gap-3 mt-6">
              <a href="https://www.instagram.com/quirogautomoviles/" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-900 hover:text-white hover:border-gray-900"
                style={{ borderColor: "rgba(0,0,0,0.14)", color: "#374151" }} aria-label="Instagram">
                <IGIcon />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61588070671164" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-900 hover:text-white hover:border-gray-900"
                style={{ borderColor: "rgba(0,0,0,0.14)", color: "#374151" }} aria-label="Facebook">
                <FBIcon />
              </a>
              <a href="https://www.tiktok.com/@quirogaautomoviles" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-900 hover:text-white hover:border-gray-900"
                style={{ borderColor: "rgba(0,0,0,0.14)", color: "#374151" }} aria-label="TikTok">
                <TTIcon />
              </a>
            </div>
          </div>

          {/* Nav — same as header */}
          <div>
            <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.2em", color: "#9ca3af", marginBottom: "1rem" }}>
              NAVEGACIÓN
            </h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <button onClick={() => scrollTo(href)}
                    style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280", fontSize: "0.88rem" }}
                    className="hover:text-[#0936B3] transition-colors">
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => scrollTo("#cotizador")}
                  style={{ fontFamily: "'Poppins', sans-serif", color: "#0936B3", fontSize: "0.88rem", fontWeight: 600 }}
                  className="hover:text-[#061d6b] transition-colors">
                  Vendé o Consigná tu auto
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.2em", color: "#9ca3af", marginBottom: "1rem" }}>
              CONTACTO
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-2.5">
                <Phone size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#0936B3" }} />
                <a href="tel:+598092852725" style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280", fontSize: "0.88rem" }} className="hover:text-[#0936B3] transition-colors">
                  092 852 725
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#0936B3" }} />
                <a href="https://maps.google.com/?q=Quiroga+Autom%C3%B3viles+Zonamerica" target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.5 }}
                  className="hover:text-[#0936B3] transition-colors">
                  Zonamerica, Ruta 8 km 19,<br />Montevideo
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "#0936B3" }} />
                <a href="https://maps.google.com/?q=Quiroga+Automoviles+San+Luis" target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280", fontSize: "0.88rem", lineHeight: 1.5 }}
                  className="hover:text-[#0936B3] transition-colors">
                  Interbalnearia km 63,<br />San Luis, Canelones
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af", fontSize: "0.8rem" }}>
            © 2025 Quiroga Automóviles. Todos los derechos reservados.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af", fontSize: "0.8rem" }}>
            Uruguay · Ventas · Permutas · Financiación
          </p>
        </div>
      </div>
    </footer>
  );
}
