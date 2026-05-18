import { Sparkles } from "lucide-react";

const alerts = [
  "Tienes 3 pedidos pendientes por confirmar.",
  "Una solicitud de factura esta pendiente de revision.",
  "Tu QR recibio nuevas visitas.",
  "Tu producto mas consultado es Pulsera Caribe Maya.",
  "Te recomiendo mejorar la descripcion de un producto.",
  "Hay una reserva proxima para manana."
];

export default function ControlAssistant() {
  return (
    <section className="control-assistant card">
      <span className="badge ai"><Sparkles size={14} /> Asistente IA de alertas</span>
      <h2>Tu negocio necesita atencion aqui</h2>
      <div className="assistant-list">
        {alerts.map((alert) => <div key={alert}>{alert}</div>)}
      </div>
    </section>
  );
}
