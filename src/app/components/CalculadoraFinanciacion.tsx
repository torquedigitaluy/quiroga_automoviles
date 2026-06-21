import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useVehicles } from "../contexts/VehiclesContext";

const USD_PLAZOS = [
  { cuotas: 12, mult: 1.24 },
  { cuotas: 18, mult: 1.36 },
  { cuotas: 24, mult: 1.48 },
  { cuotas: 30, mult: 1.6 },
  { cuotas: 36, mult: 1.72 },
];
const UYU_PLAZOS = [12, 15, 18, 24];
const TITULO_USD = 750;

function calcUSD(monto: number, mult: number, plazo: number) {
  return Math.ceil((monto * mult) / plazo);
}
function calcUYU(montoUYU: number, plazo: number) {
  return Math.round((montoUYU * (1 + (plazo * 3.5) / 100)) / plazo);
}

export function CalculadoraFinanciacion() {
  const { tipoCambio, setTipoCambio } = useVehicles();
  const [monto, setMonto] = useState("");
  const [incluyeTitulos, setIncluyeTitulos] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const montoNum = parseFloat(monto) || 0;
  const base = montoNum + (incluyeTitulos ? TITULO_USD : 0);
  const montoUYU = base * tipoCambio;
  const fmt = (n: number) => n.toLocaleString("es-UY");

  // Try to fetch BROU USD/UYU rate on mount
  useEffect(() => {
    const fetchRate = async () => {
      setFetchStatus("loading");
      try {
        // Use open.er-api.com — free, no API key, supports UYU
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("no ok");
        const data = await res.json();
        const rate = data?.rates?.UYU;
        if (rate && rate > 1) {
          setTipoCambio(Math.round(rate));
          setFetchStatus("ok");
        } else {
          setFetchStatus("err");
        }
      } catch {
        setFetchStatus("err");
      }
    };
    fetchRate();
  }, []);

  const th: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.7rem",
    letterSpacing: "0.08em", color: "#6b7280", textAlign: "left" as const,
    padding: "8px 12px", borderBottom: "1px solid rgba(0,0,0,0.07)", backgroundColor: "#f9fafb",
  };
  const td: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", padding: "10px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.04)", color: "#0d0d14",
  };
  const tdBold: React.CSSProperties = { ...td, fontWeight: 800, color: "#0936B3", fontSize: "0.95rem" };

  return (
    <section id="calculadora" className="py-20 relative overflow-hidden" style={{ backgroundColor: "#f4f6fb" }}>
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#0d0d14", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            FINANCIACIÓN PROPIA
          </h2>
          <p className="mt-3" style={{ fontFamily: "'Poppins', sans-serif", color: "#6b7280", fontSize: "0.88rem" }}>
            Ingresá el monto y calculamos las cuotas en dólares y pesos automáticamente.
          </p>
        </div>

        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.07)" }}>
          {/* Inputs */}
          <div className="p-6 border-b flex flex-col sm:flex-row gap-4" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
            <div className="flex-1">
              <label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.1em", color: "#6b7280", display: "block", marginBottom: "6px" }}>
                MONTO A FINANCIAR (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: "#0936B3", fontSize: "0.9rem" }}>
                  USD
                </span>
                <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Ej: 5000"
                  style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#0d0d14",
                    backgroundColor: "#f4f6fb", border: "1.5px solid #0936B3", borderRadius: "10px",
                    padding: "10px 14px 10px 52px", width: "100%", outline: "none" }} />
              </div>
              <label className="flex items-center gap-2 mt-3 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "#374151" }}>
                <input type="checkbox" checked={incluyeTitulos} onChange={(e) => setIncluyeTitulos(e.target.checked)}
                  style={{ accentColor: "#0936B3", width: "16px", height: "16px" }} />
                Incluir trámite de titulación
              </label>
            </div>

            {/* Tipo de cambio — editable, shows fetch status */}
            <div className="sm:w-52">
              <label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.1em", color: "#6b7280", display: "block", marginBottom: "6px" }}>
                TIPO DE CAMBIO (USD→UYU)
                {fetchStatus === "ok" && <span style={{ color: "#16a34a", marginLeft: "6px" }}>● BROU</span>}
                {fetchStatus === "err" && <span style={{ color: "#9ca3af", marginLeft: "6px" }}>● Manual</span>}
                {fetchStatus === "loading" && <RefreshCw size={10} className="inline ml-1 animate-spin" style={{ color: "#9ca3af" }} />}
              </label>
              <input type="number" value={tipoCambio}
                onChange={(e) => { setTipoCambio(+e.target.value); setFetchStatus("err"); }}
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem", color: "#0d0d14",
                  backgroundColor: "#f4f6fb", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px",
                  padding: "10px 14px", width: "100%", outline: "none" }} />
            </div>
          </div>

          {/* Results */}
          {montoNum > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* USD */}
              <div className="p-5">
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "0.82rem", color: "#0936B3", marginBottom: "10px" }}>
                  FINANCIACIÓN EN DÓLARES
                </p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th style={th}>CUOTAS</th>
                      <th style={{ ...th, textAlign: "right" as const }}>CUOTA/MES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {USD_PLAZOS.map(({ cuotas, mult }) => {
                      const cuota = calcUSD(base, mult, cuotas);
                      return (
                        <tr key={cuotas} className="hover:bg-blue-50/30 transition-colors">
                          <td style={td}>{cuotas}x</td>
                          <td style={{ ...tdBold, textAlign: "right" as const }}>USD {fmt(cuota)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* UYU */}
              <div className="p-5">
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "0.82rem", color: "#0936B3", marginBottom: "8px" }}>
                  FINANCIACIÓN EN PESOS
                </p>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th style={th}>CUOTAS</th>
                      <th style={{ ...th, textAlign: "right" as const }}>CUOTA/MES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UYU_PLAZOS.map((plazo) => {
                      const cuota = calcUYU(montoUYU, plazo);
                      return (
                        <tr key={plazo} className="hover:bg-blue-50/30 transition-colors">
                          <td style={td}>{plazo}x</td>
                          <td style={{ ...tdBold, textAlign: "right" as const }}>$ {fmt(cuota)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center" style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af", fontSize: "0.9rem" }}>
              Ingresá un monto para ver las cuotas
            </div>
          )}

          {/* Requirements */}
          <div className="p-4 border-t" style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "#fffbf0" }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.12em", color: "#ea580c", marginBottom: "5px" }}>
              REQUISITOS
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {["Recibos de sueldo", "Constancia de domicilio", "Segunda firma (familiar o pareja)", "Cédula de identidad", "NO importa CLEARING"].map((r) => (
                <span key={r} style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.76rem", color: "#374151" }}>✓ {r}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
