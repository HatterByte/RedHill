import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/auth.actions";
import { axiosInstance } from "../../utils/axios";

const NavbarUserModal = ({ userModal, setUserModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    password: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    if (
      profileForm.password &&
      profileForm.password !== profileForm.confirmPassword
    ) {
      setProfileError("Passwords do not match");
      return;
    }
    setProfileLoading(true);
    try {
      const payload = { name: profileForm.name };
      if (profileForm.password) payload.password = profileForm.password;
      const res = await axiosInstance.put("/user/update-profile", payload);
      if (res.data && res.data.user) {
        setProfileSuccess("Profile updated successfully");
        dispatch({ type: "GET_USER_SUCCESS", payload: res.data.user });
        setTimeout(() => {
          setShowProfileModal(false);
          setProfileSuccess("");
        }, 1000);
      } else {
        setProfileError(res.data.message || "Update failed");
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <>
      {/* Modal dropdown: use fixed+flex for overlay, and relative+mx-auto for dropdown, for best responsiveness */}
      <div
        className="w-64 bg-white rounded-lg shadow-lg border border-gray-200"
        style={{ pointerEvents: userModal ? "auto" : "none" }}
      >
        <div
          className="bg-white w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-lg border border-gray-200 mx-auto mt-2"
          style={{ pointerEvents: "auto" }}
        >
          <div className="h-15 w-full bg-[#dcdef9] p-2 flex  items-center gap-2">
            <div className="rounded-full w-11 h-11 bg-white ml-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="#000000d8"
                className="w-5 h-5 shrink-0"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
              </svg>
            </div>
            <div className="text-black text-lg overflow-hidden text-ellipsis whitespace-nowrap max-w-[155px] font-medium">
              {user?.name || "User"}
            </div>
          </div>
          <div
            className="w-64 h-10 text-base text-black flex justify-start items-center gap-2 px-4 hover:bg-[#EFE4E855] hover:text-[#75002B] cursor-pointer transition duration-400 ease-in-out"
            onClick={() => setShowProfileModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
            </svg>
            Update Profile
          </div>
          <div
            className="w-64 h-10 text-base text-black flex justify-start items-center gap-2 px-4 hover:bg-[#EFE4E855] hover:text-[#75002B] cursor-pointer transition duration-200 ease-in-out"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setUserModal(false);
              navigate("/complaints");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 0l0 64 64 0 0-64L64 96zm384 0L192 96l0 64 256 0 0-64zM64 224l0 64 64 0 0-64-64 0zm384 0l-256 0 0 64 256 0 0-64zM64 352l0 64 64 0 0-64-64 0zm384 0l-256 0 0 64 256 0 0-64z" />
            </svg>
            Past Complaints
          </div>

          <div
            className="w-64 h-10 text-base text-black flex justify-start items-center gap-2 px-4 hover:bg-[#EFE4E855] hover:text-[#75002B] cursor-pointer transition duration-200 ease-in-out"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(logout());
              setUserModal(false);
              navigate("/");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
            Logout
          </div>
        </div>
      </div>
      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={() => setShowProfileModal(false)}
        >
          <form
            className="bg-white rounded-lg p-6 w-80 flex flex-col gap-4 shadow-lg"
            onSubmit={handleProfileSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xl font-semibold mb-2">Update Profile</div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              className="border p-2 rounded"
              required
            />
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              name="password"
              value={profileForm.password}
              onChange={handleProfileChange}
              className="border p-2 rounded"
              placeholder="Leave blank to keep unchanged"
            />
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={profileForm.confirmPassword}
              onChange={handleProfileChange}
              className="border p-2 rounded"
              placeholder="Leave blank to keep unchanged"
            />
            {profileError && (
              <div className="text-red-600 text-sm">{profileError}</div>
            )}
            {profileSuccess && (
              <div className="text-green-600 text-sm">{profileSuccess}</div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-[#75002B] text-white px-4 py-2 rounded hover:bg-[#f58220] flex-1"
                disabled={profileLoading}
              >
                {profileLoading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded flex-1"
                onClick={() => setShowProfileModal(false)}
                disabled={profileLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default NavbarUserModal;
