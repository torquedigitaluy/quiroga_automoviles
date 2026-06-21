import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

app.get("/make-server-f85fd53a/health", (c) => c.json({ status: "ok" }));

// Helper to get Supabase admin client
function getAdminClient() {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key);
}

// Setup DB: create vehicles table and storage bucket
app.post("/make-server-f85fd53a/setup", async (c) => {
  const supabase = getAdminClient();

  // Create vehicles table
  const { error: tableError } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS public.vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        version TEXT,
        year INTEGER NOT NULL,
        km TEXT NOT NULL DEFAULT '',
        price TEXT NOT NULL DEFAULT '',
        price_num NUMERIC NOT NULL DEFAULT 0,
        moneda TEXT NOT NULL DEFAULT 'USD',
        fuel TEXT NOT NULL DEFAULT 'Nafta',
        transmission TEXT NOT NULL DEFAULT 'Manual',
        category TEXT NOT NULL DEFAULT 'usado' CHECK (category IN ('nuevo', 'usado')),
        tipo TEXT NOT NULL DEFAULT 'Combustión',
        description TEXT,
        published BOOLEAN NOT NULL DEFAULT true,
        featured BOOLEAN NOT NULL DEFAULT false,
        cover_image_url TEXT,
        gallery_urls TEXT[] NOT NULL DEFAULT '{}',
        video_urls TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Public read published" ON public.vehicles
        FOR SELECT USING (published = true);
      CREATE POLICY IF NOT EXISTS "Anon full access" ON public.vehicles
        FOR ALL USING (true) WITH CHECK (true);
    `
  });

  // Create storage bucket
  const { error: bucketError } = await supabase.storage.createBucket("vehicle-media", {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ["image/*", "video/*"],
  });

  return c.json({
    table: tableError ? tableError.message : "ok",
    bucket: (bucketError && !bucketError.message.includes("already exists")) ? bucketError.message : "ok",
  });
});

Deno.serve(app.fetch);
