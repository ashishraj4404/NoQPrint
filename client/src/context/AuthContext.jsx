import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate;  
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };
  const value = { user, setUser, isAdmin, setIsAdmin , navigate};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);