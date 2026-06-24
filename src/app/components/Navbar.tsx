import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, X, Phone } from "lucide-react";
import logoImg from "../../imports/LOGO_QUIROGA_AUTOMOVILES.png";

const WHATSAPP_URL = "https://wa.me/598092852725?text=Hola%2C%20me%20interesa%20consultar%20sobre%20un%20auto";

export function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Inicio", href: "#inicio" },
    { label: "Financiación", href: "#financiacion" },
    { label: "Vehículos", to: "/autos" },
    { label: "Accesorios", to: "/accesorios" },
    { label: "Seguros", href: "#seguros" },
    { label: "Taller", href: "#taller" },
    { label: "Localidades", href: "#sucursales" },
    { label: "Contacto", href: "#cotizador" },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (link: { href?: string; to?: string }) => {
    if (link.to) { setMenuOpen(false); navigate(link.to); }
    else if (link.href) scrollTo(link.href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b shadow-sm"
          : "bg-white border-b"
      }`}
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <button onClick={() => scrollTo("#inicio")} className="cursor-pointer">
          <img src={logoImg} alt="Quiroga Automóviles" className="h-10 w-auto object-contain" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNavClick(l)}
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, letterSpacing: "0.08em" }}
              className="text-gray-500 hover:text-[#1634D4] transition-colors uppercase text-sm tracking-widest"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-700 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-6 flex flex-col gap-5" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNavClick(l)}
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, letterSpacing: "0.12em" }}
              className="text-left text-gray-600 hover:text-[#1634D4] uppercase text-lg"
            >
              {l.label}
            </button>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-full"
            style={{
              backgroundColor: "#1634D4",
              color: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            <Phone size={16} />
            CONSULTAR POR WHATSAPP
          </a>
        </div>
      )}
    </header>
  );
}
