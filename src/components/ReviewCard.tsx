import { Star } from "lucide-react";
import type { Review } from "../types";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review-card">
      <div className="review-card-header">
        <strong>{review.author}</strong>
        <span className="review-stars" aria-label={`${review.rating} de 5 estrellas`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} size={15} fill={index < review.rating ? "currentColor" : "none"} />
          ))}
        </span>
      </div>
      <p>{review.text}</p>
    </article>
  );
}
