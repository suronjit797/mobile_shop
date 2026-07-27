import { App as AntApp, ConfigProvider, Spin } from "antd";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminCategory from "./admin/category/AdminCategory";
import AdminLayout from "./components/layout/AdminLayout";
import SellerLayout from "./components/layout/SellerLayout";
import { UserRole } from "./interfaces/userInterface";
import PrivateRoute from "./routes/privateRoutes";
import PublicRoute from "./routes/publicRoutes";
import RoleRoute from "./routes/roleRoutes";

// Lazy loaded pages
const HomePage = lazy(() => import("./pages/Home/HomePage"));
const ProductListPage = lazy(() => import("./pages/Products/ProductListPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetails/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/Cart/CartPage"));
const WishlistPage = lazy(() => import("./pages/Wishlist/WishlistPage"));
const CheckoutPage = lazy(() => import("./pages/Checkout/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Register/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/Orders/OrdersPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
const AdminDashboard = lazy(() => import("./admin/dashboard/AdminDashboard"));
const AdminProducts = lazy(() => import("./admin/products/AdminProducts"));
const AdminOrders = lazy(() => import("./admin/orders/AdminOrders"));
const AdminUsers = lazy(() => import("./admin/users/AdminUsers"));

// Seller pages
const SellerDashboard = lazy(() => import("./seller/dashboard/SellerDashboard"));
const SellerOrders = lazy(() => import("./seller/orders/SellerOrders"));

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" />
  </div>
);

const antdTheme = {
  token: {
    colorPrimary: "#6366F1",
    colorSuccess: "#22C55E",
    colorWarning: "#F59E0B",
    colorError: "#EF4444",
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
};

const App = () => (
  <ConfigProvider theme={antdTheme}>
    <AntApp>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Auth routes (redirect if logged in) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes (must be logged in) */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<RoleRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers role={UserRole.USER} />} />
                <Route path="/admin/categories" element={<AdminCategory />} />
                <Route path="/admin/sellers" element={<AdminUsers role={UserRole.SELLER} />} />
                <Route path="/admin/analytics" element={<div>Analytics Dashboard</div>} />
              </Route>
            </Route>

            {/* Seller routes */}
            <Route element={<RoleRoute allowedRoles={[UserRole.SELLER]} />}>
              <Route element={<SellerLayout />}>
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/seller/products" element={<AdminProducts />} />
                <Route path="/seller/orders" element={<SellerOrders />} />
                <Route path="/seller/inventory" element={<div>Inventory Management</div>} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AntApp>
  </ConfigProvider>
);

export default App;
