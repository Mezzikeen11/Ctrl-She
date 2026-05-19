import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import type { UserRole } from "../auth/AuthContext";

const redirectByRole = {
  cliente: "/explorar",
  emprendedora: "/emprendedora",
  admin: "/admin"
};

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, "admin">>("cliente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (mode === "register") {
      const user = register(email, password, selectedRole);
      navigate(redirectByRole[user.role]);
      return;
    }

    const user = login(email, password);
    navigate(redirectByRole[user.role]);
  };

  return (
    <div className="page login-page">
      <section className="login-card card">
        <div className="login-brand">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <h1>Ctrl + She</h1>
          <p>{mode === "login" ? "Inicia sesion para continuar" : "Crea tu cuenta en un paso"}</p>
        </div>
        <div className="auth-tabs" aria-label="Seleccionar acceso">
          <button className={mode === "login" ? "chip active" : "chip"} onClick={() => setMode("login")}>Iniciar sesion</button>
          <button className={mode === "register" ? "chip active" : "chip"} onClick={() => setMode("register")}>Registrarte</button>
        </div>
        <form className="form" onSubmit={submit}>
          <label htmlFor="email">Correo<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ctrlshe.demo" /></label>
          <label htmlFor="password">Contrasena<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ctrl+She" /></label>
          {mode === "register" && (
            <fieldset className="role-field">
              <legend>¿Que tipo de cuenta quieres crear?</legend>
              <div className="role-choice">
                <button type="button" className={selectedRole === "emprendedora" ? "chip active" : "chip"} onClick={() => setSelectedRole("emprendedora")}>Soy vendedora</button>
                <button type="button" className={selectedRole === "cliente" ? "chip active" : "chip"} onClick={() => setSelectedRole("cliente")}>Soy cliente</button>
              </div>
            </fieldset>
          )}
          <button className="btn primary full">{mode === "login" ? "Iniciar sesion" : "Registrarme"}</button>
          <Link className="btn outline full" to="/explorar">Explorar como visitante</Link>
        </form>
        <aside className="credentials-box">
          <b>Admin</b>
          <p>adminCtrlShe@gmail.com / Ctrl+She</p>
        </aside>
      </section>
    </div>
  );
}
