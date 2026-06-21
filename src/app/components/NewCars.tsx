import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CarCard, type CarDetail } from "./CarCard";
import { CarDetailModal } from "./CarDetailModal";

import ora1 from "../../imports/712743843_18034908197655162_6149347715161402350_n.jpg";
import ora2 from "../../imports/713243524_18034908209655162_373007120578793695_n.jpg";
import ora3 from "../../imports/711135866_18034908218655162_7681117657726694991_n.jpg";
import ora4 from "../../imports/713284067_18034908227655162_955617004201351914_n.jpg";
import ora5 from "../../imports/712944793_18034908245655162_3338015648034003696_n.jpg";
import ora6 from "../../imports/712643824_18034908263655162_5013259035163406673_n.jpg";
import ora7 from "../../imports/710446681_18034908272655162_4366772113839053935_n.jpg";
import ora8 from "../../imports/712583382_18034908290655162_7708291289286206424_n.jpg";
import ora9 from "../../imports/713325046_18034908338655162_2433942909705124209_n.jpg";
import ora10 from "../../imports/713664442_18034908242655162_1293343158241921763_n.jpg";
import ora11 from "../../imports/712944793_18034908245655162_3338015648034003696_n.jpg";
import ora12 from "../../imports/713423729_18034908311655162_38824975317502322_n.jpg";
import ora13 from "../../imports/713704200_18034908287655162_1269800961842847173_n.jpg";
import ora14 from "../../imports/714164734_18034908206655162_4787693827782222697_n.jpg";
import ora15 from "../../imports/715254747_18034908260655162_3779552991916104781_n.jpg";
import ora16 from "../../imports/715749984_18034908302655162_7614266374833383258_n.jpg";
import oraVideo from "../../imports/AQPT1uZyop1zeOpfHq45JJLTBgGcTYHTI9s3LaNkddg-aOPo9KnQ31PulHfZM8sevSPmtf_DH3R7eK1XCuGYxfQXR0l_yBKMsEK09J4.mp4";

const WHATSAPP_URL = "https://wa.me/598092852725?text=Hola%2C%20quiero%20ver%20los%20autos%200%20km%20disponibles";

const newCars: CarDetail[] = [
  {
    id: 5,
    name: "GWM ORA 03 Skin",
    year: 2026,
    price: "",
    km: "0 km",
    fuel: "Eléctrico",
    transmission: "Automático",
    badge: "0 KM · ELÉCTRICO",
    images: [ora1, ora2, ora3, ora4, ora5, ora6, ora7, ora8, ora9, ora10, ora11, ora12, ora13, ora14, ora15, ora16],
    videos: [oraVideo],
    features: [
      "Motor eléctrico 80 kW — tracción delantera",
      "Batería de litio 47,78 kWh",
      "Autonomía 340 km",
      "Carga lenta 5 hs (15%→80%) · Carga rápida 40 min (20%→80%)",
      "Cargador tipo CCS2",
      "Transmisión automática · Dirección eléctrica",
      "Airbags conductor, pasajero, cortina y laterales",
      "ABS · Control de estabilidad · Frenado autónomo de emergencia",
      "Apertura sin llave Keyless · Cierre centralizado",
      "Cámara frontal, retroceso y 360° · Sensor de estacionamiento",
      "Pantalla multimedia · Android Auto · Apple CarPlay",
      "Bluetooth · USB · Control de audio al volante",
      "Tapizado de cuero · Llantas de aleación",
      "Sensor de lluvia · Faros LED · Volante multifunción",
      "Garantía vehículo: 5 años / 150.000 km",
      "Garantía batería: 8 años / 150.000 km",
    ],
    whatsappText: "Hola, me interesa el GWM ORA 03 Skin 2026 0km eléctrico. ¿Podría darme más información?",
  },
];

export function NewCars() {
  const [selectedCar, setSelectedCar] = useState<CarDetail | null>(null);

  return (
    <section id="nuevos" className="py-24 bg-white relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(22,52,212,0.06) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "0.78rem",
                letterSpacing: "0.2em",
                color: "#1634D4",
              }}
              className="uppercase mb-3"
            >
              DESDE EL CONCESIONARIO
            </p>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                color: "#0d0d14",
                lineHeight: 0.95,
                letterSpacing: "-0.01em",
              }}
            >
              AUTOS
              <br />
              <span style={{ color: "#1634D4" }}>0 KM</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                color: "#6b7280",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: "320px",
                textAlign: "right",
              }}
            >
              Los mejores modelos nuevos con garantía de fábrica y financiación disponible.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-[#0d20a0]"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#1634D4",
              }}
            >
              VER TODOS
              <ArrowRight size={15} />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gray-100" />
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              color: "#9ca3af",
            }}
          >
            DISPONIBLES AHORA
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {newCars.map((car) => (
            <CarCard key={car.id} car={car} onOpen={setSelectedCar} />
          ))}
        </div>
      </div>

      {selectedCar && (
        <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </section>
  );
}
