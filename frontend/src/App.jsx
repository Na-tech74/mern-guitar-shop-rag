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
import NotFound from "./pages/NotFoundPage/NotFound";
import Dashboard from "./pages/AdminPage/ui/Dashboard";
import Products from "./pages/AdminPage/ui/Products";
import Orders from "./pages/AdminPage/ui/Orders";
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
          <Route path="about" element={<div className="py-16 text-center">Trang giới thiệu</div>} />
          <Route path="contact" element={<div className="py-16 text-center">Trang liên hệ</div>} />
          <Route path="faq" element={<div className="py-16 text-center">Câu hỏi thường gặp</div>} />
          <Route path="shipping" element={<div className="py-16 text-center">Chính sách giao hàng</div>} />
          <Route path="return" element={<div className="py-16 text-center">Chính sách đổi trả</div>} />
          <Route path="warranty" element={<div className="py-16 text-center">Bảo hành sản phẩm</div>} />
          <Route path="privacy" element={<div className="py-16 text-center">Chính sách bảo mật</div>} />
          <Route path="terms" element={<div className="py-16 text-center">Điều khoản sử dụng</div>} />
          <Route path="search" element={<div className="py-16 text-center">Tìm kiếm</div>} />
          <Route path="cart" element={<div className="py-16 text-center">Giỏ hàng</div>} />
          <Route path="wishlist" element={<div className="py-16 text-center">Danh sách yêu thích</div>} />
          <Route path="account" element={<div className="py-16 text-center">Tài khoản</div>} />
          <Route path="orders" element={<div className="py-16 text-center">Đơn hàng</div>} />
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
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
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