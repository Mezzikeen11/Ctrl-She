import { Link } from "react-router-dom";
import { CalendarDays, PackageSearch, Sparkles, TrendingUp } from "lucide-react";

const alerts = [
  {
    title: "Tienes 2 pedidos pendientes por confirmar.",
    detail: "Conviene responderlos hoy para no perder ventas.",
    to: "/pedidos",
    icon: <PackageSearch size={18} />
  },
  {
    title: "Hay una reserva la proxima semana.",
    detail: "Prepara horarios, materiales y confirmacion con la clienta.",
    to: "/pedidos",
    icon: <CalendarDays size={18} />
  },
  {
    title: "Tu producto mas consultado es Pulsera Caribe Maya.",
    detail: "Sube stock, mejora la foto o prepara una promocion corta.",
    to: "/emprendedora#agregar-catalogo",
    icon: <TrendingUp size={18} />
  }
];

const predictions = [
  { title: "Se acerca temporada alta", detail: "Prepara mas stock de piezas pequenas y listas para entrega rapida.", value: 86 },
  { title: "Aumentara la demanda en Zona Hotelera", detail: "Publica disponibilidad y entregas en puntos faciles para turistas.", value: 72 },
  { title: "Los accesorios con tonos Caribe estan subiendo", detail: "Crea un paquete de pulsera + bolsa con precio especial.", value: 64 },
  { title: "Clientes responden mejor a fotos claras", detail: "Actualiza imagenes de los productos mas consultados esta semana.", value: 58 }
];

export default function ControlAssistant() {
  return (
    <section className="control-assistant card">
      <span className="badge ai"><Sparkles size={14} /> Asistente IA de alertas</span>
      <h2>Tu negocio necesita atencion aqui</h2>

      <div className="assistant-list">
        {alerts.map((alert) => (
          <Link className="assistant-card" to={alert.to} key={alert.title}>
            <span>{alert.icon}</span>
            <b>{alert.title}</b>
            <p>{alert.detail}</p>
          </Link>
        ))}
      </div>

      <div className="prediction-panel">
        <div>
          <span className="eyebrow">Predicciones IA</span>
          <h3>Avisos para preparar tu semana</h3>
        </div>

        <div className="prediction-grid">
          {predictions.map((prediction) => (
            <article className="prediction-card" key={prediction.title}>
              <div>
                <b>{prediction.title}</b>
                <p>{prediction.detail}</p>
              </div>
              <div className="mini-chart" aria-label={`${prediction.value}% de prioridad`}>
                <span style={{ width: `${prediction.value}%` }} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
