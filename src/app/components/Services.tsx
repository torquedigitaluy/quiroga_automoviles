export function Services() {
  return (
    <section id="servicios" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.2em", color: "#0936B3" }}
          className="uppercase mb-3"
        >
          PRÓXIMAMENTE
        </p>
        <h2
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0d0d14", lineHeight: 0.95, letterSpacing: "-0.01em" }}
        >
          NOVEDADES Y<br /><span style={{ color: "#0936B3" }}>LANZAMIENTOS</span>
        </h2>
        {/* Espacio para videos futuros */}
        <div className="mt-8 min-h-[80px]" />
      </div>
    </section>
  );
}
