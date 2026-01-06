import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/api.service";
import UserAvatar from "../components/UserAvatar";

export default function Profile() {
  const [photo, setPhoto] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const { user, logout, loading, refreshUser } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Load user profile picture
  useEffect(() => {
    if (user?.profile_picture) {
      setPhoto(user.profile_picture);
    }
  }, [user]);

  // Auto-dismiss messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        // Show preview immediately
        setPhoto(base64String);

        try {
          // Upload to backend
          await userService.updateProfilePicture(base64String);
          // Refresh user data in AuthContext
          await refreshUser();
          setSuccess('Profile photo updated successfully!');
        } catch (uploadError) {
          console.error('Failed to upload photo:', uploadError);
          setError('Failed to upload photo. Please try again.');
          // Revert to old photo
          setPhoto(user?.profile_picture || null);
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read image file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image');
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm('Are you sure you want to delete your profile photo?')) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await userService.deleteProfilePicture();
      setPhoto(null);
      // Refresh user data in AuthContext
      await refreshUser();
      setSuccess('Profile photo deleted successfully!');
    } catch (error) {
      console.error('Failed to delete photo:', error);
      setError('Failed to delete photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setUploading(true);

    try {
      await userService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      setSuccess('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      console.error('Failed to change password:', error);
      setError(error.message || 'Failed to change password. Please check your old password.');
    } finally {
      setUploading(false);
    }
  };

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
            <UserAvatar 
              src={photo}
              name={user?.name || 'User'}
              size="xl"
              className=""
            />
          </div>

          {/* FORM */}
          <div className="flex-1 w-full">
            <input
              type="text"
              value={user.name || ""}
              readOnly
              className="w-full border rounded-lg px-4 py-3 mb-4"
            />

            <input
              type="email"
              value={user.email || ""}
              readOnly
              className="w-full border rounded-lg px-4 py-3 mb-6"
            />

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="bg-sky-600 text-white px-6 py-2 rounded-lg"
              >
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
                disabled={uploading}
              />

              <button
                onClick={handleDeletePhoto}
                disabled={uploading || !photo}
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
          </select>
        </div>
      </div>

      {/* ✅ CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Change Password
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Password
                </label>
                <input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                  minLength={6}
                  disabled={uploading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                  minLength={6}
                  disabled={uploading}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
                    setError(null);
                    setSuccess(null);
                  }}
                  className="px-4 py-2 rounded-lg border"
                  disabled={uploading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white"
                  disabled={uploading}
                >
                  {uploading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
