import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CarCard, type CarDetail } from "./CarCard";
import { CarDetailModal } from "./CarDetailModal";

import golf1 from "../../imports/723857283_18036355649655162_7895983054089837386_n.jfif";
import golf2 from "../../imports/722286343_18036355622655162_378027394536693797_n.jfif";
import golf3 from "../../imports/723208280_18036355640655162_2146765245075833534_n.jfif";
import golf4 from "../../imports/723208364_18036355577655162_8691245806650712466_n.jfif";
import golf5 from "../../imports/723238558_18036355658655162_2420119411153844298_n.jfif";
import golf6 from "../../imports/723238827_18036355595655162_7628471519208865585_n.jfif";
import golf7 from "../../imports/723238854_18036355610655162_4138200413227659057_n.jfif";
import golf8 from "../../imports/723238921_18036355667655162_8023911258566243612_n.jfif";
import golf9 from "../../imports/723238936_18036355631655162_6954597094465878540_n.jfif";
import golf10 from "../../imports/723238986_18036355568655162_5623065280594119472_n.jfif";
import golf11 from "../../imports/724068200_18036355586655162_1517308948776213470_n.jfif";
import golf12 from "../../imports/724072959_18036355613655162_5486691330551650337_n.jfif";
import golfVideo from "../../imports/AQMJEXDd_KlscDN836I9pNWuYHaK-54S59-6dJVSBboKpbcQcVMhfhI5NpKjCo34HaQ9ITD2bq8M4cFPCPzTHZDj9jwDLB3hvRart-E.mp4";

const WHATSAPP_URL = "https://wa.me/598092852725?text=Hola%2C%20quiero%20ver%20los%20autos%20usados%20disponibles";

const usedCars: CarDetail[] = [
  {
    id: 10,
    name: "Volkswagen Golf 1.6 Full",
    year: 2004,
    price: "",
    km: "",
    fuel: "Nafta",
    transmission: "Manual",
    images: [golf10, golf4, golf11, golf6, golf7, golf12, golf2, golf9, golf3, golf1, golf5, golf8],
    videos: [golfVideo],
    features: [
      "Motor 1.6 nafta",
      "Caja manual",
      "4 puertas",
      "Interior en cuero negro",
      "Aire acondicionado",
      "Dirección hidráulica",
      "Levanta vidrios eléctricos",
      "Espejos eléctricos",
      "Llantas deportivas negras",
      "Documentación al día",
    ],
    whatsappText: "Hola, me interesa el Volkswagen Golf 1.6 Full 2004. ¿Podría darme más información?",
  },
];

export function UsedCars() {
  const [selectedCar, setSelectedCar] = useState<CarDetail | null>(null);

  return (
    <section id="usados" className="py-24 relative overflow-hidden" style={{ backgroundColor: "#f4f6fb" }}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
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
              SELECCIONADOS Y REVISADOS
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
              USADOS
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
              Vehículos inspeccionados y listos para transferir. Todos con historial verificado.
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

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gray-200" />
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              color: "#9ca3af",
            }}
          >
            STOCK ACTUALIZADO
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {usedCars.map((car) => (
            <CarCard key={car.id} car={car} onOpen={setSelectedCar} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCar && (
        <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </section>
  );
}
