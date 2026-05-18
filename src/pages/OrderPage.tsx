import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { getBusinesses, makeFolio, money, saveOrder } from "../lib/storage";
import type { OrderStatus } from "../types";

const statuses: OrderStatus[] = ["Solicitado", "Confirmado", "En proceso", "Listo / reservado", "Entregado / realizado", "Cancelado"];

export default function OrderPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const business = getBusinesses().find((item) => item.id === params.get("business"));
  const item = business?.items.find((entry) => entry.id === params.get("item"));
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [delivery, setDelivery] = useState(item?.delivery || item?.locationMode || item?.meetingPoint || "Por definir");
  const [payment, setPayment] = useState("Tarjeta simulada");
  const [receipt, setReceipt] = useState(true);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const amount = useMemo(() => (item?.price || 0) * quantity, [item, quantity]);

  if (!business || !item) return <div className="page"><div className="empty">Selecciona un producto desde una tienda.</div></div>;

  const confirm = () => {
    const folio = makeFolio();
    saveOrder({
      folio,
      businessId: business.id,
      itemId: item.id,
      itemName: item.name,
      businessName: business.name,
      amount,
      quantity,
      customerName: name || "Cliente demo",
      contact: contact || "cliente@demo.com",
      date,
      deliveryMode: delivery,
      paymentMethod: payment,
      needsReceipt: receipt,
      status: "Confirmado",
      createdAt: new Date().toISOString()
    });
    setConfirmed(folio);
  };

  return (
    <div className="page narrow">
      <section className="page-header"><span className="eyebrow">Pedido / reserva</span><h1>Confirma tu solicitud</h1><p>La plataforma registra el proceso dentro del prototipo. WhatsApp queda solo como apoyo.</p></section>
      <div className="order-layout">
        <article className="card order-summary">
          <h2>{item.name}</h2>
          <p>{business.name}</p>
          <strong>{money(amount)}</strong>
          <small>Pago simulado para fines de prototipo. No se realizo ningun cargo real.</small>
        </article>
        <form className="card form" onSubmit={(event) => { event.preventDefault(); confirm(); }}>
          <label>Cantidad o cupos<input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></label>
          <label>Fecha<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label>Nombre del cliente<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" /></label>
          <label>Telefono o correo<input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="correo o telefono" /></label>
          <label>Entrega o cita<input value={delivery} onChange={(e) => setDelivery(e.target.value)} /></label>
          <label>Metodo de pago simulado<select value={payment} onChange={(e) => setPayment(e.target.value)}><option>Pago completo</option><option>Anticipo</option><option>Pago al entregar</option><option>Transferencia</option><option>Tarjeta simulada</option></select></label>
          <label className="check"><input type="checkbox" checked={receipt} onChange={(e) => setReceipt(e.target.checked)} /> Necesito comprobante</label>
          <button className="btn primary full">Confirmar pedido/reserva</button>
        </form>
      </div>
      {confirmed && (
        <section className="success-flow card">
          <h2>Pedido confirmado correctamente</h2>
          <p>Folio interno: <b>{confirmed}</b></p>
          <div className="status-track">{statuses.map((status, index) => <span className={index < 2 ? "done" : ""} key={status}>{status}</span>)}</div>
          <Link className="btn primary" to={`/comprobante/${confirmed}`}>Generar comprobante</Link>
          <button className="btn outline" onClick={() => navigate("/emprendedora")}>Ver en panel emprendedora</button>
        </section>
      )}
    </div>
  );
}
