import { useState } from "react";
import { Calculator, MessageCircle, Info } from "lucide-react";

const WA_NUMBER = "598092852725";
const INTERES_USD = 0.02;
const INTERES_UYU = 0.025;
const TITULO_USD = 750;
const TITULO_UYU = 30000;
const MAX_CUOTAS = 24;

function calcCuota(monto: number, tasa: number, cuotas: number) {
  if (cuotas === 0) return 0;
  return (monto * tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1);
}

export function CalculadoraPrestamo() {
  const [moneda, setMoneda] = useState<"USD" | "UYU">("USD");
  const [monto, setMonto] = useState("");
  const [cuotas, setCuotas] = useState(12);
  const [conTitulos, setConTitulos] = useState(false);
  const [resultado, setResultado] = useState<{ cuota: number; total: number } | null>(null);

  const calcular = () => {
    const montoNum = parseFloat(monto.replace(/[.,]/g, "").replace(",", "."));
    if (!montoNum || montoNum <= 0) return;
    const titulo = moneda === "USD" ? TITULO_USD : TITULO_UYU;
    const montoFinal = conTitulos ? montoNum + titulo : montoNum;
    const tasa = moneda === "USD" ? INTERES_USD : INTERES_UYU;
    const cuota = calcCuota(montoFinal, tasa, cuotas);
    setResultado({ cuota, total: cuota * cuotas });
  };

  const enviarWA = () => {
    if (!resultado) return;
    const simb = moneda === "USD" ? "USD" : "$";
    const msg = `Hola, realicé una simulación de financiación propia:\n- Monto: ${simb} ${monto}\n- Cuotas: ${cuotas}\n- Con títulos: ${conTitulos ? "Sí" : "No"}\n- Cuota estimada: ${simb} ${resultado.cuota.toLocaleString("es-UY", { maximumFractionDigits: 0 })}\nQuisiera más información.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const fmt = (n: number) => n.toLocaleString("es-UY", { maximumFractionDigits: 0 });
  const simb = moneda === "USD" ? "USD " : "$ ";

  return (
    <section id="calculadora" className="py-20 relative overflow-hidden" style={{ backgroundColor: "#f4f6fb" }}>
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(22,52,212,0.1)", color: "#1634D4" }}>
            <Calculator size={26} />
          </div>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.2em", color: "#1634D4" }} className="uppercase mb-3">FINANCIACIÓN PROPIA</p>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0d0d14", lineHeight: 0.95, letterSpacing: "-0.01em" }}>CALCULÁ TU CUOTA</h2>
          <p className="mt-4" style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Financiación directa sin banco. Hasta 24 cuotas.
          </p>
        </div>

        <div className="rounded-2xl p-7 shadow-sm" style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.07)" }}>
          {/* Moneda */}
          <div className="flex gap-3 mb-6">
            {(["USD", "UYU"] as const).map((m) => (
              <button key={m} onClick={() => { setMoneda(m); setResultado(null); }}
                className="flex-1 py-2.5 rounded-xl border font-semibold transition-all"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.06em", borderColor: moneda === m ? "#1634D4" : "rgba(0,0,0,0.1)", backgroundColor: moneda === m ? "rgba(22,52,212,0.08)" : "#fff", color: moneda === m ? "#1634D4" : "#6b7280" }}>
                {m === "USD" ? "Dólares (USD)" : "Pesos (UYU)"}
              </button>
            ))}
          </div>

          {/* Monto */}
          <div className="mb-5">
            <label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em", color: "#6b7280", display: "block", marginBottom: "6px" }}>
              MONTO A FINANCIAR ({moneda}) *
            </label>
            <input
              type="number"
              value={monto}
              onChange={(e) => { setMonto(e.target.value); setResultado(null); }}
              placeholder={moneda === "USD" ? "Ej: 5000" : "Ej: 200000"}
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1rem", color: "#0d0d14", backgroundColor: "#f4f6fb", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", padding: "11px 14px", width: "100%", outline: "none" }}
            />
          </div>

          {/* Cuotas slider */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em", color: "#6b7280" }}>CANTIDAD DE CUOTAS</label>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#1634D4" }}>{cuotas}</span>
            </div>
            <input type="range" min={1} max={MAX_CUOTAS} value={cuotas} onChange={(e) => { setCuotas(+e.target.value); setResultado(null); }}
              className="w-full" style={{ accentColor: "#1634D4", height: "4px" }} />
            <div className="flex justify-between mt-1">
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", color: "#9ca3af" }}>1 cuota</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", color: "#9ca3af" }}>24 cuotas</span>
            </div>
          </div>

          {/* Con títulos */}
          <div className="flex items-center gap-3 mb-7 p-4 rounded-xl" style={{ backgroundColor: "#f4f6fb", border: "1px solid rgba(0,0,0,0.07)" }}>
            <button onClick={() => { setConTitulos(!conTitulos); setResultado(null); }}
              className="w-12 h-6 rounded-full transition-colors flex items-center"
              style={{ backgroundColor: conTitulos ? "#1634D4" : "#d1d5db", padding: "2px" }}>
              <span className="w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ transform: conTitulos ? "translateX(24px)" : "translateX(0)" }} />
            </button>
            <div className="flex-1">
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "#0d0d14" }}>Incluir gestión de títulos</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: "#9ca3af" }}>Trámites notariales y gestoría incluidos</p>
            </div>
            <Info size={16} style={{ color: "#9ca3af" }} />
          </div>

          {/* Calcular */}
          <button onClick={calcular}
            className="w-full py-3.5 rounded-xl transition-all hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] mb-5"
            style={{ backgroundColor: "#1634D4", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.06em" }}>
            CALCULAR CUOTA
          </button>

          {/* Resultado */}
          {resultado && (
            <div className="rounded-xl p-5 mb-5 text-center" style={{ backgroundColor: "rgba(22,52,212,0.06)", border: "2px solid rgba(22,52,212,0.2)" }}>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: "#6b7280", letterSpacing: "0.1em" }}>CUOTA MENSUAL ESTIMADA</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "2.8rem", color: "#1634D4", lineHeight: 1.1 }}>
                {simb}{fmt(resultado.cuota)}
              </p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "#9ca3af", marginTop: "4px" }}>
                {cuotas} cuotas · Total: {simb}{fmt(resultado.total)}
                {conTitulos ? " (títulos incluidos)" : ""}
              </p>
              <button onClick={enviarWA}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-all hover:brightness-110"
                style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
                <MessageCircle size={17} />
                CONSULTAR ESTA SIMULACIÓN
              </button>
            </div>
          )}

          {/* Requisitos */}
          <div className="rounded-xl p-4" style={{ backgroundColor: "#fff7ed", border: "1px solid rgba(234,88,12,0.2)" }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em", color: "#ea580c", marginBottom: "8px" }}>REQUISITOS FINANCIACIÓN PROPIA</p>
            <ul className="space-y-1">
              {["Recibos de sueldo", "Constancia de domicilio", "Segunda firma (familiar o pareja)", "NO importa CLEARING"].map((r) => (
                <li key={r} className="flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#374151" }}>
                  <span style={{ color: "#ea580c" }}>✓</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
