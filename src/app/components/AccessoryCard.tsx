import { ImageIcon } from "lucide-react";
import type { Accessory } from "../contexts/AccessoriesContext";

interface Props {
  accessory: Accessory;
  onOpen: (a: Accessory) => void;
}

export function AccessoryCard({ accessory, onOpen }: Props) {
  return (
    <div
      className="rounded-2xl overflow-hidden border flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
      style={{ backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
      onClick={() => onOpen(accessory)}
    >
      <div className="relative overflow-hidden bg-gray-100 flex items-center justify-center" style={{ aspectRatio: "1/1" }}>
        {accessory.images[0] ? (
          <img src={accessory.images[0]} alt={accessory.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <ImageIcon size={32} style={{ color: "#d1d5db" }} />
        )}
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "#0936B3", lineHeight: 1.2 }}>
          {accessory.name}
        </h3>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#0d0d14" }}>
          USD {accessory.priceNum.toLocaleString("es-UY")}
        </p>
      </div>
    </div>
  );
}
