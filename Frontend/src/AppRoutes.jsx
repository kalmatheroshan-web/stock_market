import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import "./app.css";
import StockDetails from "./pages/StockDetails";
import SignUp from "./pages/signup";
import OtpVerify from "./components/Auth/OtpVerify";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import About from "./pages/About";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/about" element={<About />} />
      <Route path="/portfolio" element={<Portfolio />} />
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