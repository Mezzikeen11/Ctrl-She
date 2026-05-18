import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Eye, PackagePlus } from "lucide-react";
import ConfirmationPanel from "../components/ConfirmationPanel";
import ControlAssistant from "../components/ControlAssistant";
import ProductCard from "../components/ProductCard";
import QRBlock from "../components/QRBlock";
import ReviewCard from "../components/ReviewCard";
import { getBusinesses, money, saveBusinesses } from "../lib/storage";
import type { BusinessType } from "../types";

export default function EntrepreneurDashboard() {
  const [businesses, setBusinesses] = useState(getBusinesses());
  const business = businesses.find((item) => item.id === "artesanias-lupita") || businesses[0];
  const storeUrl = `${window.location.origin}/tienda/${business.id}`;
  const [confirmation, setConfirmation] = useState("");
  const [form, setForm] = useState({
    type: "producto" as BusinessType,
    name: "",
    price: "",
    description: "",
    stock: "",
    delivery: "",
    duration: "",
    deposit: "",
    schedule: "",
    locationMode: "",
    capacity: "",
    language: "",
    meetingPoint: ""
  });

  const addItem = () => {
    if (!form.name.trim() || !form.price) return;
    const updated = businesses.map((entry) => entry.id === business.id ? {
      ...entry,
      items: [{
        id: crypto.randomUUID(),
        businessId: entry.id,
        type: form.type,
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: entry.image,
        stock: form.type === "producto" ? Number(form.stock || 0) : undefined,
        delivery: form.type === "producto" ? form.delivery : undefined,
        duration: form.type !== "producto" ? form.duration : undefined,
        deposit: form.type === "servicio" ? form.deposit : undefined,
        schedule: form.type === "servicio" ? form.schedule.split(",").map((item) => item.trim()).filter(Boolean) : undefined,
        locationMode: form.type === "servicio" ? form.locationMode : undefined,
        capacity: form.type === "experiencia" ? Number(form.capacity || 0) : undefined,
        language: form.type === "experiencia" ? form.language : undefined,
        meetingPoint: form.type === "experiencia" ? form.meetingPoint : undefined
      }, ...entry.items]
    } : entry);
    saveBusinesses(updated);
    setBusinesses(updated);
    setConfirmation("Producto agregado al catalogo.");
    setForm({ type: "producto", name: "", price: "", description: "", stock: "", delivery: "", duration: "", deposit: "", schedule: "", locationMode: "", capacity: "", language: "", meetingPoint: "" });
  };

  return (
    <div className="page dashboard">
      <section className="seller-header card">
        <div>
          <span className={business.status === "Verificada" ? "badge success" : "badge pending"}>{business.status}</span>
          <h1>{business.name}</h1>
          <p>{business.owner} · {business.category} · {business.zone}</p>
        </div>
        <Link className="btn primary" to={`/tienda/${business.id}`}><Eye size={18} /> Ver como cliente</Link>
      </section>

      {confirmation && <ConfirmationPanel title="Accion completada" message={confirmation} detailTo={`/tienda/${business.id}`} detailLabel="Ver tienda publica" onBack={() => setConfirmation("")} />}

      <ControlAssistant />

      <section className="seller-grid">
        <article className="card padded">
          <h2>Informacion del negocio</h2>
          <div className="info-list">
            <p><b>Descripcion:</b> {business.description}</p>
            <p><b>WhatsApp:</b> {business.phone}</p>
            <p><b>Horarios:</b> 10:00 a 18:00</p>
            <p><b>Zona:</b> {business.zone}</p>
            <p><b>Tipo:</b> {business.type}</p>
          </div>
        </article>
        <QRBlock url={storeUrl} />
      </section>

      <section className="card padded">
        <div className="row between">
          <div><span className="badge admin">Catalogo</span><h2>Productos, servicios y experiencias</h2></div>
          <button className="btn primary" onClick={() => document.getElementById("agregar-catalogo")?.scrollIntoView()}><PackagePlus size={18} /> Agregar</button>
        </div>
        <div className="catalog-admin-list">
          {business.items.map((item) => (
            <article key={item.id} className="catalog-admin-item">
              <div><b>{item.name}</b><p>{item.description}</p></div>
              <span>{money(item.price)}</span>
              <button className="btn outline small"><Edit3 size={15} /> Editar</button>
              <Link className="btn secondary small" to={`/tienda/${business.id}`}>Ver publico</Link>
              <Link className="btn outline small" to="/pedidos">Ver pedidos</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="agregar-catalogo" className="card form">
        <span className="badge admin">Nuevo elemento</span>
        <h2>Agregar producto, servicio o experiencia</h2>
        <label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as BusinessType })}><option value="producto">Producto fisico</option><option value="servicio">Servicio</option><option value="experiencia">Experiencia turistica</option></select></label>
        <div className="form-grid">
          <label>Nombre<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>{form.type === "experiencia" ? "Precio por persona" : form.type === "servicio" ? "Precio base" : "Precio"}<input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
        </div>
        <label>Descripcion<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        {form.type === "producto" && <div className="form-grid"><label>Stock<input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></label><label>Metodo de entrega<input value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })} /></label></div>}
        {form.type === "servicio" && <div className="form-grid"><label>Duracion<input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></label><label>Anticipo<input value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })} /></label><label>Horarios<input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="10:00, 13:00" /></label><label>Ubicacion<input value={form.locationMode} onChange={(e) => setForm({ ...form, locationMode: e.target.value })} /></label></div>}
        {form.type === "experiencia" && <div className="form-grid"><label>Cupo maximo<input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></label><label>Duracion<input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></label><label>Idioma<input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} /></label><label>Punto de encuentro<input value={form.meetingPoint} onChange={(e) => setForm({ ...form, meetingPoint: e.target.value })} /></label></div>}
        <button className="btn primary" onClick={addItem}>Guardar en catalogo</button>
      </section>

      <section className="seller-grid">
        <article className="card padded">
          <h2>Vista publica</h2>
          <div className="public-preview">
            <ProductCard item={business.items[0]} onSelect={() => undefined} />
          </div>
        </article>
        <article className="card padded">
          <h2>Resenas recibidas</h2>
          <div className="reviews-grid one-col">
            {business.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
          </div>
        </article>
      </section>
    </div>
  );
}
