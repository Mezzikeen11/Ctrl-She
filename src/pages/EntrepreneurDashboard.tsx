import { Link } from "react-router-dom";
import {
  ClipboardList,
  Package,
  QrCode,
  Sparkles,
  Store
} from "lucide-react";
import ControlAssistant from "../components/ControlAssistant";
import QRBlock from "../components/QRBlock";
import ReviewCard from "../components/ReviewCard";
import { getBusinesses, getOrders } from "../lib/storage";
import "../styles/seller-dashboard.css";

export default function EntrepreneurDashboard() {
  const businesses = getBusinesses();
  const orders = getOrders();

  const business =
    businesses.find((item) => item.id === "artesanias-lupita") || businesses[0];

  if (!business) {
    return (
      <div className="page dashboard seller-dashboard-page">
        <div className="empty">No se encontró información del negocio.</div>
      </div>
    );
  }

  const storeUrl = `${window.location.origin}/tienda/${business.id}`;

  const businessOrders = orders.filter(
    (order) => order.businessId === business.id
  );

  const pendingOrders = businessOrders.filter((order) =>
    ["Solicitado", "Confirmado", "En proceso", "Listo / reservado"].includes(
      order.status
    )
  );

  const typeLabel =
    business.type === "producto"
      ? "Producto"
      : business.type === "servicio"
        ? "Servicio"
        : "Experiencia";

  return (
    <div className="page dashboard seller-dashboard-page">
      <section className="seller-dashboard-hero card">
        <div>
          <span
            className={
              business.status === "Verificada"
                ? "badge success"
                : "badge pending"
            }
          >
            {business.status}
          </span>

          <h1>{business.name}</h1>

          <p>
            {business.owner} · {business.category} · {business.zone}
          </p>

          <p>
            Panel general para revisar información del negocio, pedidos, QR y
            herramientas de apoyo. La gestión de productos, servicios o
            experiencias ahora se realiza desde el módulo Catálogo.
          </p>
        </div>
      </section>

      <section className="seller-dashboard-layout">
        <div className="seller-dashboard-main">
          <section className="seller-dashboard-stats">
            <article className="stat-card">
              <Store />
              <span>Tipo de negocio</span>
              <strong>{typeLabel}</strong>
              <p>Este tipo define qué puede administrar en Catálogo.</p>
            </article>

            <article className="stat-card info">
              <Package />
              <span>Elementos en catálogo</span>
              <strong>{business.items.length}</strong>
              <p>Productos, servicios o experiencias publicados.</p>
            </article>

            <article className="stat-card success">
              <ClipboardList />
              <span>Pedidos activos</span>
              <strong>{pendingOrders.length}</strong>
              <p>Pedidos y reservas pendientes de seguimiento.</p>
            </article>

            <article className="stat-card ai">
              <QrCode />
              <span>QR de tienda</span>
              <strong>Disponible</strong>
              <p>Comparte tu tienda en redes, ferias o puntos de venta.</p>
            </article>
          </section>

          <section className="seller-dashboard-card card padded">
            <h2>Información del negocio</h2>

            <div className="info-list">
              <p>
                <b>Descripción:</b> {business.description}
              </p>
              <p>
                <b>WhatsApp:</b> {business.phone}
              </p>
              <p>
                <b>Horarios:</b> {business.hours || "10:00 a 18:00"}
              </p>
              <p>
                <b>Zona:</b> {business.zone}
              </p>
              <p>
                <b>Categoría:</b> {business.category}
              </p>
              <p>
                <b>Tipo:</b> {business.type}
              </p>
            </div>
          </section>

          <section className="seller-dashboard-card card padded">
            <h2>Acciones operativas</h2>

            <div className="compact-list">
              <div>
                <span>Catálogo</span>
                <Link className="btn small primary" to="/catalogo">
                  Gestionar
                </Link>
              </div>

              <div>
                <span>Pedidos y reservas</span>
                <Link className="btn small outline" to="/pedidos">
                  Revisar
                </Link>
              </div>

              <div>
                <span>QR de tienda</span>
                <Link className="btn small outline" to="/qr">
                  Ver QR
                </Link>
              </div>

              <div>
                <span>Asistente IA</span>
                <Link className="btn small outline" to="/ia">
                  Abrir
                </Link>
              </div>
            </div>
          </section>
        </div>

        <aside className="seller-dashboard-side">
          <ControlAssistant />

          <div className="seller-dashboard-qr">
            <QRBlock url={storeUrl} />
          </div>
        </aside>
      </section>

      <section className="card padded">
        <h2>Reseñas recibidas</h2>

        <div className="reviews-grid one-col">
          {business.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  );
}