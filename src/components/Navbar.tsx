import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { role, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const links = role === "cliente"
    ? [["Inicio", "/"], ["Explorar", "/explorar"], ["Ruta local", "/ruta-local"], ["Mis pedidos", "/mis-pedidos"]]
    : role === "emprendedora"
      ? [["Mi tienda", "/emprendedora"], ["Pedidos", "/pedidos"], ["IA comercial", "/ia"], ["QR", "/qr"]]
      : role === "admin"
        ? [["Panel admin", "/admin"], ["Explorar", "/explorar"], ["Ruta local", "/ruta-local"]]
        : [["Inicio", "/"], ["Explorar", "/explorar"], ["Ruta local", "/ruta-local"], ["Iniciar sesion/Registrarte", "/login"]];
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark"><img src="/logo.png" alt="Ctrl + She" /></span>
        Ctrl + She
      </Link>
      <button className="icon-button mobile-only" onClick={() => setOpen(!open)} aria-label="Abrir menu">
        <Menu />
      </button>
      <nav className={open ? "nav-links open" : "nav-links"}>
        {links.map(([label, href]) => (
          <NavLink key={href} to={href} onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}
        {currentUser && (
          <button className="nav-logout" onClick={() => { logout(); setOpen(false); navigate("/"); }} aria-label="Cerrar sesion">
            <LogOut size={16} /> Cerrar sesion
          </button>
        )}
      </nav>
    </header>
  );
}
