import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="page narrow">
      <section className="admin-placeholder card">
        <span className="badge admin">Admin</span>
        <h1>Panel administrativo en desarrollo</h1>
        <p>En una fase posterior permitira validar perfiles, revisar metricas e identificar zonas con mayor actividad.</p>
        <div className="cta-row">
          <Link className="btn primary" to="/explorar">Explorar negocios</Link>
          <Link className="btn outline" to="/ruta-local">Ver ruta local</Link>
        </div>
      </section>
    </div>
  );
}
