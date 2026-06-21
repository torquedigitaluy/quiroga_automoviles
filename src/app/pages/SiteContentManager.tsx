import { useState, useEffect } from "react";
import { Plus, Trash2, Upload, ArrowUp, ArrowDown, ImageIcon, Video } from "lucide-react";
import { useVehicles } from "../contexts/VehiclesContext";
import { useSiteContent, type HeroImage, type NovedadVideo } from "../contexts/SiteContentContext";

const lbl: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.7rem",
  letterSpacing: "0.1em", color: "#6b7280", display: "block", marginBottom: "4px",
};
const inp: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", color: "#0d0d14",
  backgroundColor: "#f4f6fb", border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "8px", padding: "8px 12px", width: "100%", outline: "none",
};
const sectionTitle: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#0d0d14",
};
const tile = "border-2 border-dashed rounded-xl p-3 text-center cursor-pointer hover:border-[#0936B3] hover:bg-blue-50/30 transition-colors";

export function SiteContentManager() {
  const { uploadMedia, deleteMedia } = useVehicles();
  const { hero, novedades, saveHero, saveNovedades } = useSiteContent();
  const [heroDraft, setHeroDraft] = useState<HeroImage[]>(hero);
  const [novDraft, setNovDraft] = useState<NovedadVideo[]>(novedades);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => setHeroDraft(hero), [hero]);
  useEffect(() => setNovDraft(novedades), [novedades]);

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  // ---- Hero ----
  const persistHero = async (next: HeroImage[]) => {
    setHeroDraft(next);
    try { await saveHero(next); notify("Portada guardada."); } catch { notify("Error al guardar la portada."); }
  };
  const addSlide = () => persistHero([...heroDraft, { desktop_url: "", mobile_url: "", alt: "" }]);
  const removeSlide = async (i: number) => {
    const s = heroDraft[i];
    setBusy(true);
    try { if (s.desktop_url) await deleteMedia(s.desktop_url); if (s.mobile_url) await deleteMedia(s.mobile_url); } catch { /* ignore */ }
    setBusy(false);
    await persistHero(heroDraft.filter((_, j) => j !== i));
  };
  const moveSlide = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= heroDraft.length) return;
    const next = [...heroDraft];
    [next[i], next[j]] = [next[j], next[i]];
    persistHero(next);
  };
  const uploadHero = async (i: number, kind: "desktop" | "mobile", file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const field = kind === "desktop" ? "desktop_url" : "mobile_url";
      const old = heroDraft[i][field];
      const url = await uploadMedia(file, "site-hero");
      if (old) { try { await deleteMedia(old); } catch { /* ignore */ } }
      await persistHero(heroDraft.map((s, j) => (j === i ? { ...s, [field]: url } : s)));
    } catch { notify("Error al subir la imagen."); }
    setBusy(false);
  };

  // ---- Novedades (max 3 videos) ----
  const persistNov = async (next: NovedadVideo[]) => {
    setNovDraft(next);
    try { await saveNovedades(next); notify("Novedades guardadas."); } catch { notify("Error al guardar las novedades."); }
  };
  const addVideo = async (file?: File | null) => {
    if (!file || novDraft.length >= 3) return;
    setBusy(true);
    try {
      const url = await uploadMedia(file, "site-novedades");
      await persistNov([...novDraft, { url }]);
    } catch { notify("Error al subir el video."); }
    setBusy(false);
  };
  const replaceVideo = async (i: number, file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const old = novDraft[i]?.url;
      const url = await uploadMedia(file, "site-novedades");
      if (old) { try { await deleteMedia(old); } catch { /* ignore */ } }
      await persistNov(novDraft.map((v, j) => (j === i ? { url } : v)));
    } catch { notify("Error al subir el video."); }
    setBusy(false);
  };
  const removeVideo = async (i: number) => {
    const old = novDraft[i]?.url;
    setBusy(true);
    try { if (old) await deleteMedia(old); } catch { /* ignore */ }
    setBusy(false);
    await persistNov(novDraft.filter((_, j) => j !== i));
  };

  return (
    <div className="mb-6 rounded-2xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-5 py-4">
        <span style={sectionTitle}>CONTENIDO DEL SITIO — Portada y Novedades</span>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "#0936B3", fontWeight: 700 }}>
          {open ? "Ocultar" : "Editar"}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-6">
          {msg && (
            <div className="mb-4 p-2.5 rounded-lg text-center" style={{ backgroundColor: "rgba(9,54,179,0.08)", color: "#0936B3", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.8rem" }}>
              {msg}{busy ? " …" : ""}
            </div>
          )}

          {/* ---- Hero ---- */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 style={sectionTitle}>Portada (Hero)</h3>
              <button onClick={addSlide} disabled={busy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg disabled:opacity-50"
                style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.75rem" }}>
                <Plus size={14} /> Agregar imagen
              </button>
            </div>
            {heroDraft.length === 0 ? (
              <p style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af", fontSize: "0.82rem" }}>
                Sin imágenes. Se muestran las imágenes por defecto en la web.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {heroDraft.map((s, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#f9fafb", border: "1px solid rgba(0,0,0,0.06)" }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: "#0936B3", width: 20 }}>{i + 1}</span>
                    {/* Desktop image */}
                    <div className="w-28">
                      <label style={lbl}>ESCRITORIO</label>
                      {s.desktop_url
                        ? <img src={s.desktop_url} alt="" className="w-28 h-16 object-cover rounded-lg border" style={{ borderColor: "rgba(0,0,0,0.1)" }} />
                        : <div className="w-28 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#eef0f8", color: "#9ca3af" }}><ImageIcon size={18} /></div>}
                      <label className={tile + " mt-1 block"} style={{ borderColor: "rgba(0,0,0,0.12)" }}>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.65rem", color: "#6b7280" }}>{s.desktop_url ? "Cambiar" : "Subir"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadHero(i, "desktop", e.target.files?.[0])} />
                      </label>
                    </div>
                    {/* Mobile image */}
                    <div className="w-24">
                      <label style={lbl}>CELULAR</label>
                      {s.mobile_url
                        ? <img src={s.mobile_url} alt="" className="w-24 h-16 object-cover rounded-lg border" style={{ borderColor: "rgba(0,0,0,0.1)" }} />
                        : <div className="w-24 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#eef0f8", color: "#9ca3af" }}><ImageIcon size={16} /></div>}
                      <label className={tile + " mt-1 block"} style={{ borderColor: "rgba(0,0,0,0.12)" }}>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.65rem", color: "#6b7280" }}>{s.mobile_url ? "Cambiar" : "Subir"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadHero(i, "mobile", e.target.files?.[0])} />
                      </label>
                    </div>
                    {/* Alt */}
                    <div className="flex-1 min-w-[140px]">
                      <label style={lbl}>DESCRIPCIÓN (ALT)</label>
                      <input value={s.alt} onChange={(e) => setHeroDraft(heroDraft.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
                        onBlur={() => persistHero(heroDraft)} style={inp} placeholder="Texto alternativo" />
                    </div>
                    {/* Controls */}
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveSlide(i, -1)} disabled={busy || i === 0} className="p-1.5 rounded-lg disabled:opacity-30" style={{ color: "#6b7280" }}><ArrowUp size={15} /></button>
                      <button onClick={() => moveSlide(i, 1)} disabled={busy || i === heroDraft.length - 1} className="p-1.5 rounded-lg disabled:opacity-30" style={{ color: "#6b7280" }}><ArrowDown size={15} /></button>
                      <button onClick={() => removeSlide(i)} disabled={busy} className="p-1.5 rounded-lg disabled:opacity-50" style={{ color: "#dc2626" }}><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---- Novedades ---- */}
          <div>
            <h3 style={sectionTitle} className="mb-1">Novedades y Lanzamientos (videos verticales 9:16)</h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af", fontSize: "0.78rem", marginBottom: "10px" }}>
              Hasta 3 videos. Se reproducen en bucle y sin sonido. Al reemplazar un video, el anterior se elimina del almacenamiento.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {novDraft.map((v, i) => (
                <div key={i} className="rounded-xl p-2" style={{ backgroundColor: "#f9fafb", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <video src={v.url} muted loop playsInline autoPlay className="w-full rounded-lg" style={{ aspectRatio: "9/16", objectFit: "cover", backgroundColor: "#000" }} />
                  <div className="flex gap-2 mt-2">
                    <label className="flex-1 text-center py-1.5 rounded-lg cursor-pointer" style={{ backgroundColor: "rgba(9,54,179,0.08)", color: "#0936B3", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.7rem" }}>
                      Reemplazar
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => replaceVideo(i, e.target.files?.[0])} />
                    </label>
                    <button onClick={() => removeVideo(i)} disabled={busy} className="px-2.5 py-1.5 rounded-lg disabled:opacity-50" style={{ color: "#dc2626" }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {novDraft.length < 3 && (
                <label className={tile + " flex flex-col items-center justify-center gap-2"} style={{ borderColor: "rgba(0,0,0,0.12)", aspectRatio: "9/16", backgroundColor: "#f9fafb" }}>
                  <Video size={22} style={{ color: "#9ca3af" }} />
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", color: "#6b7280" }}>Subir video</span>
                  <Upload size={14} style={{ color: "#9ca3af" }} />
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => addVideo(e.target.files?.[0])} />
                </label>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
