import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const roleRes = await axios.get(
        `http://localhost:8000/api/user/role?email=${email}`
      );
      const userRole = roleRes.data.role;
      if (userRole !== "admin") {
        setError("Access denied. You are not an admin.");
        setLoading(false);
        return;
      }
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.errors?.[0]?.message ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleAdminSignIn}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your admin email"
            className="w-full bg-transparent text-lg outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-transparent text-lg outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-500 px-4 py-3 text-base font-medium text-white hover:bg-blue-600"
      >
        {loading ? "Checking..." : "Sign In"}
      </button>
    </form>
  );
};

export default AdminLogin;
