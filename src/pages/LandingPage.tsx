import { Link } from "react-router-dom";
import { BadgeCheck, CalendarCheck, QrCode, Sparkles, Store, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Plataforma para emprendedoras de Cancun</span>
          <h1>Ctrl + She</h1>
          <h2>Controla, conecta y <mark>crece</mark></h2>
          <p>Organiza ventas, reservas, clientes, catalogos y comprobantes desde un solo lugar.</p>
          <p>Una plataforma digital para que mujeres emprendedoras compartan su tienda, reciban pedidos, usen IA comercial y recuperen control sobre su tiempo.</p>
          <div className="cta-row">
            <Link className="btn primary" to="/explorar">Explorar como visitante</Link>
            <Link className="btn secondary" to="/login">Iniciar sesion</Link>
          </div>
        </div>
        <div className="hero-panel card">
          <div className="mini-top"><span>Tienda activa</span><b>18 visitas por QR</b></div>
          <div className="phone-preview">
            <span className="badge success">Verificada</span>
            <h3>Artesanias Lupita</h3>
            <p>Pulsera Caribe Maya · $120 MXN</p>
            <button>Confirmar pedido</button>
          </div>
        </div>
      </section>

      <section className="section two-col">
        <article>
          <span className="eyebrow">Problema</span>
          <h2>Demasiadas tareas dispersas</h2>
          <p>Pedidos en mensajes, catalogos en redes, reservas en libretas y comprobantes hechos a mano consumen tiempo que podria invertirse en crecer.</p>
        </article>
        <article>
          <span className="eyebrow">Solucion</span>
          <h2>Una herramienta clara para operar</h2>
          <p>Tienda publica, QR, pedidos, reservas, comprobantes, solicitudes de factura e IA comercial simulada en un flujo facil de explicar.</p>
        </article>
      </section>

      <section className="section">
        <h2>A quien ayuda</h2>
        <div className="feature-grid">
          {[
            ["Productos fisicos", "Artesanias, souvenirs, moda y accesorios.", <Store />],
            ["Servicios personales y creativos", "Belleza, fotografia, decoracion y agenda.", <CalendarCheck />],
            ["Experiencias turisticas", "Talleres, recorridos y actividades locales.", <Users />]
          ].map(([title, text, icon]) => (
            <article className="feature-card card" key={String(title)}>{icon}<h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Como funciona</h2>
        <div className="steps">
          <article><b>1</b><h3>Crea tu tienda</h3><p>Publica catalogo, ubicacion aproximada y datos de contacto.</p></article>
          <article><b>2</b><h3>Comparte tu QR</h3><p>Llega a clientes, turistas, hoteles, ferias y redes sociales.</p></article>
          <article><b>3</b><h3>Administra pedidos</h3><p>Confirma reservas, simula pagos y atiende solicitudes.</p></article>
        </div>
      </section>

      <section className="section benefits">
        <h2>Beneficios para la demo</h2>
        <div className="feature-grid">
          <article><QrCode /><b>Menos tareas manuales</b><p>Pedidos y reservas quedan registrados.</p></article>
          <article><Sparkles /><b>IA util, no generica</b><p>Textos, precio sugerido, ingles y preguntas frecuentes.</p></article>
          <article><BadgeCheck /><b>Confianza visible</b><p>Perfiles verificables, resenas y comprobantes claros.</p></article>
        </div>
      </section>
      <section className="final-cta card">
        <h2>Tu negocio. Tu tiempo. Tu control.</h2>
        <p>Empieza explorando negocios locales o inicia sesion para administrar la tienda demo de Lupita.</p>
        <div className="cta-row">
          <Link className="btn primary" to="/explorar">Explorar negocios</Link>
          <Link className="btn secondary" to="/login">Iniciar sesion</Link>
        </div>
      </section>
    </div>
  );
}
