import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignUp = async () => {
    // Validation
    if (!email || !username || !password || !repeatPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await register(email, username, password);
      
      if (result.success) {
        // Registration successful, redirect to home
        navigate("/", { replace: true });
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const isFormValid = email && username && password && repeatPassword && password === repeatPassword;


  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl flex overflow-hidden max-w-4xl w-full">

        {/* LEFT LOGO */}
        <div className="w-1/2 flex items-center justify-center p-6">
          <img src={logo} alt="Logo" className="w-80 object-contain" />
        </div>

        {/* RIGHT FORM */}
        <div className="w-1/2 p-10 flex flex-col">
          <h2 className="text-3xl font-bold text-center text-[#00A5D9] mb-4">
            Signup
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Create your new account
          </p>

          {/* EMAIL */}
          <label className="text-lg mb-1 font-medium">Email</label>
          <div className="flex items-center border rounded-xl p-3 mb-6 bg-white shadow-sm">
            <FaEnvelope className="text-gray-500 text-xl mr-3" />
            <input 
              type="email" 
              placeholder="Email@user.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none" 
            />
          </div>

          {/* USERNAME */}
          <label className="text-lg mb-1 font-medium">Username</label>
          <div className="flex items-center border rounded-xl p-3 mb-6 bg-white shadow-sm">
            <FaUser className="text-gray-500 text-xl mr-3" />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full outline-none" 
            />
          </div>

          {/* PASSWORD */}
          <label className="text-lg mb-1 font-medium">Password</label>
          <div className="flex items-center border rounded-xl p-3 mb-6 bg-white shadow-sm">
            <FaLock className="text-gray-500 text-xl mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none"
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <AiOutlineEyeInvisible className="text-xl text-gray-600" />
              ) : (
                <AiOutlineEye className="text-xl text-gray-600" />
              )}
            </button>
          </div>

          {/* REPEAT PASSWORD */}
          <label className="text-lg mb-1 font-medium">Repeat Password</label>
          <div className="flex items-center border rounded-xl p-3 mb-6 bg-white shadow-sm">
            <FaLock className="text-gray-500 text-xl mr-3" />
            <input
              type={showRepeatPassword ? "text" : "password"}
              placeholder="Repeat Password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full outline-none"
            />
            <button onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
              {showRepeatPassword ? (
                <AiOutlineEyeInvisible className="text-xl text-gray-600" />
              ) : (
                <AiOutlineEye className="text-xl text-gray-600" />
              )}
            </button>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* SIGNUP BUTTON */}
          <button
            onClick={handleSignUp}
            disabled={!isFormValid || loading}
            className={`w-full font-semibold py-3 rounded-xl text-lg mt-2 transition
              ${
                isFormValid && !loading
                  ? "bg-[#00A5D9] text-white hover:bg-sky-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {loading ? "Creating account..." : "Signup"}
          </button>

          <p className="text-center text-gray-600 mt-5">Already have an account?</p>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            className="w-full border border-[#00A5D9] text-[#00A5D9] font-semibold py-3 rounded-xl mt-2"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
