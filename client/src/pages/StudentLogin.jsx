import { useSignIn, useUser, useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentLogin = ({ setIsLogin }) => {
  const { signIn, setActive } = useSignIn();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      navigate("/");
    } catch (err) {
      console.error("Clerk sign-in error:", err); 

    const message = err?.errors?.[0]?.message;

    if (message) {
      setError(message);
    } else {
      setError("Something went wrong during sign in.");
    }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <form  className="space-y-6" onSubmit={handleSignIn}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-transparent text-lg outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input
              required
              name="password"
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
          className="w-full rounded-lg bg-blue-500 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a className="text-blue-500 hover:text-blue-600 cursor-pointer" onClick={() => setIsLogin(false)}
          >
            Sign up
          </a>
        </p>
      </form>
  );
};

export default StudentLogin;
