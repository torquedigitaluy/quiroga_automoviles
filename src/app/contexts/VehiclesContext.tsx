import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase, type VehicleRow } from "../../lib/supabase";

export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  version: string;
  name: string; // computed: marca + modelo + version
  year: number;
  km: string;
  price: string;
  priceNum: number;
  moneda: string;
  fuel: string;
  transmission: string;
  type: "nuevo" | "usado";
  tipo: string;
  description: string;
  published: boolean;
  featured: boolean;
  badge?: string;
  images: string[]; // gallery_urls, first is cover
  videos: string[];
  features: string[];
  whatsappText: string;
  source: "supabase";
}

function rowToVehicle(r: VehicleRow): Vehicle {
  const name = [r.marca, r.modelo, r.version].filter(Boolean).join(" ");
  const allImages = r.cover_image_url
    ? [r.cover_image_url, ...r.gallery_urls.filter((u) => u !== r.cover_image_url)]
    : r.gallery_urls;
  const features: string[] = [];
  if (r.fuel) features.push(`Motor ${r.fuel}`);
  if (r.transmission) features.push(`Caja ${r.transmission}`);
  if (r.category === "nuevo") features.push("0 km");
  return {
    id: r.id,
    marca: r.marca,
    modelo: r.modelo,
    version: r.version ?? "",
    name,
    year: r.year,
    km: r.km,
    price: r.price,
    priceNum: r.price_num,
    moneda: r.moneda,
    fuel: r.fuel,
    transmission: r.transmission,
    type: r.category,
    tipo: r.tipo,
    description: r.description ?? "",
    published: r.published,
    featured: r.featured,
    images: allImages,
    videos: r.video_urls,
    features,
    whatsappText: `Hola, vi el ${name} ${r.year} en su página web. ¿Está disponible?`,
    source: "supabase",
  };
}

interface VehiclesContextType {
  vehicles: Vehicle[];
  allVehicles: Vehicle[]; // includes unpublished (admin only)
  loading: boolean;
  error: string | null;
  reload: () => void;
  addVehicle: (data: CreateVehicleData) => Promise<void>;
  updateVehicle: (id: string, data: Partial<CreateVehicleData & { published: boolean; featured: boolean }>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  uploadMedia: (file: File, vehicleId: string) => Promise<string>;
  deleteMedia: (url: string) => Promise<void>;
  tipoCambio: number;
  setTipoCambio: (v: number) => void;
}

export interface CreateVehicleData {
  marca: string;
  modelo: string;
  version?: string;
  year: number;
  km: string;
  price: string;
  price_num: number;
  moneda: string;
  fuel: string;
  transmission: string;
  category: "nuevo" | "usado";
  tipo: string;
  description?: string;
  published?: boolean;
  featured?: boolean;
  cover_image_url?: string;
  gallery_urls?: string[];
  video_urls?: string[];
}

const VehiclesContext = createContext<VehiclesContextType>({
  vehicles: [], allVehicles: [], loading: false, error: null,
  reload: () => {}, addVehicle: async () => {}, updateVehicle: async () => {},
  deleteVehicle: async () => {}, uploadMedia: async () => "", deleteMedia: async () => {},
  tipoCambio: 43, setTipoCambio: () => {},
});

export function useVehicles() { return useContext(VehiclesContext); }

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoCambio, setTipoCambioState] = useState<number>(() => {
    const s = localStorage.getItem("quiroga_tc"); return s ? parseFloat(s) : 43;
  });

  useEffect(() => { localStorage.setItem("quiroga_tc", String(tipoCambio)); }, [tipoCambio]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      const all = (data as VehicleRow[]).map(rowToVehicle);
      setAllVehicles(all);
      setVehicles(all.filter((v) => v.published));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar vehículos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addVehicle = async (data: CreateVehicleData) => {
    const { error: err } = await supabase.from("vehicles").insert([data]);
    if (err) throw err;
    await load();
  };

  const updateVehicle = async (id: string, data: Parameters<VehiclesContextType["updateVehicle"]>[1]) => {
    const { error: err } = await supabase.from("vehicles").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
    if (err) throw err;
    await load();
  };

  const deleteVehicle = async (id: string) => {
    const { error: err } = await supabase.from("vehicles").delete().eq("id", id);
    if (err) throw err;
    await load();
  };

  const uploadMedia = async (file: File, vehicleId: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${vehicleId}/${Date.now()}.${ext}`;
    const { error: err } = await supabase.storage.from("vehicle-media").upload(path, file, { upsert: true });
    if (err) throw err;
    const { data } = supabase.storage.from("vehicle-media").getPublicUrl(path);
    return data.publicUrl;
  };

  // Remove a previously uploaded file from storage given its public URL.
  const deleteMedia = async (url: string) => {
    const marker = "/vehicle-media/";
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = url.slice(idx + marker.length);
    await supabase.storage.from("vehicle-media").remove([path]);
  };

  return (
    <VehiclesContext.Provider value={{
      vehicles, allVehicles, loading, error, reload: load,
      addVehicle, updateVehicle, deleteVehicle, uploadMedia, deleteMedia,
      tipoCambio, setTipoCambio: setTipoCambioState,
    }}>
      {children}
    </VehiclesContext.Provider>
  );
}
