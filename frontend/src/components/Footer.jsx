import { useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <footer className="w-full bg-[#005783] text-white py-12 px-6">
      <div
        className="
          max-w-7xl mx-auto
          grid grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]
          gap-8
          items-start
        "
      >
        {/* LOGO + CONTACT */}
        <div className="h-full flex flex-col space-y-4 text-center sm:text-left">
          <img
            src={logo}
            alt="Marilali Logo"
            className="h-10 w-auto "
          />

          <div className="space-y-3 text-sm">
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <MdEmail /> marilali@gmail.com
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <FaWhatsapp /> +62 123 456 789
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <FaFacebook /> Facebook
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <FaInstagram /> Instagram
            </p>
          </div>
        </div>

        {/* HOME */}
        <div className="h-full flex flex-col text-center sm:text-left">
          <h3 className="text-lg font-semibold mb-6">Home</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">Landing</li>
          </ul>
        </div>

        {/* EXPLORER */}
        <div className="h-full flex flex-col text-center sm:text-left">
          <h3 className="text-lg font-semibold mb-6">Explorer</h3>
          <ul className="space-y-2 text-sm">
            <li>Area</li>
            <li>Categories</li>
            <li>Browser</li>
          </ul>
        </div>

        {/* PLANNER */}
        <div className="h-full flex flex-col text-center sm:text-left">
          <h3 className="text-lg font-semibold mb-6">Planner</h3>
          <ul className="space-y-2 text-sm">
            <li>List Planner</li>
            <li>Add Plan</li>
          </ul>
        </div>

        {/* PROFILE */}
        <div className="h-full flex flex-col text-center sm:text-left">
          <h3 className="text-lg font-semibold mb-6">Profile</h3>
          <ul className="space-y-2 text-sm">
            <li>My Account</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </div>

        {/* BUTTON */}
        <div className="h-full flex flex-col justify-start items-center sm:items-start">
          <button
            onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
            className="
              bg-white text-[#005783]
              text-sm font-semibold
              px-6 py-2
              rounded-md shadow
              hover:bg-gray-100 duration-200
              w-full sm:w-auto
            "
          >
            {isLoggedIn ? "My Profile" : "Register"}
          </button>
        </div>
      </div>
    </footer>
  );
}
