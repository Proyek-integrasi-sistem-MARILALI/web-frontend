import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function LoginAcc() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // ⬅️ INI YANG KEMARIN HILANG

  const handleLogin = () => {
    if (!username || !password) return;

    // 🔐 SIMULASI LOGIN (nanti ganti API)
    login({
      name: username,
      token: "dummy-token",
    });

    navigate("/", { replace: true });
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl flex overflow-hidden max-w-4xl w-full">

        {/* LEFT IMAGE */}
        <div className="w-1/2 flex items-center justify-center p-6">
          <img src={logo} alt="Logo" className="w-80 h-auto" />
        </div>

        {/* RIGHT FORM */}
        <div className="w-1/2 p-10 flex flex-col">
          <h2 className="text-3xl font-bold text-center text-[#00A5D9]">
            Login
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Login to your account
          </p>

          {/* USERNAME */}
          <label className="text-lg mb-1 font-medium">
            Email / Username
          </label>
          <div className="flex items-center border rounded-xl p-3 mb-6 bg-white shadow-sm">
            <FaUser className="text-gray-500 text-xl mr-3" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full outline-none text-gray-800"
            />
          </div>

          {/* PASSWORD */}
          <label className="text-lg mb-1 font-medium">
            Password
          </label>
          <div className="flex items-center border rounded-xl p-3 mb-6 bg-white shadow-sm">
            <FaLock className="text-gray-500 text-xl mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none text-gray-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="text-xl text-gray-600" />
              ) : (
                <AiOutlineEye className="text-xl text-gray-600" />
              )}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={!isFormValid}
            className={`w-full font-semibold py-3 rounded-xl text-lg mt-2 transition
              ${
                isFormValid
                  ? "bg-[#00A5D9] text-white hover:bg-sky-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Login
          </button>

          {/* ===== SIGNUP (INI YANG KAMU MINTA) ===== */}
          <p className="text-center text-gray-600 mt-5">
            Didn’t have an account?
          </p>

          <button
            onClick={handleSignUp}
            className="w-full border border-[#00A5D9] text-[#00A5D9] font-semibold py-3 rounded-xl mt-2 hover:bg-sky-50"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
