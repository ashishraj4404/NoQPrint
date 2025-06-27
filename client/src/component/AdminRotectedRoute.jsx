import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";

const AdminProtectedRoute = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const token = await getToken();
          const res = await axios.get("http://localhost:8000/api/user/role", {
            params: { email: user.primaryEmailAddress.emailAddress },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.data.role === "admin") {
            setIsAdmin(true);
          } else {
            navigate("/auth");
          }
        } catch (err) {
          console.error("Admin check failed:", err);
          navigate("/auth");
        }
      } else if (isLoaded && !isSignedIn) {
        navigate("/auth", { replace: true });
      }
    };

    checkAdmin();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || isAdmin === null)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PulseLoader color="#3B82F6" size={40} />
      </div>
    );
  if (!isAdmin) return null;

  return children;
};

export default AdminProtectedRoute;
