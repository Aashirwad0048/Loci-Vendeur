import { lazy, Suspense } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

const Login = lazy(() => import("./pages/Login"));
const SelectRole = lazy(() => import("./pages/SelectRole"));
const RegisterRetail = lazy(() => import("./pages/RegisterRetail"));
const RegisterWholesale = lazy(() => import("./pages/RegisterWholesale"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Billing = lazy(() => import("./pages/Billing"));
const ReceiptPage = lazy(() => import("./pages/ReceiptPage"));
const History = lazy(() => import("./pages/History"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const WholesaleMarket = lazy(() => import("./pages/WholesaleMarket"));
const WholesaleCheckout = lazy(() => import("./pages/WholesaleCheckout"));
const WholesaleSuccess = lazy(() => import("./pages/WholesaleSuccess"));
const WholesaleTrack = lazy(() => import("./pages/WholesaleTrack"));
const WholesaleDashboard = lazy(() => import("./wholesale-pages/WholesaleDashboard"));
const WholesaleOrders = lazy(() => import("./wholesale-pages/WholesaleOrders"));
const WholesaleInventory = lazy(() => import("./wholesale-pages/WholesaleInventory"));
const WholesaleAnalytics = lazy(() => import("./wholesale-pages/WholesaleAnalytics"));
const WholesaleProfile = lazy(() => import("./wholesale-pages/WholesaleProfile"));
const AdminDashboard = lazy(() => import("./adminpage/AdminDashboard"));
const Usermanagement = lazy(() => import("./adminpage/Usermanagement"));
const OrderManagementPage = lazy(() => import("./adminpage/OrderManagementPage"));
const EscrowPage = lazy(() => import("./adminpage/EscrowPage"));
const InventoryPage = lazy(() => import("./adminpage/InventoryPage"));
const DisputesPage = lazy(() => import("./adminpage/DisputesPage"));
const AnalyticsPage = lazy(() => import("./adminpage/AnalyticsPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

function RouteLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm font-semibold text-gray-500">
      Loading page...
    </div>
  );
}

function renderLazyPage(element) {
  return (
    <Suspense fallback={<RouteLoader />}>
      {element}
    </Suspense>
  );
}

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
      <Route path="/" element={renderLazyPage(<Login />)} />
      <Route path="/register" element={renderLazyPage(<SelectRole />)} />
      <Route path="/register/retailer" element={renderLazyPage(<RegisterRetail />)} />
      <Route path="/register/wholesaler" element={renderLazyPage(<RegisterWholesale />)} />
      <Route path="/forgot-password" element={renderLazyPage(<ForgotPassword />)} />
      <Route path="/reset-password/:token" element={renderLazyPage(<ResetPassword />)} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route element={<RoleRoute allowedRoles={["retailer"]} />}>
            <Route path="/dashboard" element={renderLazyPage(<Dashboard />)} />
            <Route path="/products" element={renderLazyPage(<Products />)} />
            <Route path="/billing" element={renderLazyPage(<Billing />)} />
            <Route path="/history" element={renderLazyPage(<History />)} />
            <Route path="/profile" element={renderLazyPage(<Profile />)} />
            <Route path="/wholesale" element={renderLazyPage(<WholesaleMarket />)} />
            <Route path="/wholesale/checkout" element={renderLazyPage(<WholesaleCheckout />)} />
            <Route path="/wholesale/success/:id" element={renderLazyPage(<WholesaleSuccess />)} />
            <Route path="/wholesale/track/:id" element={renderLazyPage(<WholesaleTrack />)} />
            <Route path="/receipt/:id" element={renderLazyPage(<ReceiptPage />)} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["wholesaler"]} />}>
            <Route path="/wholesaler/dashboard" element={renderLazyPage(<WholesaleDashboard />)} />
            <Route path="/wholesaler/orders" element={renderLazyPage(<WholesaleOrders />)} />
            <Route path="/wholesaler/inventory" element={renderLazyPage(<WholesaleInventory />)} />
            <Route path="/wholesaler/analytics" element={renderLazyPage(<WholesaleAnalytics />)} />
            <Route path="/wholesaler/profile" element={renderLazyPage(<WholesaleProfile />)} />
          </Route>

          <Route path="/orders/:id" element={renderLazyPage(<OrderDetailPage />)} />

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={renderLazyPage(<AdminDashboard />)} />
            <Route path="/admin/users" element={renderLazyPage(<Usermanagement />)} />
            <Route path="/admin/orders" element={renderLazyPage(<OrderManagementPage />)} />
            <Route path="/admin/escrow" element={renderLazyPage(<EscrowPage />)} />
            <Route path="/admin/inventory" element={renderLazyPage(<InventoryPage />)} />
            <Route path="/admin/disputes" element={renderLazyPage(<DisputesPage />)} />
            <Route path="/admin/analytics" element={renderLazyPage(<AnalyticsPage />)} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={renderLazyPage(<NotFound />)} />
    </Routes>
  );
}

export default App;
