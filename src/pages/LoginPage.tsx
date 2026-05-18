import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const redirectByRole = {
  cliente: "/explorar",
  emprendedora: "/emprendedora",
  admin: "/admin"
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const user = login(email, password);
    if (!user) {
      setError("Correo o contrasena incorrectos. Usa una cuenta demo valida.");
      return;
    }
    navigate(redirectByRole[user.role]);
  };

  return (
    <div className="page login-page">
      <section className="login-card card">
        <div className="login-brand">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <h1>Ctrl + She</h1>
          <p>Controla, conecta y crece</p>
        </div>
        <form className="form" onSubmit={submit}>
          <label htmlFor="email">Correo<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ctrlshe.demo" /></label>
          <label htmlFor="password">Contrasena<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="demo123" /></label>
          {error && <div className="alert pending" role="alert">{error}</div>}
          <button className="btn primary full">Iniciar sesion</button>
          <Link className="btn outline full" to="/explorar">Explorar como visitante</Link>
        </form>
        <aside className="credentials-box">
          <b>Credenciales de prueba</b>
          <p>cliente@ctrlshe.demo / demo123</p>
          <p>lupita@ctrlshe.demo / demo123</p>
          <p>admin@ctrlshe.demo / demo123</p>
        </aside>
      </section>
    </div>
  );
}
