import { Plug, MessageCircle } from "lucide-react";

const WA_ACCESORIOS = "https://wa.me/598092852725?text=Hola%2C%20quisiera%20consultar%20por%20el%20Cargador%20El%C3%A9ctrico%2032A";

export function Accesorios() {
  return (
    <section id="accesorios" className="py-20" style={{ backgroundColor: "#f4f6fb" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#0d0d14", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            ACCESORIOS
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(9,54,179,0.08)", color: "#0936B3" }}>
              <Plug size={28} />
            </div>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#0d0d14" }}>
              Cargador Eléctrico
            </h3>
            <span className="mt-2 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(9,54,179,0.08)", color: "#0936B3", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.06em" }}>
              32A
            </span>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#0936B3", marginTop: "16px" }}>
              USD 490
            </p>
            <a href={WA_ACCESORIOS} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-6 py-3 rounded-xl transition-all hover:brightness-110"
              style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.88rem" }}>
              <MessageCircle size={16} />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
