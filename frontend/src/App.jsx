import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/AuthPage/Register";
import Login from "./pages/AuthPage/Login";
import ForgotPassword from "./pages/AuthPage/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
