import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock } from "lucide-react";
import logoImg from "../../imports/LOGO_QUIROGA_AUTOMOVILES.png";

const ADMIN_USER = "quiroga";
const ADMIN_PASS = "quiroga2025";

export function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem("quiroga_admin", "1");
      navigate("/admin");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const inp: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", color: "#0d0d14",
    backgroundColor: "#f4f6fb", border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "10px", padding: "10px 14px", width: "100%", outline: "none",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-2xl shadow-xl p-8" style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.07)" }}>
        <div className="flex flex-col items-center mb-8">
          <img src={logoImg} alt="Quiroga" className="h-12 mb-4 object-contain" />
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(9,54,179,0.1)", color: "#0936B3" }}>
            <Lock size={22} />
          </div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#0d0d14", marginTop: "12px" }}>Panel Administrador</h1>
        </div>
        <form onSubmit={login} className="flex flex-col gap-4">
          <div>
            <label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.1em", color: "#6b7280", display: "block", marginBottom: "5px" }}>USUARIO</label>
            <input value={user} onChange={(e) => setUser(e.target.value)} required style={inp} placeholder="Usuario" />
          </div>
          <div>
            <label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.1em", color: "#6b7280", display: "block", marginBottom: "5px" }}>CONTRASEÑA</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required style={inp} placeholder="Contraseña" />
          </div>
          {error && <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#dc2626" }}>{error}</p>}
          <button type="submit" className="py-3 rounded-xl mt-2 transition-all hover:brightness-110"
            style={{ backgroundColor: "#0936B3", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  );
}
