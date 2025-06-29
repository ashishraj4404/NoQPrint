import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const StudentSignup = ({ setIsLogin }) => {
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      const clerkError = err?.errors?.[0];
      if (clerkError?.code === "form_identifier_exists") {
        setError("An account with this email already exists. Try signing in.");
      } else {
        setError(clerkError?.message || "Sign up failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: result.createdSessionId });
      const newUser = {
        clerkUserId: result.createdUserId,
        name: name,
        email: email,
        role: "user",
      };
      await axios
        .post(`${API_URL}/api/user`, newUser)
        .then(() => navigate("/"))
        .catch((err) => console.log(err));
    } catch (err) {
      const msg = err?.errors?.[0]?.message || "Invalid verification code.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={pendingVerification ? handleVerifyCode : handleSignUp}
    >
      {!pendingVerification ? (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                required
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-transparent text-lg outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
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
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set your password"
                className="w-full bg-transparent text-lg outline-none"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <label className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input
              required
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the 6-digit code from your email"
              className="w-full bg-transparent text-lg outline-none"
            />
          </div>
        </>
      )}

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
        {loading
          ? "Processing..."
          : pendingVerification
          ? "Verify Email"
          : "Sign Up"}
      </button>

      {!pendingVerification && (
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
            onClick={() => setIsLogin(true)}
          >
            Sign in
          </span>
        </p>
      )}
    </form>
  );
};

export default StudentSignup;
