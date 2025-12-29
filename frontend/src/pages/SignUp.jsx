import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/login");
  };

    const handleLogin = () => {
    navigate("/login");
  };


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
            <input type="email" placeholder="Email@user.com" className="w-full outline-none" />
          </div>

          {/* USERNAME */}
          <label className="text-lg mb-1 font-medium">Username</label>
          <div className="flex items-center border rounded-xl p-3 mb-6 bg-white shadow-sm">
            <FaUser className="text-gray-500 text-xl mr-3" />
            <input type="text" placeholder="Username" className="w-full outline-none" />
          </div>

          {/* PASSWORD */}
          <label className="text-lg mb-1 font-medium">Password</label>
          <div className="flex items-center border rounded-xl p-3 mb-6 bg-white shadow-sm">
            <FaLock className="text-gray-500 text-xl mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

          {/* SIGNUP BUTTON */}
          <button
            onClick={handleSignUp}
            className="w-full bg-[#00A5D9] text-white font-semibold py-3 rounded-xl text-lg mt-2"
          >
            Signup
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
