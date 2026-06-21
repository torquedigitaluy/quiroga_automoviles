import { useState } from "react";
import { MessageCircle } from "lucide-react";

const WA_TALLER = "598091888158";

export function Taller() {
  const [form, setForm] = useState({ marca: "", modelo: "", anio: "", combustible: "Nafta" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Quiero cotizar un servicio para este vehículo:\n*Marca:* ${form.marca}\n*Modelo:* ${form.modelo}\n*Año:* ${form.anio}\n*Combustible:* ${form.combustible}`;
    window.open(`https://wa.me/${WA_TALLER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const inp: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "#0d0d14",
    backgroundColor: "#f4f6fb", border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "10px", padding: "10px 14px", width: "100%", outline: "none",
  };
  const lbl: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.72rem",
    letterSpacing: "0.12em", color: "#6b7280", display: "block", marginBottom: "5px",
  };

  return (
    <section id="taller" className="py-20 relative overflow-hidden" style={{ backgroundColor: "#f4f6fb" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10 text-center">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#0d0d14", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            Servicio Automotriz
          </h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280", fontSize: "0.92rem", lineHeight: 1.7 }}>
            Contamos con taller especializado en servicio automotriz y mecánica ligera.
            Estamos ubicados en San Luis, Canelones.
          </p>
        </div>

        <div className="rounded-2xl p-7 shadow-sm" style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.07)" }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0d0d14", marginBottom: "20px" }}>
            Escribinos, cotizá y agendá tu servicio aquí
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#0936B3", marginBottom: "16px" }}>
            Quiero cotizar un servicio para este vehículo
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label style={lbl}>MARCA *</label><input name="marca" value={form.marca} onChange={handleChange} required placeholder="Ej: Toyota" style={inp} /></div>
              <div><label style={lbl}>MODELO *</label><input name="modelo" value={form.modelo} onChange={handleChange} required placeholder="Ej: Hilux" style={inp} /></div>
              <div><label style={lbl}>AÑO *</label><input name="anio" value={form.anio} onChange={handleChange} required placeholder="Ej: 2019" style={inp} /></div>
              <div>
                <label style={lbl}>TIPO DE COMBUSTIBLE *</label>
                <select name="combustible" value={form.combustible} onChange={handleChange} required style={inp}>
                  {["Nafta", "Diesel", "Eléctrico", "Híbrido"].map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <button type="submit"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl mt-2 transition-all hover:brightness-110 hover:scale-[1.01]"
              style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1rem" }}>
              <MessageCircle size={18} />
              AGENDAR POR WHATSAPP — TALLER
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
