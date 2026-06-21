import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "../../lib/supabase";

export interface HeroImage {
  desktop_url: string;
  mobile_url: string;
  alt: string;
}

export interface NovedadVideo {
  url: string;
}

interface SiteContentContextType {
  hero: HeroImage[];
  novedades: NovedadVideo[];
  loading: boolean;
  reload: () => Promise<void>;
  saveHero: (images: HeroImage[]) => Promise<void>;
  saveNovedades: (videos: NovedadVideo[]) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType>({
  hero: [], novedades: [], loading: false,
  reload: async () => {}, saveHero: async () => {}, saveNovedades: async () => {},
});

export function useSiteContent() { return useContext(SiteContentContext); }

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [hero, setHero] = useState<HeroImage[]>([]);
  const [novedades, setNovedades] = useState<NovedadVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("key, data")
        .in("key", ["hero", "novedades"]);
      if (error) throw error;
      for (const row of data ?? []) {
        if (row.key === "hero") setHero(Array.isArray(row.data?.images) ? row.data.images : []);
        if (row.key === "novedades") setNovedades(Array.isArray(row.data?.videos) ? row.data.videos : []);
      }
    } catch {
      // leave defaults; public site falls back to hardcoded content
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveHero = async (images: HeroImage[]) => {
    setHero(images);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "hero", data: { images }, updated_at: new Date().toISOString() });
    if (error) throw error;
  };

  const saveNovedades = async (videos: NovedadVideo[]) => {
    setNovedades(videos);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "novedades", data: { videos }, updated_at: new Date().toISOString() });
    if (error) throw error;
  };

  return (
    <SiteContentContext.Provider value={{ hero, novedades, loading, reload: load, saveHero, saveNovedades }}>
      {children}
    </SiteContentContext.Provider>
  );
}
