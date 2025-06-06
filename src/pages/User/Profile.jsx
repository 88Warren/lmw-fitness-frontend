import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Import the useAuth hook

const ProfilePage = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    console.log("ProfilePage useEffect: isLoggedIn =", isLoggedIn);
    if (!isLoggedIn) {
      console.log("ProfilePage: Not logged in, redirecting to /login");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    console.log("ProfilePage: Logging out...");
    logout();
    navigate("/"); // Redirect to home page after logout
  };

  // Log state every time component renders
  console.log("ProfilePage Render: isLoggedIn =", isLoggedIn, "user =", user);

  if (!isLoggedIn || !user) {
    console.log("ProfilePage: Rendering loading/redirecting message");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-brightYellow">
          Loading profile or redirecting...
        </p>
      </div>
    );
  }

  console.log("ProfilePage: Rendering actual profile content");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-limeGreen text-white">
        <h2 className="text-3xl font-bold text-center text-brightYellow mb-6 font-higherJump">
          User Profile
        </h2>
        <div className="space-y-4 text-center">
          <p className="text-lg font-titillium text-logoGray">
            <span className="font-bold text-limeGreen">Email:</span>{" "}
            {user.email}
          </p>
          <p className="text-lg font-titillium text-logoGray">
            <span className="font-bold text-brightYellow">Role:</span>{" "}
            {user.role}
          </p>
          {/* Add more profile details here as you expand your user model */}
        </div>
        <button
          onClick={handleLogout}
          className="btn-primary w-full mt-8 bg-red-500 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
