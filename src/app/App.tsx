import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { MessageCircle } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { StockVehiculos } from "./components/StockVehiculos";
import { Accesorios } from "./components/Accesorios";
import { CotizadorVehiculo } from "./components/CotizadorVehiculo";
import { Financiacion } from "./components/Financiacion";
import { CalculadoraFinanciacion } from "./components/CalculadoraFinanciacion";
import { Seguros } from "./components/Seguros";
import { Taller } from "./components/Taller";
import { Sucursales } from "./components/Sucursales";
import { Footer } from "./components/Footer";
import { WelcomePopup } from "./components/WelcomePopup";
import { VehiclesProvider } from "./contexts/VehiclesContext";
import { SiteContentProvider } from "./contexts/SiteContentContext";
import { VehiculosPage } from "./pages/VehiculosPage";
import { AdminLogin, AdminPanel } from "./pages/AdminPanel";

/* MARKER-MAKE-KIT-INVOKED */

const WHATSAPP_URL = "https://wa.me/598092852725?text=Hola%2C%20me%20interesa%20consultar%20sobre%20un%20auto";

function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp"
      className="fixed bottom-7 right-7 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
      style={{
        backgroundColor: "#25D366", color: "#fff",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        boxShadow: "0 8px 32px rgba(37,211,102,0.35)",
        fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.06em",
      }}>
      <MessageCircle size={20} className="group-hover:animate-bounce" />
      CONSULTAR
    </a>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <WelcomePopup />
      <Navbar />
      <Hero />
      <Services />
      <StockVehiculos />
      <Accesorios />
      <CalculadoraFinanciacion />
      <Financiacion />
      <Seguros />
      <CotizadorVehiculo />
      <Taller />
      <Sucursales />
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <VehiclesProvider>
        <SiteContentProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/autos" element={<VehiculosPage />} />
          <Route path="/autos/:slug" element={<VehiculosPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        </SiteContentProvider>
      </VehiclesProvider>
    </BrowserRouter>
  );
}
