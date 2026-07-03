import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Plus, Trash2, LogOut, Car, Upload, X, ImageIcon, Video, Eye, EyeOff, Star, Edit3, Check, Users, KeyRound, Moon, Sun } from "lucide-react";
import { useVehicles, type CreateVehicleData } from "../contexts/VehiclesContext";
import { SiteContentManager } from "./SiteContentManager";
import { AccessoriesManager } from "./AccessoriesManager";
import { CalculadoraFinanciacion } from "../components/CalculadoraFinanciacion";
import { transcodeToH264 } from "../../lib/videoTranscode";
import { supabase } from "../../lib/supabase";
import logoImg from "../../imports/LOGO_QUIROGA_AUTOMOVILES.png";

const ADMIN_USER = "quiroga";
const ADMIN_PASS_FALLBACK = "quiroga2025";

interface BasicUser { username: string; }

async function hashPassword(plain: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(plain));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function dbLogin(username: string, password: string): Promise<"superadmin" | "basic" | null> {
  const hashed = await hashPassword(password);
  const { data } = await supabase
    .from("admin_users")
    .select("role")
    .eq("username", username)
    .eq("password", hashed)
    .maybeSingle();
  return (data?.role as "superadmin" | "basic") ?? null;
}

async function dbFetchBasicUsers(): Promise<BasicUser[]> {
  const { data } = await supabase
    .from("admin_users")
    .select("username")
    .eq("role", "basic")
    .order("created_at");
  return (data ?? []) as BasicUser[];
}

async function dbCreateUser(username: string, password: string): Promise<string | null> {
  const hashed = await hashPassword(password);
  const { error } = await supabase
    .from("admin_users")
    .insert({ username, password: hashed, role: "basic" });
  return error?.message ?? null;
}

async function dbDeleteUser(username: string): Promise<void> {
  await supabase.from("admin_users").delete().eq("username", username).eq("role", "basic");
}

async function dbChangePassword(username: string, currentPass: string, newPass: string): Promise<string | null> {
  const hashedCurrent = await hashPassword(currentPass);
  const { data } = await supabase
    .from("admin_users")
    .select("id")
    .eq("username", username)
    .eq("password", hashedCurrent)
    .maybeSingle();
  if (!data) return "Contraseña actual incorrecta.";
  const hashedNew = await hashPassword(newPass);
  const { error } = await supabase.from("admin_users").update({ password: hashedNew }).eq("username", username);
  return error?.message ?? null;
}

const EMPTY: CreateVehicleData = {
  marca: "", modelo: "", version: "", year: new Date().getFullYear(),
  km: "", price: "", price_num: 0, moneda: "USD",
  fuel: "Nafta", transmission: "Manual", category: "usado", tipo: "Combustión",
  description: "", published: true, featured: false,
  cover_image_url: "", gallery_urls: [], video_urls: [],
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

const inp: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", color: "#0d0d14",
  backgroundColor: "#f4f6fb", border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "8px", padding: "8px 12px", width: "100%", outline: "none",
};
const lbl: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.7rem",
  letterSpacing: "0.1em", color: "#6b7280", display: "block", marginBottom: "4px",
};

