import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import DynamicHeading from "../../components/Shared/DynamicHeading";

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 pt-24 bg-linear-to-b from-customGray/30 to-white"
    >
      <div className="bg-customGray p-8 rounded-lg text-center max-w-lg w-full border-brightYellow border-2">
        <DynamicHeading
          text="User Profile"
          className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest"
        />
        <div className="space-y-4 text-center">
          {/* Link to programs/workouts */}
          <div className="mt-6">
            <Link to="/fitness-assessments" className="block btn-primary mb-6">
              Fitness Assessments
            </Link>
            
            <Link to="/calorie-calculator" className="block btn-primary mb-6">
              Calorie Calculator
            </Link>
            
            {user.role === "admin" ? (
              <div className="space-y-2">
                <Link
                  to="/workouts/beginner-program/list"
                  className="block btn-full-colour"
                >
                  30-Day Beginner Programme
                </Link>
                <Link
                  to="/workouts/advanced-program/list"
                  className="block btn-full-colour"
                >
                  30-Day Advanced Programme
                </Link>
              </div>
            ) : user.purchasedPrograms && user.purchasedPrograms.length > 0 ? (
              <div className="space-y-2">
                {user.purchasedPrograms.includes("beginner-program") && (
                  <Link
                    to="/workouts/beginner-program/list"
                    className="block btn-full-colour"
                  >
                    30-Day Beginner Programme
                  </Link>
                )}
                {user.purchasedPrograms.includes("advanced-program") && (
                  <Link
                    to="/workouts/advanced-program/list"
                    className="block btn-full-colour"
                  >
                    30-Day Advanced Programme
                  </Link>
                )}
              </div>
            ) : (
              <div>
                <p className="text-logoGray">No programs purchased yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
