import { useState } from "react";
import { MessageCircle } from "lucide-react";

const WA_NUMBER = "598092852725";

type TipoOperacion = "venta" | "permuta";

export function CotizadorVehiculo() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    marca: "",
    modelo: "",
    anio: "",
    km: "",
    tipo: "venta" as TipoOperacion,
    observaciones: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tipoLabel = form.tipo === "venta" ? "Venta" : "Permuta";

    const msg = `*COTIZACIÓN DE VEHÍCULO*

*Nombre:* ${form.nombre}
*Teléfono:* ${form.telefono}
*Vehículo:* ${form.marca} ${form.modelo} ${form.anio}
*Kilómetros:* ${form.km}
*Tipo de operación:* ${tipoLabel}
${form.observaciones ? `*Observaciones:* ${form.observaciones}` : ""}

FOTO: _Enviamos fotos del exterior e interior con buena luz natural._`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.9rem",
    color: "#0d0d14",
    backgroundColor: "#ffffff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: "10px",
    padding: "10px 14px",
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: "0.12em",
    color: "#6b7280",
    display: "block",
    marginBottom: "5px",
  };

  return (
    <section id="cotizador" className="py-20 relative overflow-hidden" style={{ backgroundColor: "#f4f6fb" }}>
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#0d0d14",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
            }}
          >
            COTIZÁ TU VEHÍCULO
          </h2>
          <p
            className="mt-4"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: "#6b7280",
              fontSize: "0.95rem",
              lineHeight: 1.7,
            }}
          >
            Completá el formulario para obtener tu tasación.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-7 flex flex-col gap-5 shadow-sm"
          style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.07)" }}
        >
          {/* Nombre + Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>NOMBRE *</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>TELÉFONO *</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
                placeholder="09X XXX XXX"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Marca + Modelo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>MARCA *</label>
              <input
                name="marca"
                value={form.marca}
                onChange={handleChange}
                required
                placeholder="Ej: Toyota"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>MODELO *</label>
              <input
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                required
                placeholder="Ej: Hilux"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Año + Kilómetros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>AÑO *</label>
              <input
                name="anio"
                value={form.anio}
                onChange={handleChange}
                required
                placeholder="Ej: 2019"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>KILÓMETROS *</label>
              <input
                name="km"
                value={form.km}
                onChange={handleChange}
                required
                placeholder="Ej: 85.000"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Tipo de operación */}
          <div>
            <label style={labelStyle}>TIPO DE OPERACIÓN *</label>
            <div className="flex flex-wrap gap-3 mt-1">
              {(["venta", "permuta"] as TipoOperacion[]).map((op) => (
                <label
                  key={op}
                  className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border transition-all"
                  style={{
                    borderColor: form.tipo === op ? "#1634D4" : "rgba(0,0,0,0.12)",
                    backgroundColor: form.tipo === op ? "rgba(22,52,212,0.07)" : "#fff",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.06em",
                    color: form.tipo === op ? "#1634D4" : "#6b7280",
                  }}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value={op}
                    checked={form.tipo === op}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {op === "venta" ? "VENTA" : "PERMUTA"}
                </label>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label style={labelStyle}>OBSERVACIONES</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Estado del vehículo, equipamiento adicional, etc."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Nota fotos */}
          <p
            className="text-center rounded-xl px-4 py-3"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.82rem",
              color: "#1634D4",
              backgroundColor: "rgba(22,52,212,0.06)",
              border: "1px solid rgba(22,52,212,0.15)",
              lineHeight: 1.6,
            }}
          >
            FOTO: <strong>Envianos las fotos</strong> de tu vehículo de exterior e interior con luz natural clara para agilizar la valuación.
          </p>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center text-center gap-2 py-3.5 px-4 rounded-xl transition-all hover:brightness-110 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              backgroundColor: "#25D366",
              color: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "0.06em",
              flexWrap: "wrap",
            }}
          >
            <MessageCircle size={19} />
            <span>ENVIAR COTIZACIÓN</span>
          </button>
        </form>
      </div>
    </section>
  );
}
