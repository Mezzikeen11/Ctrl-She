import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { BadgeCheck, FileText, Printer } from "lucide-react";
import ConfirmationPanel from "../components/ConfirmationPanel";
import { getOrders, money, saveInvoice } from "../lib/storage";

export default function ReceiptPage() {
  const { folio } = useParams();
  const order = getOrders().find((entry) => entry.folio === folio);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    rfc: "",
    legalName: "",
    fiscalZip: "",
    regime: "",
    cfdiUse: "Gastos en general",
    email: ""
  });

  if (!order) {
    return (
      <div className="page">
        <div className="empty">No encontramos el comprobante solicitado.</div>
      </div>
    );
  }

  const submit = () => {
    saveInvoice({
      id: crypto.randomUUID(),
      folio: order.folio,
      businessId: order.businessId,
      amount: order.amount,
      status: "Pendiente",
      ...form
    });
    setSent(true);
  };

  return (
    <div className="page narrow receipt-page">
      <section className="page-header receipt-page-header">
        <span className="eyebrow">Comprobante digital</span>
        <h1>{order.folio}</h1>
        <p>Consulta el resumen de tu compra o reserva y descarga el comprobante generado.</p>
      </section>

      <article className="receipt-sheet card">
        <div className="receipt-topline">
          <span className="brand-mini">Ctrl + She</span>
          <span>Comprobante digital</span>
        </div>

        <div className="receipt-title-row">
          <div>
            <span className="eyebrow">Folio</span>
            <h2>{order.folio}</h2>
          </div>
          <span className="badge success">{order.status}</span>
        </div>

        <div className="receipt-detail-list">
          <p><span>Cliente</span><b>{order.customerName}</b></p>
          <p><span>Negocio</span><b>{order.businessName}</b></p>
          <p><span>Concepto</span><b>{order.itemName}</b></p>
          <p><span>Cantidad / cupos</span><b>{order.quantity}</b></p>
          <p><span>Fecha</span><b>{order.date}</b></p>
          <p><span>Modalidad</span><b>{order.deliveryMode}</b></p>
          <p><span>Método de pago</span><b>{order.paymentMethod}</b></p>
          <p><span>Contacto</span><b>{order.contact}</b></p>
          <p className="receipt-total"><span>Total</span><b>{money(order.amount)}</b></p>
        </div>

        <div className="receipt-footer-note">
          <BadgeCheck size={18} />
          <span>Comprobante generado correctamente para seguimiento del pedido o reserva.</span>
        </div>

        <div className="receipt-actions">
          <button className="btn primary" onClick={() => window.print()}>
            <Printer size={17} /> Descargar / imprimir
          </button>
          <Link className="btn outline" to="/mis-pedidos">
            Volver a mis pedidos
          </Link>
        </div>
      </article>

      <section className="card form invoice-card">
        <div className="form-block-title">
          <span><FileText size={17} /></span>
          <div>
            <h2>Solicitud de factura</h2>
            <p>Registra los datos fiscales para que el negocio revise y atienda la solicitud.</p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            RFC
            <input value={form.rfc} onChange={(event) => setForm({ ...form, rfc: event.target.value.toUpperCase() })} />
          </label>

          <label>
            Nombre o razón social
            <input value={form.legalName} onChange={(event) => setForm({ ...form, legalName: event.target.value })} />
          </label>

          <label>
            Código postal fiscal
            <input value={form.fiscalZip} onChange={(event) => setForm({ ...form, fiscalZip: event.target.value })} />
          </label>

          <label>
            Régimen fiscal
            <input value={form.regime} onChange={(event) => setForm({ ...form, regime: event.target.value })} />
          </label>

          <label>
            Uso de CFDI
            <input value={form.cfdiUse} onChange={(event) => setForm({ ...form, cfdiUse: event.target.value })} />
          </label>

          <label>
            Correo electrónico
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
        </div>

        <p className="invoice-summary">
          Monto: <b>{money(order.amount)}</b> · Folio de compra: <b>{order.folio}</b>
        </p>

        <button className="btn primary" onClick={submit}>Solicitar factura</button>

        <div className="status-track invoice-status">
          {["Pendiente", "En revisión", "Enviada", "Rechazada"].map((status, index) => (
            <span className={sent && index === 0 ? "done" : ""} key={status}>{status}</span>
          ))}
        </div>

        {sent && (
          <ConfirmationPanel
            title="Solicitud registrada"
            message="Tu solicitud de factura fue enviada al negocio para revisión."
            detailTo={`/comprobante/${order.folio}`}
            detailLabel="Ver comprobante"
            onBack={() => setSent(false)}
          />
        )}
      </section>
    </div>
  );
}