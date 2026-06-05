import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import useSessionRecovery from "./hooks/useSessionRecovery";

const Login = lazy(() => import("./pages/AuthPage/ui/Login"));
const Register = lazy(() => import("./pages/AuthPage/ui/Register"));
const ForgotPassword = lazy(() => import("./pages/AuthPage/ui/ForgotPassword"));
const HomePage = lazy(() => import("./pages/HomePage/ui/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage/ui/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductsPage/ui/ProductDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogPage/BlogDetailPage"));
const ContactPage = lazy(() => import("./pages/ContactPage/ContactPage"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CartPage/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/CartPage/OrderSuccessPage"));
const SearchPage = lazy(() => import("./pages/SearchPage/SearchPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage/WishlistPage"));
const AccountPage = lazy(() => import("./pages/AccountPage/AccountPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage/OrdersPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage/CoursesPage"));
const CourseDetailPage = lazy(() => import("./pages/CoursesPage/CourseDetailPage"));
const NotFound = lazy(() => import("./pages/NotFoundPage/NotFound"));
const Dashboard = lazy(() => import("./pages/AdminPage/ui/Dashboard"));
const AdminProducts = lazy(() => import("./pages/AdminPage/ui/Products"));
const AdminOrders = lazy(() => import("./pages/AdminPage/ui/Orders"));
const AdminCourses = lazy(() => import("./pages/AdminPage/ui/Courses"));
const Users = lazy(() => import("./pages/AdminPage/ui/Users"));
const Categories = lazy(() => import("./pages/AdminPage/ui/Categories"));
const Settings = lazy(() => import("./pages/AdminPage/ui/Settings"));
const Blog = lazy(() => import("./pages/AdminPage/ui/Blog"));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full size-12 border-b-2 border-amber-600" />
    </div>
  );
}

function App() {
    useSessionRecovery();
    return (
        <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:id" element={<BlogDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="tim-kiem" element={<SearchPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:slug" element={<CourseDetailPage />} />
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
              <Route path="courses" element={<AdminCourses />} />
              <Route path="blog" element={<Blog />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App