import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import Auth from "./pages/Auth";
import AdminLayout from "./pages/admin/AdminLayout";
import MyCoins from "./pages/MyCoins";

import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminProtectedRoute from "./component/AdminRotectedRoute";

const App = () => {
  const location = useLocation();
  const hideLayout = ["/auth", "/admin"].includes(location.pathname);
  return (
    <div>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/orderconfirm" element={<OrderConfirmation />} />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/my-coins"
          element={
            <ProtectedRoute>
              <MyCoins />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
