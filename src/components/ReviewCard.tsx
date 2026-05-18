import { Star } from "lucide-react";
import type { Review } from "../types";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review-card">
      <strong>{review.author}</strong>
      <span><Star size={14} fill="currentColor" /> {review.rating}</span>
      <p>{review.text}</p>
    </article>
  );
}
