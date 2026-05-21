import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/AuthPage/ui/Login";
import Register from "./pages/AuthPage/ui/Register";
import ForgotPassword from "./pages/AuthPage/ui/ForgotPassword";
import HomePage from "./pages/HomePage/ui/HomePage";
import ProductsPage from "./pages/ProductsPage/ui/ProductsPage";
import ProductDetailPage from "./pages/ProductsPage/ui/ProductDetailPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import CartPage from "./pages/CartPage/CartPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import WishlistPage from "./pages/WishlistPage/WishlistPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import NotFound from "./pages/NotFoundPage/NotFound";
import Dashboard from "./pages/AdminPage/ui/Dashboard";
import AdminProducts from "./pages/AdminPage/ui/Products";
import AdminOrders from "./pages/AdminPage/ui/Orders";
import Users from "./pages/AdminPage/ui/Users";
import Categories from "./pages/AdminPage/ui/Categories";
import Settings from "./pages/AdminPage/ui/Settings";
import Blog from "./pages/AdminPage/ui/Blog";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="tim-kiem" element={<SearchPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/admin" element={
          <ProtectedRoute roleRequired="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
            <Route path="blog" element={<Blog />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App