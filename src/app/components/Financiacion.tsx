import santanderLogo from "../../imports/santanderlogo.png";
import hsbcLogo from "../../imports/HSBC_logo__2018_.png";
import bbvaLogo from "../../imports/LOGO-BBVA-coreblue_RGB_DDB.png";
import scotiabankLogo from "../../imports/scotiabanklogo.png";
import itauLogo from "../../imports/itaulogo.png";
import cashLogo from "../../imports/cash_logo.png";

const banks = [
  { name: "Santander Mi Auto", logo: santanderLogo, url: "https://www.miauto.com.uy/#simulador" },
  { name: "HSBC", logo: hsbcLogo, url: "https://www.hsbc.com.uy/prestamos/prestamo-automotor/" },
  { name: "BBVA", logo: bbvaLogo, url: "https://simulatuprestamo.bbva.com.uy/#!/automotor" },
  { name: "Scotiabank", logo: scotiabankLogo, url: "https://www.scotiabank.com.uy/Personas/Prestamos/SolicitaloYa/calculadora-de-prestamos" },
  { name: "Itaú", logo: itauLogo, url: "https://www.itau.com.uy/inst/prestamosMiautoCalculador.html" },
  { name: "Cash", logo: cashLogo, url: "https://prestamocash.com.uy/prestamo" },
];

export function Financiacion() {
  return (
    <section id="financiacion" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 text-center">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#0d0d14", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            SIMULÁ TU PRÉSTAMO BANCARIO
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {banks.map((bank) => (
            <a key={bank.name} href={bank.url} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#0936B3]/25 hover:bg-[#0936B3]/5"
              style={{ backgroundColor: "#f4f6fb", borderColor: "rgba(0,0,0,0.07)" }}>
              <div className="w-full h-12 flex items-center justify-center">
                <img src={bank.logo} alt={bank.name} className="max-h-10 max-w-full object-contain" />
              </div>
              <span className="w-full text-center py-2 rounded-lg transition-all"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.08em", color: "#0d0d14", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "8px", padding: "6px 8px" }}>
                SIMULÁ TU PRÉSTAMO
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
