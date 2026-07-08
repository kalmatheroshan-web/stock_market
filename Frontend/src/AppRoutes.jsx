import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import "./app.css";
import StockDetails from "./pages/StockDetails";
import SignUp from "./pages/signup";
import OtpVerify from "./components/Auth/OtpVerify";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/stockdetails" element={<StockDetails />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/otp-verify"
        element={<OtpVerify />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}