import { useState, useEffect } from "react";

import banner1H from "../../imports/Banner_1_horizontal_-_auto_electrico-1.png";
import banner2H from "../../imports/Banner_2_Horizontal_-_promo_mundialista-1.jpeg";
import banner3H from "../../imports/Banner_3_Horizontal_-_taller-1.jpeg";

import banner1V from "../../imports/Banner_1_vertical_-_auto_electrico-1.jpeg";
import banner2V from "../../imports/Banner_2_Vertical_-_promo_mundialista-1.jpeg";
import banner3V from "../../imports/Banner_3_Vertical_-_taller-1.jpeg";

const banners = [
  { h: banner1H, v: banner1V, alt: "Tu próximo auto eléctrico te espera" },
  { h: banner2H, v: banner2V, alt: "Promo Mundialista" },
  { h: banner3H, v: banner3V, alt: "Servicio Automotriz" },
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % banners.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden"
      style={{ marginTop: "80px", height: "calc(100svh - 80px)" }}
    >
      {/* Slides — fill the above-the-fold area, crop edges */}
      {banners.map((b, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
        >
          {/* Desktop */}
          <img
            src={b.h}
            alt={b.alt}
            className="hidden md:block w-full h-full object-cover"
          />
          {/* Mobile */}
          <img
            src={b.v}
            alt={b.alt}
            className="block md:hidden w-full h-full object-cover"
          />
        </div>
      ))}
    </section>
  );
}
