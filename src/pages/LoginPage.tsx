import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { UserRole } from "../auth/AuthContext";

const redirectByRole: Record<UserRole, string> = {
  cliente: "/cliente",
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

    const user = login(email, password, selectedRole);
    navigate(redirectByRole[user.role]);
  };

  return (
    <div className="page login-page">
      <section className="login-card card">
        <div className="login-brand">
          <span className="login-logo-mark"><img src="/logo.png" alt="Ctrl + She" /></span>
          <h1>Ctrl + She</h1>
          <p>{mode === "login" ? "Inicia sesion para continuar" : "Crea tu cuenta"}</p>
        </div>
        <div className="auth-tabs" aria-label="Seleccionar acceso">
          <button className={mode === "login" ? "chip active" : "chip"} onClick={() => setMode("login")}>Iniciar sesion</button>
          <button className={mode === "register" ? "chip active" : "chip"} onClick={() => setMode("register")}>Registrarte</button>
        </div>

        <form className="form" onSubmit={submit}>
          <label htmlFor="email">Correo<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ctrlshe.com" /></label>
          <label htmlFor="password">Contrasena<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ctrl+She" /></label>
          <fieldset className="role-field">
            <legend>{mode === "login" ? "¿Como quieres entrar?" : "¿Que tipo de cuenta quieres crear?"}</legend>
            <div className="role-choice">
              <button type="button" className={selectedRole === "emprendedora" ? "chip active" : "chip"} onClick={() => setSelectedRole("emprendedora")}>Soy vendedora</button>
              <button type="button" className={selectedRole === "cliente" ? "chip active" : "chip"} onClick={() => setSelectedRole("cliente")}>Soy cliente</button>
            </div>
          </fieldset>
          <button className="btn primary full">{mode === "login" ? "Iniciar sesion" : "Registrarme"}</button>
          <Link className="btn outline full" to="/explorar">Explorar como visitante</Link>
        </form>
      </section>
    </div>
  );
}