export function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const role = await dbLogin(user, pass);
      if (role) {
        sessionStorage.setItem("quiroga_admin", "1");
        sessionStorage.setItem("quiroga_admin_role", role);
        navigate("/admin");
        return;
      }
      // Fallback en caso de que la tabla admin_users aún no exista
      if (user === ADMIN_USER && pass === ADMIN_PASS_FALLBACK) {
        sessionStorage.setItem("quiroga_admin", "1");
        sessionStorage.setItem("quiroga_admin_role", "superadmin");
        navigate("/admin");
        return;
      }
      setErr("Usuario o contraseña incorrectos");
    } catch {
      if (user === ADMIN_USER && pass === ADMIN_PASS_FALLBACK) {
        sessionStorage.setItem("quiroga_admin", "1");
        sessionStorage.setItem("quiroga_admin_role", "superadmin");
        navigate("/admin");
      } else {
        setErr("Error de conexión. Verificá tu internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-2xl shadow-xl p-8 bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="flex flex-col items-center mb-8">
          <img src={logoImg} alt="Quiroga" className="h-12 mb-4 object-contain" />
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#0d0d14" }}>Panel Admin</h1>
        </div>
        <form onSubmit={login} className="flex flex-col gap-4">
          <div><label style={lbl}>USUARIO</label><input value={user} onChange={(e) => setUser(e.target.value)} required style={inp} placeholder="Usuario" /></div>
          <div><label style={lbl}>CONTRASEÑA</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required style={inp} placeholder="Contraseña" /></div>
          {err && <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#dc2626" }}>{err}</p>}
          <button type="submit" disabled={loading} className="py-3 rounded-xl transition-all hover:brightness-110 mt-1 disabled:opacity-60"
            style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
            {loading ? "VERIFICANDO..." : "INGRESAR"}
          </button>
        </form>
      </div>
    </div>
  );
}

interface ImageItem { id: string; url: string; file?: File }

export function AdminPanel() {
  const navigate = useNavigate();
  const { allVehicles, loading, error, reload, addVehicle, updateVehicle, deleteVehicle, uploadMedia, tipoCambio, setTipoCambio } = useVehicles();
  const [form, setForm] = useState<CreateVehicleData>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [tcDraft, setTcDraft] = useState<number>(tipoCambio);
  const [tcSaving, setTcSaving] = useState(false);
  const [convertingVideo, setConvertingVideo] = useState(false);
  const isSuperAdmin = sessionStorage.getItem("quiroga_admin_role") === "superadmin";
  const [adminUsers, setAdminUsers] = useState<BasicUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [userMsg, setUserMsg] = useState("");
  const [changePwForm, setChangePwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [isDark, setIsDark] = useState(() => localStorage.getItem("quiroga_admin_dark") === "1");
  const toggleDark = () => setIsDark((d) => { const n = !d; localStorage.setItem("quiroga_admin_dark", n ? "1" : "0"); return n; });

  useEffect(() => {
    if (!isSuperAdmin) return;
    setUsersLoading(true);
    dbFetchBasicUsers().then(setAdminUsers).finally(() => setUsersLoading(false));
  }, [isSuperAdmin]);
  const [convertPct, setConvertPct] = useState<number | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("quiroga_admin")) navigate("/admin/login");
  }, [navigate]);

  useEffect(() => { setTcDraft(tipoCambio); }, [tipoCambio]);

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };

  const handleUpdateTipoCambio = async () => {
    setTcSaving(true);
    try {
      await setTipoCambio(tcDraft);
      notify("Tipo de cambio actualizado.");
    } catch {
      notify("Error al actualizar el tipo de cambio.");
    } finally {
      setTcSaving(false);
    }
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const previews = await Promise.all(arr.map(fileToBase64));
    const items: ImageItem[] = arr.map((file, i) => ({ id: crypto.randomUUID(), url: previews[i], file }));
    setImages((p) => [...p, ...items]);
  };

  const handleVideoFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("video/"));
    if (arr.length === 0) return;
    setConvertingVideo(true);
    try {
      for (const f of arr) {
        const optimized = await transcodeToH264(f, setConvertPct);
        setUploadedVideos((p) => [...p, optimized]);
      }
    } finally {
      setConvertPct(null);
      setConvertingVideo(false);
    }
  };

  const removeImg = (id: string) => {
    setImages((p) => p.filter((img) => img.id !== id));
  };

  const handleImgDragStart = (i: number) => { dragIndexRef.current = i; };
  const handleImgDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleImgDrop = (i: number) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from === null || from === i) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return next;
    });
  };

  const resetForm = () => {
    setForm(EMPTY); setEditId(null); setShowForm(false);
    setImages([]); setUploadedVideos([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0 && !editId) { notify("Agregá al menos una foto."); return; }
    setSaving(true);
    try {
      const vehicleId = editId ?? crypto.randomUUID();
      // Upload new images (in display order) and keep existing URLs in place
      const orderedImageUrls = await Promise.all(
        images.map((img) => (img.file ? uploadMedia(img.file, vehicleId) : Promise.resolve(img.url)))
      );
      // Upload videos
      const newVideoUrls = await Promise.all(uploadedVideos.map((f) => uploadMedia(f, vehicleId)));

      const payload: CreateVehicleData = {
        ...form,
        price_num: parseFloat(form.price.replace(/[^0-9.]/g, "")) || 0,
        cover_image_url: orderedImageUrls[0] ?? "",
        gallery_urls: orderedImageUrls,
        video_urls: newVideoUrls.length > 0 ? [...(form.video_urls ?? []), ...newVideoUrls] : (form.video_urls ?? []),
      };

      if (editId) {
        await updateVehicle(editId, payload);
        notify("Vehículo actualizado.");
      } else {
        await addVehicle(payload);
        notify("Vehículo agregado.");
      }
      resetForm();
    } catch (err) {
      notify(`Error: ${err instanceof Error ? err.message : "Intentá nuevamente"}`);
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (v: (typeof allVehicles)[0]) => {
    await updateVehicle(v.id, { published: !v.published } as Parameters<typeof updateVehicle>[1]);
  };

  const toggleFeatured = async (v: (typeof allVehicles)[0]) => {
    await updateVehicle(v.id, { featured: !v.featured } as Parameters<typeof updateVehicle>[1]);
  };

  const openEdit = (v: (typeof allVehicles)[0]) => {
    setForm({
      marca: v.marca, modelo: v.modelo, version: v.version,
      year: v.year, km: v.km, price: v.price, price_num: v.priceNum,
      moneda: v.moneda, fuel: v.fuel, transmission: v.transmission,
      category: v.type, tipo: v.tipo, description: v.description,
      published: v.published, featured: v.featured,
      cover_image_url: v.images[0] ?? "",
      gallery_urls: v.images, video_urls: v.videos,
    });
    setImages(v.images.map((url) => ({ id: url, url })));
    setEditId(v.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const vehicleForm = (
    <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl shadow-sm bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
      <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#0d0d14", marginBottom: "20px" }}>
        {editId ? "Editar Vehículo" : "Nuevo Vehículo"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div><label style={lbl}>MARCA *</label><input required value={form.marca} onChange={(e) => setForm((p) => ({ ...p, marca: e.target.value }))} style={inp} placeholder="Toyota" /></div>
        <div><label style={lbl}>MODELO *</label><input required value={form.modelo} onChange={(e) => setForm((p) => ({ ...p, modelo: e.target.value }))} style={inp} placeholder="Hilux" /></div>
        <div><label style={lbl}>VERSIÓN</label><input value={form.version ?? ""} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))} style={inp} placeholder="SR 4x4" /></div>
        <div><label style={lbl}>AÑO *</label><input required type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: +e.target.value }))} style={inp} /></div>
        <div><label style={lbl}>KILÓMETROS</label><input value={form.km} onChange={(e) => setForm((p) => ({ ...p, km: e.target.value }))} style={inp} placeholder="85.000 km" /></div>
        <div className="flex gap-2">
          <div className="flex-1"><label style={lbl}>PRECIO</label><input value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} style={inp} placeholder="15.000" /></div>
          <div className="w-24"><label style={lbl}>MONEDA</label>
            <select value={form.moneda} onChange={(e) => setForm((p) => ({ ...p, moneda: e.target.value }))} style={inp}>
              <option>USD</option><option>UYU</option>
            </select>
          </div>
        </div>
        <div><label style={lbl}>COMBUSTIBLE *</label>
          <select required value={form.fuel} onChange={(e) => setForm((p) => ({ ...p, fuel: e.target.value }))} style={inp}>
            {["Nafta", "Diesel", "Eléctrico", "Híbrido"].map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div><label style={lbl}>TRANSMISIÓN *</label>
          <select required value={form.transmission} onChange={(e) => setForm((p) => ({ ...p, transmission: e.target.value }))} style={inp}>
            <option>Manual</option><option>Automático</option>
          </select>
        </div>
        <div><label style={lbl}>CATEGORÍA *</label>
          <select required value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as "nuevo" | "usado" }))} style={inp}>
            <option value="nuevo">0 KM</option><option value="usado">Usado</option>
          </select>
        </div>
        <div><label style={lbl}>TIPO</label>
          <select value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))} style={inp}>
            {["Combustión", "Eléctrico", "Híbrido"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer" onClick={() => setForm((p) => ({ ...p, published: !p.published }))}>
            <div className="w-10 h-5 rounded-full transition-colors flex items-center px-0.5"
              style={{ backgroundColor: form.published ? "#0936B3" : "#d1d5db" }}>
              <span className="w-4 h-4 bg-white rounded-full shadow transition-transform"
                style={{ transform: form.published ? "translateX(20px)" : "translateX(0)" }} />
            </div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: "#374151" }}>Publicado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer" onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}>
            <div className="w-10 h-5 rounded-full transition-colors flex items-center px-0.5"
              style={{ backgroundColor: form.featured ? "#f59e0b" : "#d1d5db" }}>
              <span className="w-4 h-4 bg-white rounded-full shadow transition-transform"
                style={{ transform: form.featured ? "translateX(20px)" : "translateX(0)" }} />
            </div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: "#374151" }}>Destacado</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label style={lbl}>DESCRIPCIÓN</label>
        <textarea value={form.description ?? ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={3} style={{ ...inp, resize: "vertical" }} placeholder="Descripción del vehículo..." />
      </div>

      {/* Image upload + gallery (drag thumbnails to reorder) */}
      <div className="mb-4">
        <label style={{ ...lbl, marginBottom: "8px" }}>
          {editId ? "FOTOS" : "FOTOS *"}
          <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: "6px" }}>
            (desde tu computadora o celular — arrastrá una foto sobre otra para cambiar el orden)
          </span>
        </label>
        <div className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer hover:border-[#0936B3] hover:bg-blue-50/30 transition-colors"
          style={{ borderColor: "rgba(0,0,0,0.12)", backgroundColor: "#f9fafb" }}
          onClick={() => imgRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleImageFiles(e.dataTransfer.files); }}>
          <ImageIcon size={24} style={{ color: "#9ca3af", margin: "0 auto 6px" }} />
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#374151" }}>
            Hacé clic o arrastrá las fotos aquí
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", color: "#9ca3af", marginTop: "3px" }}>
            JPG, PNG, WEBP — podés subir varias a la vez
          </p>
        </div>
        <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageFiles(e.target.files)} />
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {images.map((img, i) => (
              <div key={img.id} className="relative group cursor-move"
                draggable
                onDragStart={() => handleImgDragStart(i)}
                onDragOver={handleImgDragOver}
                onDrop={() => handleImgDrop(i)}>
                <img src={img.url} alt="" className="w-20 h-20 rounded-xl object-cover border" style={{ borderColor: "rgba(0,0,0,0.1)" }} />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-white text-[0.55rem]"
                    style={{ backgroundColor: "#0936B3", fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                    PORTADA
                  </span>
                )}
                <button type="button" onClick={() => removeImg(img.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white items-center justify-center hidden group-hover:flex">
                  <X size={10} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => imgRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 hover:border-[#0936B3] transition-colors"
              style={{ borderColor: "rgba(0,0,0,0.12)", color: "#9ca3af" }}>
              <Plus size={18} /><span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.6rem" }}>Más</span>
            </button>
          </div>
        )}
      </div>

      {/* Video upload */}
      <div className="mb-6">
        <label style={{ ...lbl, marginBottom: "8px" }}>VIDEO (opcional)</label>
        <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-[#0936B3] hover:bg-blue-50/30 transition-colors"
          style={{ borderColor: "rgba(0,0,0,0.12)", backgroundColor: "#f9fafb" }}
          onClick={() => vidRef.current?.click()}>
          <Video size={20} style={{ color: "#9ca3af", margin: "0 auto 4px" }} />
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#374151" }}>Subir video</p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.7rem", color: "#9ca3af" }}>MP4, MOV — máx 50 MB</p>
        </div>
        <input ref={vidRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoFiles(e.target.files)} />
        {convertingVideo && (
          <div className="mt-3 p-2.5 rounded-lg text-center" style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#b45309", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.78rem" }}>
            Optimizando video para que se vea bien en todos los celulares… {convertPct ?? 0}%
          </div>
        )}
        {uploadedVideos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {uploadedVideos.map((f, i) => (
              <div key={`${f.name}-${f.size}-${i}`} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ backgroundColor: "rgba(9,54,179,0.07)", border: "1px solid rgba(9,54,179,0.2)" }}>
                <Video size={14} style={{ color: "#0936B3" }} />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.75rem", color: "#0936B3", fontWeight: 600 }}>{f.name}</span>
                <button type="button" onClick={() => setUploadedVideos((p) => p.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
          <Upload size={15} />
          {saving ? "GUARDANDO..." : editId ? "ACTUALIZAR" : "GUARDAR"}
        </button>
        <button type="button" onClick={resetForm}
          className="px-6 py-2.5 rounded-xl border hover:bg-gray-50 transition-colors"
          style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#6b7280" }}>
          CANCELAR
        </button>
      </div>
    </form>
  );

  return (
    <div className={`min-h-screen${isDark ? " admin-dark" : ""}`} style={{ backgroundColor: isDark ? "#0f172a" : "#f4f6fb" }}>
      {isDark && (
        <style>{`
          .admin-dark .bg-white { background-color: #1e293b !important; }
          .admin-dark .bg-gray-50 { background-color: #162032 !important; }
          .admin-dark .bg-gray-100 { background-color: #1e293b !important; }
          .admin-dark [style*="background-color: #f4f6fb"] { background-color: #162032 !important; }
          .admin-dark [style*="background-color: #f9fafb"] { background-color: #1a2332 !important; }
          .admin-dark [style*="background-color: #fffbf0"] { background-color: #1c1a0d !important; }
          .admin-dark [style*="background-color: #f0f4ff"] { background-color: #0d1a3e !important; }
          .admin-dark [style*="background-color: #f0f9f4"] { background-color: #0a1f14 !important; }
          .admin-dark [style*="background-color: #fef2f2"] { background-color: #1f0a0a !important; }
          .admin-dark [style*="background-color: rgba(9,54,179,0.07)"] { background-color: rgba(9,54,179,0.25) !important; }
          .admin-dark [style*="background-color: rgba(9,54,179,0.08)"] { background-color: rgba(9,54,179,0.25) !important; }
          .admin-dark [style*="background-color: rgba(9,54,179,0.1)"] { background-color: rgba(9,54,179,0.25) !important; }
          .admin-dark [style*="background-color: rgba(245,158,11,0.08)"] { background-color: rgba(245,158,11,0.18) !important; }
          .admin-dark [style*="background-color: rgba(22,163,74,0.07)"] { background-color: rgba(22,163,74,0.18) !important; }
          .admin-dark [style*="color: #0d0d14"] { color: #f1f5f9 !important; }
          .admin-dark [style*="color: #374151"] { color: #cbd5e1 !important; }
          .admin-dark [style*="color: #6b7280"] { color: #94a3b8 !important; }
          .admin-dark [style*="color: #9ca3af"] { color: #64748b !important; }
          .admin-dark [style*="color: #dc2626"] { color: #f87171 !important; }
          .admin-dark [style*="color: #b45309"] { color: #fbbf24 !important; }
          .admin-dark .text-gray-400 { color: #94a3b8 !important; }
          .admin-dark .text-gray-700 { color: #cbd5e1 !important; }
          .admin-dark .text-gray-500 { color: #94a3b8 !important; }
          .admin-dark [style*="border: 1px solid rgba(0,0,0"] { border-color: rgba(255,255,255,0.08) !important; }
          .admin-dark [style*="border: 1.5px solid rgba(0,0,0"] { border-color: rgba(255,255,255,0.1) !important; }
          .admin-dark [style*="borderColor: \"rgba(0,0,0"] { border-color: rgba(255,255,255,0.08) !important; }
          .admin-dark .border-b { border-color: rgba(255,255,255,0.07) !important; }
          .admin-dark .border { border-color: rgba(255,255,255,0.1) !important; }
          .admin-dark .border-t { border-color: rgba(255,255,255,0.07) !important; }
          .admin-dark .divide-gray-100 > * + * { border-color: rgba(255,255,255,0.06) !important; }
          .admin-dark input, .admin-dark textarea, .admin-dark select {
            background-color: #162032 !important; color: #f1f5f9 !important;
            border-color: rgba(255,255,255,0.1) !important;
          }
          .admin-dark input::placeholder, .admin-dark textarea::placeholder { color: #4b5d78 !important; }
          .admin-dark .hover\\:bg-gray-50:hover { background-color: #273549 !important; }
          .admin-dark .hover\\:bg-red-50:hover { background-color: rgba(239,68,68,0.1) !important; }
          .admin-dark .hover\\:bg-blue-50:hover { background-color: rgba(59,130,246,0.1) !important; }
          .admin-dark [style*="border-color: rgba(0,0,0"] { border-color: rgba(255,255,255,0.08) !important; }
        `}</style>
      )}

      {/* Header */}
      <div className="border-b shadow-sm sticky top-0 z-40" style={{ backgroundColor: isDark ? "#111827" : "#fff", borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={logoImg} alt="Quiroga" className="h-9 object-contain" />
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#0936B3" }}>Panel Administrador</span>
          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)", color: isDark ? "#f1f5f9" : "#6b7280" }}
              title={isDark ? "Modo claro" : "Modo oscuro"}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => { sessionStorage.removeItem("quiroga_admin"); sessionStorage.removeItem("quiroga_admin_role"); navigate("/"); }}
              className="flex items-center gap-1.5 transition-colors"
              style={{ color: isDark ? "#94a3b8" : "#9ca3af" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? "#94a3b8" : "#9ca3af")}>
              <LogOut size={16} />
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem" }}>Salir</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {msg && (
          <div className="mb-5 p-3 rounded-xl text-center" style={{ backgroundColor: "rgba(9,54,179,0.08)", color: "#0936B3", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            {msg}
          </div>
        )}
        {error && (
          <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", color: "#dc2626" }}>
              <strong>Error de base de datos:</strong> {error}
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: "#9ca3af", marginTop: "6px" }}>
              Asegurate de crear la tabla <code>vehicles</code> en tu proyecto Supabase. Abrí el SQL Editor y ejecutá el script de configuración.
            </p>
            <button onClick={reload} className="mt-3 px-4 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              Reintentar
            </button>
          </div>
        )}

        {/* Tipo de cambio */}
        <div className="mb-6 p-4 rounded-2xl flex flex-wrap items-center gap-4 bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex-1">
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", color: "#6b7280" }}>TIPO DE CAMBIO USD → UYU</p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.7rem", color: "#9ca3af" }}>Usado en la calculadora de financiación propia. Hacé clic en Actualizar para aplicar el valor en toda la página.</p>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#0d0d14" }}>1 USD =</span>
            <input type="number" value={tcDraft} onChange={(e) => setTcDraft(+e.target.value)}
              style={{ ...inp, width: "88px", border: "1.5px solid #0936B3", fontWeight: 700, color: "#0936B3" }} />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#0d0d14" }}>UYU</span>
            <button type="button" onClick={handleUpdateTipoCambio} disabled={tcSaving || tcDraft === tipoCambio}
              className="px-4 py-2 rounded-lg transition-all hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.78rem" }}>
              {tcSaving ? "ACTUALIZANDO..." : "ACTUALIZAR"}
            </button>
          </div>
        </div>

        {/* User management — superadmin only */}
        {isSuperAdmin && (
          <div className="mb-6 rounded-2xl bg-white shadow-sm overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
              <Users size={17} style={{ color: "#0936B3" }} />
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#0d0d14" }}>Usuarios del Panel</h2>
            </div>
            <div className="p-5 flex flex-col gap-6">
              {/* User list */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ backgroundColor: "#f0f4ff", border: "1px solid rgba(9,54,179,0.15)" }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#0936B3" }}>{ADMIN_USER}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>SUPERADMIN</span>
                </div>
                {usersLoading ? (
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "#9ca3af" }}>Cargando...</p>
                ) : adminUsers.length === 0 ? (
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "#9ca3af" }}>No hay usuarios básicos creados aún.</p>
                ) : adminUsers.map((u) => (
                  <div key={u.username} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ backgroundColor: "#f9fafb", border: "1px solid rgba(0,0,0,0.07)" }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#374151" }}>{u.username}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#f3f4f6", color: "#6b7280", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>BÁSICO</span>
                    </div>
                    <button onClick={async () => {
                      if (!confirm(`¿Eliminar usuario "${u.username}"?`)) return;
                      await dbDeleteUser(u.username);
                      setAdminUsers((p) => p.filter((x) => x.username !== u.username));
                    }} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>

              {/* Create user */}
              <div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em", color: "#6b7280", marginBottom: "10px" }}>CREAR USUARIO BÁSICO</p>
                <form className="flex flex-wrap gap-3 items-end" onSubmit={async (e) => {
                  e.preventDefault();
                  const uname = newUser.username.trim();
                  const upass = newUser.password.trim();
                  if (!uname || !upass) return;
                  const err = await dbCreateUser(uname, upass);
                  if (err) { setUserMsg(err.includes("duplicate") ? "Ese nombre de usuario ya existe." : err); return; }
                  setAdminUsers((p) => [...p, { username: uname }]);
                  setNewUser({ username: "", password: "" });
                  setUserMsg("Usuario creado."); setTimeout(() => setUserMsg(""), 3000);
                }}>
                  <div><label style={lbl}>USUARIO</label>
                    <input value={newUser.username} onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))} style={{ ...inp, width: "150px" }} placeholder="nombre" required /></div>
                  <div><label style={lbl}>CONTRASEÑA</label>
                    <input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} style={{ ...inp, width: "150px" }} placeholder="••••••" required /></div>
                  <button type="submit" className="px-5 py-2 rounded-xl hover:brightness-110 transition-all"
                    style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.82rem" }}>CREAR</button>
                </form>
                {userMsg && <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "#0936B3", marginTop: "8px", fontWeight: 600 }}>{userMsg}</p>}
              </div>

              {/* Change superadmin password */}
              <div className="border-t pt-5" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound size={14} style={{ color: "#6b7280" }} />
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em", color: "#6b7280" }}>CAMBIAR CONTRASEÑA (superadmin)</p>
                </div>
                <form className="flex flex-wrap gap-3 items-end" onSubmit={async (e) => {
                  e.preventDefault();
                  if (changePwForm.next.length < 4) { setPwMsg("La nueva contraseña debe tener al menos 4 caracteres."); return; }
                  if (changePwForm.next !== changePwForm.confirm) { setPwMsg("Las contraseñas no coinciden."); return; }
                  const err = await dbChangePassword(ADMIN_USER, changePwForm.current, changePwForm.next);
                  if (err) { setPwMsg(err); return; }
                  setChangePwForm({ current: "", next: "", confirm: "" });
                  setPwMsg("Contraseña actualizada."); setTimeout(() => setPwMsg(""), 3000);
                }}>
                  <div><label style={lbl}>ACTUAL</label>
                    <input type="password" value={changePwForm.current} onChange={(e) => setChangePwForm((p) => ({ ...p, current: e.target.value }))} style={{ ...inp, width: "140px" }} placeholder="••••••" required /></div>
                  <div><label style={lbl}>NUEVA</label>
                    <input type="password" value={changePwForm.next} onChange={(e) => setChangePwForm((p) => ({ ...p, next: e.target.value }))} style={{ ...inp, width: "140px" }} placeholder="••••••" required /></div>
                  <div><label style={lbl}>CONFIRMAR</label>
                    <input type="password" value={changePwForm.confirm} onChange={(e) => setChangePwForm((p) => ({ ...p, confirm: e.target.value }))} style={{ ...inp, width: "140px" }} placeholder="••••••" required /></div>
                  <button type="submit" className="px-5 py-2 rounded-xl hover:brightness-110 transition-all"
                    style={{ backgroundColor: "#374151", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.82rem" }}>CAMBIAR</button>
                </form>
                {pwMsg && <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem", color: "#0936B3", marginTop: "8px", fontWeight: 600 }}>{pwMsg}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Site content (hero + novedades) */}
        <SiteContentManager />

        {/* Accesorios */}
        <AccessoriesManager />

        {/* Calculadora de financiación propia */}
        <CalculadoraFinanciacion />

        <div className="flex justify-between items-center mb-6 mt-8">
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#0d0d14" }}>
            Vehículos ({allVehicles.length})
          </h1>
          <button onClick={() => { setEditId(null); setForm(EMPTY); setImages([]); setUploadedVideos([]); setShowForm((v) => !v); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:brightness-110 transition-all"
            style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.85rem" }}>
            <Plus size={16} /> AGREGAR VEHÍCULO
          </button>
        </div>

        {showForm && vehicleForm}

        {loading ? (
          <div className="text-center py-16" style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>Cargando...</div>
        ) : allVehicles.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
            <Car size={40} style={{ color: "#d1d5db", margin: "0 auto 12px" }} />
            <p style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>No hay vehículos cargados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allVehicles.map((v) => (
              <div key={v.id} className="rounded-2xl overflow-hidden bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
                {v.images[0] && (
                  <img src={v.images[0]} alt={v.name} className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#0936B3" }}>{v.name}</p>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.75rem", color: "#9ca3af" }}>
                        {v.year} · {v.type === "nuevo" ? "0 KM" : "Usado"} · {v.images.length} fotos
                      </p>
                    </div>
                    {v.price && <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#0d0d14", whiteSpace: "nowrap" }}>{v.moneda} {v.price}</p>}
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    {/* Edit */}
                    <button onClick={() => openEdit(v)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-blue-50 hover:border-[#0936B3] transition-colors"
                      style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#374151" }}>
                      <Edit3 size={12} /> Editar
                    </button>
                    {/* Publish/unpublish */}
                    <button onClick={() => togglePublished(v)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors"
                      style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: v.published ? "#16a34a" : "#9ca3af",
                        backgroundColor: v.published ? "rgba(22,163,74,0.07)" : "transparent" }}>
                      {v.published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {v.published ? "Publicado" : "Oculto"}
                    </button>
                    {/* Featured */}
                    <button onClick={() => toggleFeatured(v)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors"
                      style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: v.featured ? "#f59e0b" : "#9ca3af",
                        backgroundColor: v.featured ? "rgba(245,158,11,0.08)" : "transparent" }}>
                      <Star size={12} fill={v.featured ? "#f59e0b" : "none"} />
                      {v.featured ? "Destacado" : "Destacar"}
                    </button>
                    {/* Delete */}
                    <button onClick={async () => { if (confirm("¿Eliminar este vehículo?")) { await deleteVehicle(v.id); notify("Eliminado."); } }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors ml-auto"
                      style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#9ca3af" }}>
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
