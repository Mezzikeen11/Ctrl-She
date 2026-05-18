import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import MarketplacePage from "./pages/MarketplacePage";
import StoreProfilePage from "./pages/StoreProfilePage";
import OrderPage from "./pages/OrderPage";
import ReceiptPage from "./pages/ReceiptPage";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LocalRoutePage from "./pages/LocalRoutePage";
import AiPage from "./pages/AiPage";
import LoginPage from "./pages/LoginPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import OrdersManagementPage from "./pages/OrdersManagementPage";
import QRPage from "./pages/QRPage";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/explorar" element={<MarketplacePage />} />
          <Route path="/tienda/:id" element={<StoreProfilePage />} />
          <Route path="/pedido" element={<OrderPage />} />
          <Route path="/comprobante/:folio" element={<ReceiptPage />} />
          <Route path="/mis-pedidos" element={<MyOrdersPage />} />
          <Route path="/emprendedora" element={<ProtectedRoute roles={["emprendedora"]}><EntrepreneurDashboard /></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute roles={["emprendedora"]}><OrdersManagementPage /></ProtectedRoute>} />
          <Route path="/qr" element={<ProtectedRoute roles={["emprendedora"]}><QRPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/validaciones" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/metricas" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/negocios" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/ruta-local" element={<LocalRoutePage />} />
          <Route path="/ia" element={<ProtectedRoute roles={["emprendedora", "admin"]}><AiPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="footer">Ctrl + She · Controla, conecta y crece · Prototipo frontend sin backend ni pagos reales.</footer>
    </>
  );
}
