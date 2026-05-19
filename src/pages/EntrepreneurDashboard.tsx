import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, PackagePlus } from "lucide-react";
import ControlAssistant from "../components/ControlAssistant";
import QRBlock from "../components/QRBlock";
import ReviewCard from "../components/ReviewCard";
import { categories } from "../data/mockData";
import { getBusinesses, money, saveBusinesses } from "../lib/storage";
import type { BusinessType, Category } from "../types";

type SaleType = Exclude<BusinessType, "experiencia">;

const timeOptions = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

function splitHours(hours?: string) {
  const [start = "10:00", end = "18:00"] = (hours || "10:00 a 18:00").split(" a ");
  return { hoursStart: start, hoursEnd: end };
}

export default function EntrepreneurDashboard() {
  const [businesses, setBusinesses] = useState(getBusinesses());
  const business = businesses.find((item) => item.id === "artesanias-lupita") || businesses[0];
  const storeUrl = `${window.location.origin}/tienda/${business.id}`;
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    name: business.name,
    owner: business.owner,
    category: business.category,
    description: business.description,
    phone: business.phone,
    ...splitHours(business.hours),
    zone: business.zone,
    type: (business.type === "experiencia" ? "servicio" : business.type) as SaleType
  });
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
    setForm({ type: "producto", name: "", price: "", description: "", stock: "", delivery: "", duration: "", deposit: "", schedule: "", locationMode: "", capacity: "", language: "", meetingPoint: "" });
  };
  const saveBusinessInfo = () => {
    const updated = businesses.map((entry) => entry.id === business.id ? {
      ...entry,
      ...businessForm,
      hours: `${businessForm.hoursStart} a ${businessForm.hoursEnd}`
    } : entry);
    saveBusinesses(updated);
    setBusinesses(updated);
    setEditingBusiness(false);
  };
  const cancelBusinessEdit = () => {
    setBusinessForm({
      name: business.name,
      owner: business.owner,
      category: business.category,
      description: business.description,
      phone: business.phone,
      ...splitHours(business.hours),
      zone: business.zone,
      type: (business.type === "experiencia" ? "servicio" : business.type) as SaleType
    });
    setEditingBusiness(false);
  };

  return (
    <div className="page dashboard">
      <section className="seller-header card">
        <div>
          <span className="eyebrow">Inicio de vendedora</span>
          <h1>{business.name}</h1>
          <p>{business.owner} · {business.category} · {business.zone}</p>
          <p>Administra tu tienda, actualiza productos y servicios, revisa pedidos y comparte tu QR desde un solo lugar.</p>
          <div className="row">
            <span className={business.status === "Verificada" ? "badge success" : "badge pending"}>{business.status}</span>
          </div>
        </div>
        <div className="hero-logo-panel seller-logo-panel" aria-label="Logo Ctrl + She">
          <img src="/logo.png" alt="Ctrl + She" />
        </div>
      </section>

      <ControlAssistant />

      <section className="seller-grid">
        <article className="card padded">
          <div className="row between">
            <h2>Informacion del negocio</h2>
            {!editingBusiness && <button className="btn outline small" onClick={() => setEditingBusiness(true)}><Edit3 size={15} /> Editar</button>}
          </div>
          {editingBusiness ? (
            <div className="info-edit-form">
              <div className="form-grid">
                <label>Nombre del negocio<input value={businessForm.name} onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })} /></label>
                <label>Propietaria<input value={businessForm.owner} onChange={(e) => setBusinessForm({ ...businessForm, owner: e.target.value })} /></label>
              </div>
              <label>Descripcion<textarea value={businessForm.description} onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })} /></label>
              <div className="form-grid">
                <label>WhatsApp<input value={businessForm.phone} onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })} /></label>
                <label>Hora de apertura<select value={businessForm.hoursStart} onChange={(e) => setBusinessForm({ ...businessForm, hoursStart: e.target.value })}>{timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}</select></label>
                <label>Hora de cierre<select value={businessForm.hoursEnd} onChange={(e) => setBusinessForm({ ...businessForm, hoursEnd: e.target.value })}>{timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}</select></label>
                <label>Zona<input value={businessForm.zone} onChange={(e) => setBusinessForm({ ...businessForm, zone: e.target.value })} /></label>
                <label>Tipo<select value={businessForm.type} onChange={(e) => setBusinessForm({ ...businessForm, type: e.target.value as SaleType })}><option value="producto">Producto</option><option value="servicio">Servicio</option></select></label>
              </div>
              <label>Categoria<select value={businessForm.category} onChange={(e) => setBusinessForm({ ...businessForm, category: e.target.value as Category })}>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
              <div className="info-actions">
                <button className="btn primary" onClick={saveBusinessInfo}>Guardar cambios</button>
                <button className="btn outline" onClick={cancelBusinessEdit}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="info-list">
              <p><b>Descripcion:</b> {business.description}</p>
              <p><b>WhatsApp:</b> {business.phone}</p>
              <p><b>Horarios:</b> {business.hours || "10:00 a 18:00"}</p>
              <p><b>Zona:</b> {business.zone}</p>
              <p><b>Tipo:</b> {business.type}</p>
            </div>
          )}
        </article>
        <QRBlock url={storeUrl} />
      </section>

      <section className="card padded">
        <div className="row between">
          <div><span className="badge admin">Catalogo</span><h2>Productos y servicios</h2></div>
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
        <h2>Agregar producto o servicio</h2>
        <label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as BusinessType })}><option value="producto">Producto fisico</option><option value="servicio">Servicio</option></select></label>
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

      <section className="card padded">
        <h2>Resenas recibidas</h2>
        <div className="reviews-grid one-col">
          {business.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      </section>
    </div>
  );
}
