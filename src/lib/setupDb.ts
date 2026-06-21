import { supabase } from "./supabase";

// Run once on first load — creates table if it doesn't exist
export async function ensureVehiclesTable() {
  // Test if table exists by querying it
  const { error } = await supabase.from("vehicles").select("id").limit(1);
  if (!error) return; // table exists

  // Create table via SQL (requires RLS disabled or service role — use anon workaround)
  await supabase.rpc("create_vehicles_table").catch(() => null);
}
