import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/auth", {
        replace: true,
      });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded)
    return (
      <div>
        <div className="min-h-screen flex items-center justify-center">
          <PulseLoader color="#3B82F6" size={40} />
        </div>
      </div>
    );
  if (!isSignedIn) return null;

  return children;
};

export default ProtectedRoute;
