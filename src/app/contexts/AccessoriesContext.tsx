import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase, type AccessoryRow } from "../../lib/supabase";

export interface Accessory {
  id: string;
  name: string;
  description: string;
  priceNum: number;
  images: string[]; // gallery_urls, first is cover
  published: boolean;
}

function rowToAccessory(r: AccessoryRow): Accessory {
  const allImages = r.cover_image_url
    ? [r.cover_image_url, ...r.gallery_urls.filter((u) => u !== r.cover_image_url)]
    : r.gallery_urls;
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    priceNum: r.price_num,
    images: allImages,
    published: r.published,
  };
}

export interface CreateAccessoryData {
  name: string;
  description?: string;
  price_num: number;
  published?: boolean;
  cover_image_url?: string;
  gallery_urls?: string[];
}

interface AccessoriesContextType {
  accessories: Accessory[]; // published only
  allAccessories: Accessory[]; // admin, includes unpublished
  loading: boolean;
  error: string | null;
  reload: () => void;
  addAccessory: (data: CreateAccessoryData) => Promise<void>;
  updateAccessory: (id: string, data: Partial<CreateAccessoryData>) => Promise<void>;
  deleteAccessory: (id: string) => Promise<void>;
}

const AccessoriesContext = createContext<AccessoriesContextType>({
  accessories: [], allAccessories: [], loading: false, error: null,
  reload: () => {}, addAccessory: async () => {}, updateAccessory: async () => {}, deleteAccessory: async () => {},
});

export function useAccessories() {
  return useContext(AccessoriesContext);
}

export function AccessoriesProvider({ children }: { children: ReactNode }) {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [allAccessories, setAllAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("accessories")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      const all = (data as AccessoryRow[]).map(rowToAccessory);
      setAllAccessories(all);
      setAccessories(all.filter((a) => a.published));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar accesorios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addAccessory = async (data: CreateAccessoryData) => {
    const { error: err } = await supabase.from("accessories").insert([data]);
    if (err) throw err;
    await load();
  };

  const updateAccessory = async (id: string, data: Partial<CreateAccessoryData>) => {
    const { error: err } = await supabase.from("accessories").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
    if (err) throw err;
    await load();
  };

  const deleteAccessory = async (id: string) => {
    const { error: err } = await supabase.from("accessories").delete().eq("id", id);
    if (err) throw err;
    await load();
  };

  return (
    <AccessoriesContext.Provider value={{ accessories, allAccessories, loading, error, reload: load, addAccessory, updateAccessory, deleteAccessory }}>
      {children}
    </AccessoriesContext.Provider>
  );
}
