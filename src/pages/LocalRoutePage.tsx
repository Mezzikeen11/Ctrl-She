import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import { getBusinesses } from "../lib/storage";
import type { Category } from "../types";

const zones = [
  { name: "Mercado 28", x: 22, y: 48 },
  { name: "Parque de las Palapas", x: 38, y: 62 },
  { name: "Zona Hotelera", x: 76, y: 34 },
  { name: "Centro de Cancun", x: 42, y: 44 },
  { name: "Puerto Juarez", x: 61, y: 18 },
  { name: "Plaza Las Americas", x: 53, y: 55 }
];

export default function LocalRoutePage() {
  const [category, setCategory] = useState<Category | "Todas">("Todas");
  const [zone, setZone] = useState("Mercado 28");
  const businesses = getBusinesses();
  const filtered = useMemo(() => businesses.filter((business) => {
    const sameCategory = category === "Todas" || business.category === category;
    const sameZone = business.zone === zone || (zone === "Centro de Cancun" && business.zone.includes("Centro"));
    return sameCategory && sameZone;
  }), [businesses, category, zone]);

  return (
    <div className="page">
      <section className="page-header"><span className="eyebrow">Ruta local</span><h1>Mapa simulado de emprendedoras en Cancun</h1><p>Explora puntos de actividad local sin conectar mapas externos.</p></section>
      <CategoryFilter value={category} onChange={setCategory} />
      <section className="map-layout">
        <div className="mock-map card" aria-label="Mapa simulado de Cancun">
          <div className="map-coast" />
          {zones.map((item) => (
            <button key={item.name} className={zone === item.name ? "map-pin active" : "map-pin"} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => setZone(item.name)} aria-label={`Ver negocios en ${item.name}`}>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <aside className="zone-panel card">
          <h2>{zone}</h2>
          <div className="zone-list">
            {zones.map((item) => <button key={item.name} className={zone === item.name ? "chip active" : "chip"} onClick={() => setZone(item.name)}>{item.name}</button>)}
          </div>
          <div className="compact-list">
            {filtered.map((business) => (
              <div key={business.id}>
                <b>{business.name}</b>
                <span>{business.category}</span>
                <Link className="btn primary small" to={`/tienda/${business.id}`}>Ver tienda</Link>
              </div>
            ))}
            {!filtered.length && <p>No hay negocios con estos filtros en esta zona.</p>}
          </div>
        </aside>
      </section>
    </div>
  );
}
