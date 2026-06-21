import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export type VehicleRow = {
  id: string;
  marca: string;
  modelo: string;
  version: string | null;
  year: number;
  km: string;
  price: string;
  price_num: number;
  moneda: string;
  fuel: string;
  transmission: string;
  category: "nuevo" | "usado";
  tipo: string;
  description: string | null;
  published: boolean;
  featured: boolean;
  cover_image_url: string | null;
  gallery_urls: string[];
  video_urls: string[];
  created_at: string;
};
