import { Link } from "react-router-dom";
import { getOrders, money } from "../lib/storage";

export default function MyOrdersPage() {
  const orders = getOrders();
  return (
    <div className="page narrow">
      <section className="page-header">
        <span className="eyebrow">Cliente / turista</span>
        <h1>Mis pedidos</h1>
        <p>Pedidos y reservas creados durante la demo en este navegador.</p>
      </section>
      <section className="card">
        <div className="compact-list">
          {orders.map((order) => (
            <div key={order.folio}>
              <b>{order.folio} · {order.itemName}</b>
              <span>{order.status} · {money(order.amount)}</span>
              <Link className="btn outline small" to={`/comprobante/${order.folio}`}>Ver comprobante</Link>
            </div>
          ))}
          {!orders.length && <p>Aun no hay pedidos. Explora una tienda y confirma una solicitud para verlos aqui.</p>}
        </div>
      </section>
    </div>
  );
}
