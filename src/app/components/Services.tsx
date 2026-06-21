import { useSiteContent } from "../contexts/SiteContentContext";

export function Services() {
  const { novedades } = useSiteContent();
  const videos = novedades.filter((v) => v.url);

  return (
    <section id="servicios" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 3rem)", color: "#0d0d14", lineHeight: 0.95, letterSpacing: "-0.01em" }}
          className="whitespace-nowrap"
        >
          NOVEDADES Y <span style={{ color: "#0936B3" }}>LANZAMIENTOS</span>
        </h2>

        {videos.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {videos.map((v, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
                <video
                  src={v.url}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full"
                  style={{ aspectRatio: "9 / 16", objectFit: "cover", backgroundColor: "#000", display: "block" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 min-h-[80px]" />
        )}
      </div>
    </section>
  );
}
