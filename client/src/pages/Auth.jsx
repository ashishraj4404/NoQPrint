import { useState } from "react";
import StudentLogin from "./StudentLogin";
import StudentSignup from "./StudentSignup";
import AdminLogin from "./AdminLogin";

const Auth = () => {
  const [role, setRole] = useState("student");
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          {role === "admin"
            ? "Admin Login"
            : isLogin === true
            ? "Student Login"
            : "Student Signup"}
        </h1>
        <div className="mb-8 flex justify-center space-x-4">
          <button
            onClick={() => setRole("student")}
            className={`px-6 py-2 rounded-full transition duration-300 ${
              role === "student"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => {
              setRole("admin");
              setIsLogin(true);
            }}
            className={`px-6 py-2 rounded-full transition duration-300 ${
              role === "admin"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Admin
          </button>
        </div>
        {role === "admin" ? (
          <AdminLogin />
        ) : isLogin === true ? (
          <StudentLogin setIsLogin={setIsLogin} />
        ) : (
          <StudentSignup setIsLogin={setIsLogin} />
        )}
      </div>
    </main>
  );
};

export default Auth;
