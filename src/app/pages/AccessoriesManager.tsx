import { useState, useRef } from "react";
import { Plus, Trash2, X, ImageIcon, Eye, EyeOff, Edit3, Package } from "lucide-react";
import { useVehicles } from "../contexts/VehiclesContext";
import { useAccessories, type CreateAccessoryData } from "../contexts/AccessoriesContext";

const EMPTY: CreateAccessoryData = { name: "", description: "", price_num: 0, published: true, gallery_urls: [] };

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

interface ImageItem { id: string; url: string; file?: File }

export function AccessoriesManager() {
  const { uploadMedia } = useVehicles();
  const { allAccessories, loading, addAccessory, updateAccessory, deleteAccessory } = useAccessories();
  const [form, setForm] = useState<CreateAccessoryData>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const imgRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const previews = await Promise.all(arr.map(fileToBase64));
    const items: ImageItem[] = arr.map((file, i) => ({ id: crypto.randomUUID(), url: previews[i], file }));
    setImages((p) => [...p, ...items]);
  };

  const removeImg = (id: string) => setImages((p) => p.filter((img) => img.id !== id));

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
    setForm(EMPTY); setEditId(null); setShowForm(false); setImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0 && !editId) { notify("Agregá al menos una foto."); return; }
    setSaving(true);
    try {
      const accessoryId = editId ?? crypto.randomUUID();
      const orderedImageUrls = await Promise.all(
        images.map((img) => (img.file ? uploadMedia(img.file, `accessories/${accessoryId}`) : Promise.resolve(img.url)))
      );
      const payload: CreateAccessoryData = {
        ...form,
        cover_image_url: orderedImageUrls[0] ?? "",
        gallery_urls: orderedImageUrls,
      };
      if (editId) {
        await updateAccessory(editId, payload);
        notify("Accesorio actualizado.");
      } else {
        await addAccessory(payload);
        notify("Accesorio agregado.");
      }
      resetForm();
    } catch (err) {
      notify(`Error: ${err instanceof Error ? err.message : "Intentá nuevamente"}`);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (a: (typeof allAccessories)[0]) => {
    setForm({ name: a.name, description: a.description, price_num: a.priceNum, published: a.published });
    setImages(a.images.map((url) => ({ id: url, url })));
    setEditId(a.id);
    setShowForm(true);
  };

  const togglePublished = async (a: (typeof allAccessories)[0]) => {
    await updateAccessory(a.id, { published: !a.published });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#0d0d14" }}>
          Accesorios ({allAccessories.length})
        </h2>
        <button onClick={() => { setEditId(null); setForm(EMPTY); setImages([]); setShowForm((v) => !v); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:brightness-110 transition-all"
          style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.85rem" }}>
          <Plus size={16} /> AGREGAR ACCESORIO
        </button>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-xl text-center" style={{ backgroundColor: "rgba(9,54,179,0.08)", color: "#0936B3", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 rounded-2xl shadow-sm bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#0d0d14", marginBottom: "16px" }}>
            {editId ? "Editar Accesorio" : "Nuevo Accesorio"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div><label style={lbl}>NOMBRE *</label>
              <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} style={inp} placeholder="Cargador Eléctrico 32A" />
            </div>
            <div><label style={lbl}>PRECIO (USD) *</label>
              <input required type="number" value={form.price_num} onChange={(e) => setForm((p) => ({ ...p, price_num: +e.target.value }))} style={inp} placeholder="490" />
            </div>
          </div>

          <div className="mb-4">
            <label style={lbl}>DESCRIPCIÓN</label>
            <textarea value={form.description ?? ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3} style={{ ...inp, resize: "vertical" }} placeholder="Detalles del producto..." />
          </div>

          <label className="flex items-center gap-2.5 mb-4 cursor-pointer" onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
            <div className="w-10 h-5 rounded-full transition-colors flex items-center px-0.5"
              style={{ backgroundColor: form.published ? "#0936B3" : "#d1d5db" }}>
              <span className="w-4 h-4 bg-white rounded-full shadow transition-transform"
                style={{ transform: form.published ? "translateX(20px)" : "translateX(0)" }} />
            </div>
            Publicado
          </label>

          {/* Image upload + gallery */}
          <div className="mb-6">
            <label style={{ ...lbl, marginBottom: "8px" }}>
              {editId ? "FOTOS" : "FOTOS *"}
              <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: "6px" }}>
                (arrastrá una foto sobre otra para cambiar el orden)
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

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              {saving ? "GUARDANDO..." : editId ? "ACTUALIZAR" : "GUARDAR"}
            </button>
            <button type="button" onClick={resetForm}
              className="px-6 py-2.5 rounded-xl border hover:bg-gray-50 transition-colors"
              style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#6b7280" }}>
              CANCELAR
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10" style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>Cargando...</div>
      ) : allAccessories.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-white" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
          <Package size={32} style={{ color: "#d1d5db", margin: "0 auto 10px" }} />
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#9ca3af" }}>No hay accesorios cargados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAccessories.map((a) => (
            <div key={a.id} className="rounded-2xl overflow-hidden bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
              {a.images[0] && <img src={a.images[0]} alt={a.name} className="w-full h-36 object-cover" />}
              <div className="p-4">
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#0936B3" }}>{a.name}</p>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#0d0d14" }}>USD {a.priceNum}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button onClick={() => openEdit(a)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-blue-50 hover:border-[#0936B3] transition-colors"
                    style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#374151" }}>
                    <Edit3 size={12} /> Editar
                  </button>
                  <button onClick={() => togglePublished(a)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ borderColor: "rgba(0,0,0,0.1)", fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: a.published ? "#16a34a" : "#9ca3af",
                      backgroundColor: a.published ? "rgba(22,163,74,0.07)" : "transparent" }}>
                    {a.published ? <Eye size={12} /> : <EyeOff size={12} />}
                    {a.published ? "Publicado" : "Oculto"}
                  </button>
                  <button onClick={async () => { if (confirm("¿Eliminar este accesorio?")) { await deleteAccessory(a.id); notify("Eliminado."); } }}
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
  );
}
