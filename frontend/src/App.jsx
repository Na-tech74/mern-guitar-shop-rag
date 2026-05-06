import { BrowserRouter, Routes, Route } from "react-router-dom";
//import layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
//import components
import ProtectedRoute from "./components/ProtectedRoute";
//import pages
import Register from "./pages/AuthPage/Register";
import Login from "./pages/AuthPage/Login";
import ForgotPassword from "./pages/AuthPage/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={
          <ProtectedRoute roleRequired="admin">
            <AuthLayout />
          </ProtectedRoute>
        } />
        <Route path="/" element={<MainLayout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
