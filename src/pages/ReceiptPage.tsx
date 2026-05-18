import { useParams } from "react-router-dom";
import { useState } from "react";
import ConfirmationPanel from "../components/ConfirmationPanel";
import { getOrders, money, saveInvoice } from "../lib/storage";

export default function ReceiptPage() {
  const { folio } = useParams();
  const order = getOrders().find((item) => item.folio === folio);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ rfc: "", legalName: "", fiscalZip: "", regime: "", cfdiUse: "Gastos en general", email: "" });
  if (!order) return <div className="page"><div className="empty">No encontramos el comprobante solicitado.</div></div>;
  const submit = () => {
    saveInvoice({ id: crypto.randomUUID(), folio: order.folio, businessId: order.businessId, amount: order.amount, status: "Pendiente", ...form });
    setSent(true);
  };
  return (
    <div className="page narrow">
      <section className="page-header"><span className="eyebrow">Comprobante digital no fiscal</span><h1>{order.folio}</h1></section>
      <article className="receipt card">
        <div className="row between"><h2>{order.businessName}</h2><span className="badge success">{order.status}</span></div>
        <p><b>Concepto:</b> {order.itemName}</p>
        <p><b>Monto:</b> {money(order.amount)}</p>
        <p><b>Fecha:</b> {order.date}</p>
        <p><b>Metodo de pago:</b> {order.paymentMethod}</p>
        <p><b>Contacto:</b> {order.contact}</p>
        <div className="alert admin">Este comprobante no sustituye una factura fiscal.</div>
        <button className="btn secondary" onClick={() => window.print()}>Descargar comprobante</button>
      </article>
      <section className="card form">
        <span className="badge pending">Solicitud de factura</span>
        <h2>Registra tus datos fiscales</h2>
        <div className="form-grid">
          <label>RFC<input value={form.rfc} onChange={(e) => setForm({ ...form, rfc: e.target.value })} /></label>
          <label>Nombre o razon social<input value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} /></label>
          <label>Codigo postal fiscal<input value={form.fiscalZip} onChange={(e) => setForm({ ...form, fiscalZip: e.target.value })} /></label>
          <label>Regimen fiscal<input value={form.regime} onChange={(e) => setForm({ ...form, regime: e.target.value })} /></label>
          <label>Uso de CFDI<input value={form.cfdiUse} onChange={(e) => setForm({ ...form, cfdiUse: e.target.value })} /></label>
          <label>Correo electronico<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        </div>
        <p>Monto: <b>{money(order.amount)}</b> · Folio de compra: <b>{order.folio}</b></p>
        <button className="btn primary" onClick={submit}>Solicitar factura</button>
        <div className="status-track invoice-status">
          {["Pendiente", "En revision", "Enviada", "Rechazada"].map((status, index) => <span className={sent && index === 0 ? "done" : ""} key={status}>{status}</span>)}
        </div>
        {sent && <ConfirmationPanel title="Solicitud registrada" message="Tu solicitud de factura fue registrada. En esta version el sistema no timbra CFDI; la solicitud queda pendiente de revision." detailTo={`/comprobante/${order.folio}`} detailLabel="Ver comprobante" onBack={() => setSent(false)} />}
      </section>
    </div>
  );
}
