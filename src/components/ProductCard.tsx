import { CalendarCheck, Package, Users } from "lucide-react";
import { useState } from "react";
import type { CatalogItem } from "../types";
import { money } from "../lib/storage";

export default function ProductCard({ item, onSelect }: { item: CatalogItem; onSelect: (item: CatalogItem) => void }) {
  const [failed, setFailed] = useState(false);
  const action = item.type === "producto" ? "Agregar pedido" : item.type === "servicio" ? "Agendar cita" : "Reservar experiencia";
  return (
    <article className="catalog-card card">
      <div className="image-shell">
        {!failed ? <img src={item.image} alt={item.name} onError={() => setFailed(true)} /> : <div className="image-fallback" aria-label={item.name}>{item.name.charAt(0)}</div>}
      </div>
      <div className="card-body">
        <div className="row between">
          <h3>{item.name}</h3>
          <strong>{money(item.price)}</strong>
        </div>
        <p>{item.description}</p>
        <div className="details-grid">
          {item.stock !== undefined && <span><Package size={15} /> Stock {item.stock}</span>}
          {item.delivery && <span><Package size={15} /> {item.delivery}</span>}
          {item.duration && <span><CalendarCheck size={15} /> {item.duration}</span>}
          {item.schedule && <span><CalendarCheck size={15} /> {item.schedule.join(", ")}</span>}
          {item.deposit && <span>Anticipo {item.deposit}</span>}
          {item.capacity && <span><Users size={15} /> Cupo {item.capacity}</span>}
          {item.language && <span>{item.language}</span>}
          {item.meetingPoint && <span>{item.meetingPoint}</span>}
        </div>
        <button className="btn primary full" onClick={() => onSelect(item)}>{action}</button>
      </div>
    </article>
  );
}
