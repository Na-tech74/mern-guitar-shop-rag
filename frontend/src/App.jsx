import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/AuthPage/Register";
import Login from "./pages/AuthPage/Login";
import ForgotPassword from "./pages/AuthPage/ForgotPassword";
import Dashboard from "./pages/AdminPage/Dashboard";
import Products from "./pages/AdminPage/Products";
import Orders from "./pages/AdminPage/Orders";
import Users from "./pages/AdminPage/Users";
import Categories from "./pages/AdminPage/Categories";
import Settings from "./pages/AdminPage/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
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
