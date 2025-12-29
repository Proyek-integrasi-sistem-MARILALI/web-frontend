import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [name] = useState("Dave");
  const [email] = useState("dave@gmail.com");
  const [photo, setPhoto] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ⬅️ modal state

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleDeletePhoto = () => setPhoto(null);

  // ✅ CONFIRM LOGOUT
  const confirmLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col items-center py-10 px-4">

        {/* MAIN CONTENT */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">

          {/* PHOTO */}
          <div className="flex justify-center w-full md:w-1/3">
            <div className="w-60 h-60 bg-gray-300 rounded-full overflow-hidden">
              {photo && (
                <img
                  src={photo}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* FORM */}
          <div className="flex-1 w-full">
            <input
              type="text"
              value={name}
              readOnly
              className="w-full border rounded-lg px-4 py-3 mb-4"
            />

            <input
              type="email"
              value={email}
              readOnly
              className="w-full border rounded-lg px-4 py-3 mb-6"
            />

            <div className="flex flex-wrap gap-4">
              <button className="bg-sky-600 text-white px-6 py-2 rounded-lg">
                Ganti Password
              </button>

              <label
                htmlFor="fileInput"
                className="bg-sky-600 text-white px-6 py-2 rounded-lg cursor-pointer"
              >
                Ganti Foto
              </label>

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />

              <button
                onClick={handleDeletePhoto}
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                Hapus Foto
              </button>

              {/* 🔴 LOGOUT BUTTON */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* LANGUAGE */}
        <div className="w-full max-w-5xl border rounded-xl p-6 mt-12 flex justify-between">
          <span className="text-xl font-semibold">🌐 Language</span>
          <select className="border rounded-lg px-4 py-2">
            <option>English</option>
            <option>Bahasa Indonesia</option>
          </select>
        </div>
      </div>

      {/* ✅ LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30
 backdrop-blur-sm
 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">
              Logout Confirmation
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
