import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmationPanel from "../components/ConfirmationPanel";
import { getInvoices, getOrders, money, updateOrderStatus } from "../lib/storage";
import type { OrderStatus } from "../types";

const actions: Array<[OrderStatus, string]> = [
  ["Confirmado", "Confirmar"],
  ["En proceso", "Marcar en proceso"],
  ["Listo / reservado", "Marcar listo/reservado"],
  ["Entregado / realizado", "Marcar entregado/realizado"],
  ["Cancelado", "Cancelar"]
];

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState(getOrders());
  const invoices = getInvoices();
  const [confirmation, setConfirmation] = useState<{ folio: string; status: OrderStatus } | null>(null);

  const changeStatus = (folio: string, status: OrderStatus) => {
    setOrders(updateOrderStatus(folio, status));
    setConfirmation({ folio, status });
  };

  return (
    <div className="page dashboard">
      <section className="page-header">
        <span className="eyebrow">Operacion</span>
        <h1>Pedidos y reservas</h1>
        <p>Resuelve pedidos reales guardados en localStorage y acompana cada cambio de estado.</p>
      </section>
      {confirmation && (
        <ConfirmationPanel
          title="Estado actualizado"
          message={`El pedido ${confirmation.folio} ahora esta en estado: ${confirmation.status}.`}
          detailTo={`/comprobante/${confirmation.folio}`}
          detailLabel="Ver comprobante"
          onBack={() => setConfirmation(null)}
        />
      )}
      <section className="orders-grid">
        {orders.map((order) => {
          const invoice = invoices.find((item) => item.folio === order.folio);
          return (
            <article className="order-card card" key={order.folio}>
              <div className="row between">
                <span className="badge admin">{order.folio}</span>
                <span className="badge ai">{order.status}</span>
              </div>
              <h2>{order.itemName}</h2>
              <p><b>Cliente:</b> {order.customerName}</p>
              <p><b>Fecha:</b> {order.date}</p>
              <p><b>Monto:</b> {money(order.amount)}</p>
              <p><b>Pago:</b> {order.paymentMethod}</p>
              <p><b>Comprobante/factura:</b> {order.needsReceipt ? invoice?.status || "Comprobante solicitado" : "No solicitado"}</p>
              <div className="order-actions">
                {actions.map(([status, label]) => <button className="btn outline small" key={status} onClick={() => changeStatus(order.folio, status)}>{label}</button>)}
                <Link className="btn primary small" to={`/comprobante/${order.folio}`}>Ver comprobante</Link>
              </div>
            </article>
          );
        })}
        {!orders.length && <div className="empty">Aun no hay pedidos. Crea uno desde la tienda publica para verlo aqui.</div>}
      </section>
    </div>
  );
}
