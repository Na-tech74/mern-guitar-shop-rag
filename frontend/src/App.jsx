import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { DialogProvider } from "./components/MessageDialog";
import useSessionRecovery from "./hooks/useSessionRecovery";

const Login = lazy(() => import("./pages/AuthPage/Login"));
const Register = lazy(() => import("./pages/AuthPage/Register"));
const ForgotPassword = lazy(() => import("./pages/AuthPage/ForgotPassword"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductsPage/ProductDetailPage"));
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
const Dashboard = lazy(() => import("./pages/AdminPage/Dashboard"));
const AdminProducts = lazy(() => import("./pages/AdminPage/Products"));
const AdminOrders = lazy(() => import("./pages/AdminPage/Orders"));
const AdminCourses = lazy(() => import("./pages/AdminPage/Courses"));
const Users = lazy(() => import("./pages/AdminPage/Users"));
const Categories = lazy(() => import("./pages/AdminPage/Categories"));
const Settings = lazy(() => import("./pages/AdminPage/Settings"));
const Blog = lazy(() => import("./pages/AdminPage/Blog"));
const HomeContent = lazy(() => import("./pages/AdminPage/HomeContent"));
const AboutContent = lazy(() => import("./pages/AdminPage/AboutContent"));
const FooterContent = lazy(() => import("./pages/AdminPage/FooterContent"));
const ContactContent = lazy(() => import("./pages/AdminPage/ContactContent"));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full size-12 border-b-2 border-amber-500" />
    </div>
  );
}

function AppRoutes() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      const raw = sessionStorage.getItem("userInfo");
      if (!raw) return;
      try {
        const user = JSON.parse(raw);
        if (user.role === "admin" && location.pathname === "/") {
          navigate("/admin", { replace: true });
        }
      } catch {}
    }, []);

    return (
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
            <Route path="home-content" element={<HomeContent />} />
            <Route path="about-content" element={<AboutContent />} />
            <Route path="footer-content" element={<FooterContent />} />
            <Route path="contact-content" element={<ContactContent />} />
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
    );
}

function App() {
    useSessionRecovery();
    return (
      <BrowserRouter>
      <DialogProvider>
      <Suspense fallback={<LoadingFallback />}>
        <AppRoutes />
      </Suspense>
      </DialogProvider>
    </BrowserRouter>
  );
}

export default App