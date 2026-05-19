import { businesses } from "../data/mockData";
import type { Business, Order, Review } from "../types";

const keys = {
  businesses: "ctrl-she-businesses",
  orders: "ctrl-she-orders"
};

export function getBusinesses(): Business[] {
  const saved = localStorage.getItem(keys.businesses);
  return saved ? JSON.parse(saved) : businesses;
}

export function saveBusinesses(value: Business[]) {
  localStorage.setItem(keys.businesses, JSON.stringify(value));
}

export function resetDemoData() {
  localStorage.removeItem(keys.businesses);
  localStorage.removeItem(keys.orders);
}

export function getOrders(): Order[] {
  return JSON.parse(localStorage.getItem(keys.orders) || "[]");
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(keys.orders, JSON.stringify(orders));
}

export function saveOrder(order: Order) {
  localStorage.setItem(keys.orders, JSON.stringify([order, ...getOrders()]));
}

export function updateOrderStatus(folio: string, status: Order["status"]) {
  const updated = getOrders().map((order) => order.folio === folio ? { ...order, status } : order);
  saveOrders(updated);
  return updated;
}

export function addReview(businessId: string, review: Review) {
  const updated = getBusinesses().map((business) =>
    business.id === businessId ? { ...business, reviews: [review, ...business.reviews] } : business
  );
  saveBusinesses(updated);
  return updated.find((business) => business.id === businessId);
}

export function money(value: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
}

export function makeFolio() {
  const next = getOrders().length + 1;
  return `CTRL-2026-${String(next).padStart(4, "0")}`;
}
