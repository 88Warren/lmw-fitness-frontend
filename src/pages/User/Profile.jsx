import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import useAuth from "../../hooks/useAuth";

const ProfilePage = () => {
  const { user, isLoggedIn, loadingAuth } = useAuth();
  const navigate = useNavigate();

  // console.log('=== PROFILE PAGE DEBUG ===');
  // console.log('User from useAuth:', user);
  // console.log('User type:', typeof user);
  // console.log('User keys:', user ? Object.keys(user) : 'null');
  // console.log('Purchased programs:', user?.purchasedPrograms);
  // console.log('Purchased programs type:', typeof user?.purchasedPrograms);
  // console.log('Purchased programs length:', user?.purchasedPrograms?.length);
  // console.log('Auth loading state:', loadingAuth);
  // console.log('Is logged in:', isLoggedIn);
  // console.log('User role:', user?.role);
  // console.log('User email:', user?.email);
  // console.log('Must change password:', user?.mustChangePassword);
  // console.log('=============================');

  useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      // console.log('Not logged in, redirecting to login');
      navigate("/login");
    } else if (user && user.mustChangePassword) {
      // console.log('Must change password, redirecting');
      navigate("/change-password-first-login");
    }
  }, [isLoggedIn, navigate, loadingAuth]);

useEffect(() => {
  if (!loadingAuth && isLoggedIn && user?.mustChangePassword) {
    // console.log('Must change password redirect triggered');
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

  // const handleProgramClick = (programName, dayNumber) => {
  //   console.log(`Program clicked: ${programName}, Day: ${dayNumber}`);
  //   console.log('Current user state:', user);
  //   console.log('Current purchased programs:', user.purchasedPrograms);
  //   console.log('Checking if user has access to:', programName);
    
  //   if (user.role === 'admin') {
  //     console.log('User is admin, allowing access');
  //   } else if (user.purchasedPrograms && user.purchasedPrograms.includes(programName)) {
  //     console.log('User has purchased program, allowing access');
  //   } else {
  //     console.log('User does NOT have access to this program');
  //     console.log('Available programs:', user.purchasedPrograms);
  //   }
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-customGray/30 to-white"
    >
      <div className="bg-customGray p-8 rounded-lg text-center max-w-lg w-full border-brightYellow border-2">
        <h2 className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest">
          User Profi<span className="l">l</span>e
        </h2>
        <div className="space-y-4 text-center">
          {/* Debug info */}
          {/* <div className="bg-gray-700 p-4 rounded text-left text-xs">
            <h4 className="text-red-400 font-bold mb-2">DEBUG INFO:</h4>
            <p className="text-yellow-300">Purchased Programs: {JSON.stringify(user.purchasedPrograms)}</p>
            <p className="text-yellow-300">Array Length: {user.purchasedPrograms?.length || 'N/A'}</p>
            <p className="text-yellow-300">Type: {typeof user.purchasedPrograms}</p>
            <p className="text-yellow-300">Is Array: {Array.isArray(user.purchasedPrograms)}</p>
          </div> */}

          {/* Link to programs/workouts */}
          <div className="mt-6">
            {user.role === 'admin' ? (
              <div className="space-y-2">
                <Link 
                  to="/workouts/beginner-program/1" 
                  className="block btn-primary bg-limeGreen hover:bg-green-600"
                  onClick={() => handleProgramClick('beginner-program', 1)}
                >
                  30-Day Beginner Programme
                </Link>
                <Link 
                  to="/workouts/advanced-program/1" 
                  className="block btn-primary bg-hotPink hover:bg-pink-600"
                  onClick={() => handleProgramClick('advanced-program', 1)}
                >
                  30-Day Advanced Programme
                </Link>
              </div>
            ) : user.purchasedPrograms && user.purchasedPrograms.length > 0 ? (
              <div className="space-y-2">
              {user.purchasedPrograms.includes('beginner-program') && (
                <Link 
                  to="/workouts/beginner-program/1" 
                  className="block btn-primary bg-limeGreen hover:bg-green-600"
                  onClick={() => handleProgramClick('beginner-program', 1)}
                >
                  30-Day Beginner Programme
                </Link>
              )}
                {user.purchasedPrograms.includes('advanced-program') && (
                <Link 
                  to="/workouts/advanced-program/1" 
                  className="block btn-primary bg-hotPink hover:bg-pink-600"
                  onClick={() => handleProgramClick('advanced-program', 1)}
                >
                  30-Day Advanced Programme
                </Link>
                )}
              </div>
            ) : (
              <div>
                <p className="text-logoGray">No programs purchased yet.</p>
                <div className="text-xs text-red-400 mt-2">
                  <p>Debug: purchasedPrograms = {JSON.stringify(user.purchasedPrograms)}</p>
                  <p>Length: {user.purchasedPrograms?.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
