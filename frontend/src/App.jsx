import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/AuthPage/ui/Login";
import Register from "./pages/AuthPage/ui/Register";
import ForgotPassword from "./pages/AuthPage/ui/ForgotPassword";
import HomePage from "./pages/HomePage/ui/HomePage";
import Dashboard from "./pages/AdminPage/ui/Dashboard";
import Products from "./pages/AdminPage/ui/Products";
import Orders from "./pages/AdminPage/ui/Orders";
import Users from "./pages/AdminPage/ui/Users";
import Categories from "./pages/AdminPage/ui/Categories";
import Settings from "./pages/AdminPage/ui/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App