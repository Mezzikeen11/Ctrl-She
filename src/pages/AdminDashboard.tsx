import { useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import { categories } from "../data/mockData";
import { getBusinesses, getInvoices, getOrders, saveBusinesses } from "../lib/storage";
import type { Business } from "../types";

function countBy(items: string[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function topEntries(values: Record<string, number>) {
  return Object.entries(values).sort((a, b) => b[1] - a[1]);
}

export default function AdminDashboard() {
  const [businesses, setBusinesses] = useState(getBusinesses());
  const orders = getOrders();
  const invoices = getInvoices();

  const reservations = useMemo(() => orders.filter((order) => {
    const business = businesses.find((item) => item.id === order.businessId);
    const item = business?.items.find((entry) => entry.id === order.itemId);
    return item?.type === "servicio" || item?.type === "experiencia";
  }), [businesses, orders]);

  const categoryCounts = topEntries(countBy(businesses.map((business) => business.category)));
  const zoneCounts = topEntries(countBy(businesses.map((business) => business.zone)));
  const featured = [...businesses].sort((a, b) => (b.rating + b.visits / 100) - (a.rating + a.visits / 100)).slice(0, 4);
  const pendingProfiles = businesses.filter((business) => business.status === "Pendiente");
  const openOrders = orders.filter((order) => !["Entregado / realizado", "Cancelado"].includes(order.status));

  const updateStatus = (businessId: string, status: Business["status"]) => {
    const updated = businesses.map((business) => business.id === businessId ? { ...business, status } : business);
    saveBusinesses(updated);
    setBusinesses(updated);
  };

  return (
    <div className="page dashboard admin-page">
      <section className="page-header">
        <span className="badge admin">Panel de administrador</span>
        <h1>Panel de administrador</h1>
        <p>Este panel ayuda a presentar impacto social e institucional.</p>
      </section>

      <section className="card padded">
        <h2>Metricas generales</h2>
        <div className="stats-grid">
          <StatCard label="Emprendedoras registradas" value={businesses.length} tone="admin" />
          <StatCard label="Negocios activos" value={businesses.filter((business) => business.status === "Verificada").length} tone="success" />
          <StatCard label="Pedidos generados" value={orders.length} tone="info" />
          <StatCard label="Reservas realizadas" value={reservations.length} tone="ai" />
          <StatCard label="Visitas por QR" value={businesses.reduce((sum, business) => sum + business.visits, 0)} tone="pending" />
          <StatCard label="Solicitudes de factura" value={invoices.length} tone="admin" />
          <StatCard label="Categoria mas usada" value={categoryCounts[0]?.[0] || "Sin datos"} tone="info" />
          <StatCard label="Zona con mayor actividad" value={zoneCounts[0]?.[0] || "Sin datos"} tone="success" />
        </div>
      </section>

      <section className="card padded">
        <h2>Emprendedoras registradas y validacion de perfiles</h2>
        <div className="table-list">
          {businesses.map((business) => (
            <div key={business.id}>
              <span><b>{business.owner}</b><small>{business.name} · {business.category} · {business.zone}</small></span>
              <span className={business.status === "Verificada" ? "badge success" : "badge pending"}>{business.status}</span>
              {business.status !== "Verificada" ? (
                <>
                  <button className="btn outline small" onClick={() => updateStatus(business.id, "Verificada")}>Validar</button>
                  <button className="btn outline small" onClick={() => updateStatus(business.id, "Rechazada")}>Rechazar</button>
                </>
              ) : (
                <span className="admin-row-spacer" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="seller-grid">
        <article className="card padded">
          <h2>Reportes</h2>
          <div className="compact-list">
            <div><b>Perfiles pendientes</b><span>{pendingProfiles.length}</span></div>
            <div><b>Pedidos abiertos</b><span>{openOrders.length}</span></div>
            <div><b>Solicitudes de factura</b><span>{invoices.length}</span></div>
          </div>
        </article>

        <article className="card padded">
          <h2>Administrar categorias</h2>
          <div className="compact-list">
            {categories.map((category) => (
              <div key={category}><b>{category}</b><span>{businesses.filter((business) => business.category === category).length} negocios</span></div>
            ))}
          </div>
        </article>
      </section>

      <section className="seller-grid">
        <article className="card padded">
          <h2>Categorias mas usadas</h2>
          <div className="compact-list">
            {categoryCounts.map(([category, total]) => <div key={category}><b>{category}</b><span>{total}</span></div>)}
          </div>
        </article>

        <article className="card padded">
          <h2>Zonas con mayor actividad</h2>
          <div className="compact-list">
            {zoneCounts.map(([zone, total]) => <div key={zone}><b>{zone}</b><span>{total}</span></div>)}
          </div>
        </article>
      </section>

      <section className="card padded">
        <h2>Negocios destacados</h2>
        <div className="business-grid">
          {featured.map((business) => (
            <article className="review-card" key={business.id}>
              <b>{business.name}</b>
              <p>{business.owner} · {business.zone}</p>
              <span>{business.rating} estrellas · {business.visits} visitas por QR</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
