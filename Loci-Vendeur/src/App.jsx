import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import RegisterRetail from "./pages/RegisterRetail";
import RegisterWholesale from "./pages/RegisterWholesale";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import ReceiptPage from "./pages/ReceiptPage";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import OrderDetailPage from "./pages/OrderDetailPage";
import WholesaleMarket from "./pages/WholesaleMarket";
import WholesaleCheckout from "./pages/WholesaleCheckout";
import WholesaleSuccess from "./pages/WholesaleSuccess";
import WholesaleTrack from "./pages/WholesaleTrack";
import WholesaleDashboard from "./wholesale-pages/WholesaleDashboard";
import WholesaleOrders from "./wholesale-pages/WholesaleOrders";
import WholesaleInventory from "./wholesale-pages/WholesaleInventory";
import WholesaleAnalytics from "./wholesale-pages/WholesaleAnalytics";
import WholesaleProfile from "./wholesale-pages/WholesaleProfile";
import AdminDashboard from "./adminpage/AdminDashboard";
import Usermanagement from "./adminpage/Usermanagement";
import OrderManagementPage from "./adminpage/OrderManagementPage";
import EscrowPage from "./adminpage/EscrowPage";
import InventoryPage from "./adminpage/InventoryPage";
import DisputesPage from "./adminpage/DisputesPage";
import AnalyticsPage from "./adminpage/AnalyticsPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="page p-4 md:p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const RoleRoute = ({ allowedRoles = [] }) => {
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "wholesaler") return <Navigate to="/wholesaler/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<SelectRole />} />
      <Route path="/register/retailer" element={<RegisterRetail />} />
      <Route path="/register/wholesaler" element={<RegisterWholesale />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route element={<RoleRoute allowedRoles={["retailer"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wholesale" element={<WholesaleMarket />} />
            <Route path="/wholesale/checkout" element={<WholesaleCheckout />} />
            <Route path="/wholesale/success/:id" element={<WholesaleSuccess />} />
            <Route path="/wholesale/track/:id" element={<WholesaleTrack />} />
            <Route path="/receipt/:id" element={<ReceiptPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["wholesaler"]} />}>
            <Route path="/wholesaler/dashboard" element={<WholesaleDashboard />} />
            <Route path="/wholesaler/orders" element={<WholesaleOrders />} />
            <Route path="/wholesaler/inventory" element={<WholesaleInventory />} />
            <Route path="/wholesaler/analytics" element={<WholesaleAnalytics />} />
            <Route path="/wholesaler/profile" element={<WholesaleProfile />} />
          </Route>

          <Route path="/orders/:id" element={<OrderDetailPage />} />

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Usermanagement />} />
            <Route path="/admin/orders" element={<OrderManagementPage />} />
            <Route path="/admin/escrow" element={<EscrowPage />} />
            <Route path="/admin/inventory" element={<InventoryPage />} />
            <Route path="/admin/disputes" element={<DisputesPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
