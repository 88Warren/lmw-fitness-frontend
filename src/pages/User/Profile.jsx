import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import useAuth from "../../hooks/useAuth";

const ProfilePage = () => {
  const { user, isLoggedIn, loadingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      navigate("/login");
    } else if (user && user.mustChangePassword) {
      navigate("/change-password-first-login");
    }
  }, [isLoggedIn, navigate, loadingAuth]);

useEffect(() => {
  // Handle mustChangePassword redirect separately
  if (!loadingAuth && isLoggedIn && user?.mustChangePassword) {
    navigate("/change-password-first-login");
  }
}, [loadingAuth, isLoggedIn, user, navigate]);

  if (loadingAuth || !isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-brightYellow">
          Loading profile or redirecting...
        </p>
      </div>
    );
  }

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
          {/* Link to programs/workouts */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-limeGreen mb-3">Your Programs</h3>
            {user.role === 'admin' ? (
              <div className="space-y-2">
                <Link to="/workouts/beginner-program" className="block btn-primary bg-limeGreen hover:bg-green-600">
                  30-Day Beginner Programme
                </Link>
                <Link to="/workouts/advanced-program" className="block btn-primary bg-hotPink hover:bg-pink-600">
                  30-Day Advanced Programme
                </Link>
              </div>
            ) : user.role === 'member' ? (
              <div className="space-y-2">
                <Link to="/workouts/beginner-program" className="block btn-primary bg-limeGreen hover:bg-green-600">
                  30-Day Beginner Programme
                </Link>
                {/* Add more programs here dynamically from backend */}
              </div>
            ) : (
              <p className="text-logoGray">No programs purchased yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
