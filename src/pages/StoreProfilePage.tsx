import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MessageCircle,
  MapPin,
  ReceiptText,
  Share2,
  ShoppingBag,
  CalendarDays,
  Star,
} from "lucide-react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";
import ConfirmationPanel from "../components/ConfirmationPanel";
import { addReview, getBusinesses } from "../lib/storage";
import type { CatalogItem, Review } from "../types";
import { useAuth } from "../auth/AuthContext";

export default function StoreProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(getBusinesses().find((item) => item.id === id));
  const [imageFailed, setImageFailed] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const { isAuthenticated } = useAuth();
  if (!business) return <div className="page"><div className="empty">Tienda no encontrada.</div></div>;

const selectItem = (item: CatalogItem) => {
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }

  navigate(`/pedido?business=${business.id}&item=${item.id}`);
};  
  const saveReview = () => {
    if (!reviewText.trim()) return;
    const review: Review = { id: crypto.randomUUID(), businessId: business.id, author: "Cliente demo", rating: 5, text: reviewText };
    setBusiness(addReview(business.id, review));
    setReviewText("");
    setReviewConfirmed(true);
  };
const wa = `https://wa.me/52${business.phone}?text=${encodeURIComponent(
  `Hola, vi tu negocio ${business.name} en Ctrl + She`
)}`;

  return (
    <div className="page">
      <section className="store-hero">
        {!imageFailed ? <img src={business.image} alt={business.name} onError={() => setImageFailed(true)} /> : <div className="store-image-fallback">{business.name.charAt(0)}</div>}
        <div>
          <span className="badge pink">{business.category}</span>
          <h1>{business.name}</h1>
          <p>{business.owner} · {business.zone}</p>
          <p>{business.description}</p>
          <div className="row"><span className="rating"><Star size={16} fill="currentColor" /> {business.rating}</span><span className="badge success">{business.status}</span></div>
        </div>
      </section>

      <div className="action-strip">
        <a className="btn whatsapp" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Contactar por WhatsApp</a>
        <Link className="btn outline" to="/ruta-local"><MapPin size={18} /> Ver ubicacion</Link>
        <button
  className="btn secondary"
  onClick={() =>
    document
      .getElementById("catalogo")
      ?.scrollIntoView()
  }
>
  {business.type === "experiencia" ? (
    <>
      <CalendarDays size={18} />
      Reservar
    </>
  ) : (
    <>
      <ShoppingBag size={18} />
      Hacer pedido
    </>
  )}
</button>
        <button
  className="btn secondary"
  onClick={() => {
    navigator.clipboard.writeText(window.location.href);
    alert("Enlace de la tienda copiado");
  }}
>
  <Share2 size={18} />
  Compartir
</button>
{isAuthenticated && (
  <button
    className="btn primary"
    onClick={() => alert("Primero confirma un pedido para generar folio y solicitud.")}
  >
    <ReceiptText size={18} /> Solicitar comprobante/factura
  </button>
)}      </div>

      <section className="section">
  <h2 id="catalogo">Catálogo</h2>

  <div className="catalog-grid">
    {business.items.map((item) => (
      <ProductCard
        key={item.id}
        item={item}
        onSelect={selectItem}
      />
    ))}
  </div>
</section>

      <section className="section">
        <h2>Resenas</h2>
        {reviewConfirmed && <ConfirmationPanel title="Resena publicada" message="Gracias, tu resena quedo registrada en esta tienda." detailTo={`/tienda/${business.id}`} onBack={() => setReviewConfirmed(false)} />}
        <div className="reviews-grid">{business.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
        <div className="review-form card">
          <textarea placeholder="Deja una resena para esta tienda" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
          <button className="btn primary" onClick={saveReview}>Dejar resena</button>
        </div>
      </section>
    </div>
  );
}
