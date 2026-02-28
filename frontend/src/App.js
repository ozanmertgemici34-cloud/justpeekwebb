import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PurchaseHistory from "./pages/PurchaseHistory";
import PurchaseRequest from "./pages/PurchaseRequest";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/purchases" element={<PurchaseHistory />} />
              <Route path="/purchase-request" element={<PurchaseRequest />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
