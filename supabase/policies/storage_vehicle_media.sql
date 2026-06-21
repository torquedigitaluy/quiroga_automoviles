-- Storage RLS policies for the public 'vehicle-media' bucket.
-- storage.objects already has RLS enabled by Supabase; we only add policies.
-- Permissive anon access, consistent with the vehicles table "Anon full access"
-- policy and the app's current lack of real admin auth. Tighten when auth is added.
--
-- Idempotent: CREATE POLICY has no IF NOT EXISTS, so we DROP-then-CREATE.

-- INSERT (uploads)
DROP POLICY IF EXISTS "vehicle-media anon insert" ON storage.objects;
CREATE POLICY "vehicle-media anon insert"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'vehicle-media');

-- UPDATE (required because uploadMedia uses upsert:true)
DROP POLICY IF EXISTS "vehicle-media anon update" ON storage.objects;
CREATE POLICY "vehicle-media anon update"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'vehicle-media')
  WITH CHECK (bucket_id = 'vehicle-media');

-- DELETE (future media removal)
DROP POLICY IF EXISTS "vehicle-media anon delete" ON storage.objects;
CREATE POLICY "vehicle-media anon delete"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'vehicle-media');

-- SELECT (redundant: bucket is public:true, so getPublicUrl works without it;
-- included for explicit API listing / completeness).
DROP POLICY IF EXISTS "vehicle-media anon select" ON storage.objects;
CREATE POLICY "vehicle-media anon select"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'vehicle-media');
