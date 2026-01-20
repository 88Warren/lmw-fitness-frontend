import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import AssessmentHistory from "../../components/Assessments/AssessmentHistory";
import ManualAssessmentEntry from "../../components/Assessments/ManualAssessmentEntry";

const FitnessAssessments = () => {
  const { user, isLoggedIn, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('menu');

  if (loadingAuth || !isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-brightYellow">
          Loading or redirecting...
        </p>
      </div>
    );
  }

  const handleBackToProfile = () => {
    navigate("/profile");
  };

  const handleBackToMenu = () => {
    setActiveView('menu');
  };

  // Main menu view
  if (activeView === 'menu') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center min-h-screen p-6 pt-24 bg-linear-to-b from-customGray/30 to-white"
      >
        <div className="bg-customGray p-8 rounded-lg text-center max-w-lg w-full border-brightYellow border-2">
          {/* Back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToProfile}
              className="text-logoGray hover:text-brightYellow transition-colors flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-titillium">Back to Profile</span>
            </button>
          </div>

          <DynamicHeading
            text="Fitness Assessments"
            className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest"
          />

          <div className="space-y-4">
            <button
              onClick={() => setActiveView('history')}
              className="block btn-full-colour w-full"
            >
              Assessment History
            </button>
            
            <button
              onClick={() => setActiveView('progress')}
              className="block btn-full-colour w-full"
            >
              Progress Comparison
            </button>
            
            <button
              onClick={() => setActiveView('manual-entry')}
              className="block btn-primary w-full"
            >
              Manual Entry
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-logoGray">
            <p className="text-sm text-logoGray font-titillium mb-2">
              <strong className="text-customWhite">About Fitness Assessments</strong>
            </p>
            <p className="text-xs text-logoGray font-titillium">
              Track your progress with Day 1 and Day 30 fitness assessments. 
              Record your results during workouts or add them manually to see your improvement over time.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // History view
  if (activeView === 'history') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center min-h-screen p-6 pt-24 bg-linear-to-b from-customGray/30 to-white"
      >
        <div className="bg-customGray p-8 rounded-lg w-full max-w-4xl border-brightYellow border-2">
          {/* Back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToMenu}
              className="text-logoGray hover:text-brightYellow transition-colors flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-titillium">Back to Assessments</span>
            </button>
          </div>

          <DynamicHeading
            text="Assessment History"
            className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest text-center"
          />

          <AssessmentHistory />
        </div>
      </motion.div>
    );
  }

  // Progress comparison view
  if (activeView === 'progress') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center min-h-screen p-6 pt-24 bg-linear-to-b from-customGray/30 to-white"
      >
        <div className="bg-customGray p-8 rounded-lg w-full max-w-4xl border-brightYellow border-2">
          {/* Back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToMenu}
              className="text-logoGray hover:text-brightYellow transition-colors flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-titillium">Back to Assessments</span>
            </button>
          </div>

          <DynamicHeading
            text="Progress Comparison"
            className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest text-center"
          />

          {/* Show only the progress comparison tab from AssessmentHistory */}
          <div className="space-y-6">
            <AssessmentHistory initialTab="progress" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Manual entry view
  if (activeView === 'manual-entry') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center min-h-screen p-6 pt-24 bg-linear-to-b from-customGray/30 to-white"
      >
        <div className="bg-customGray p-8 rounded-lg w-full max-w-4xl border-brightYellow border-2">
          {/* Back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToMenu}
              className="text-logoGray hover:text-brightYellow transition-colors flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="font-titillium">Back to Assessments</span>
            </button>
          </div>

          <DynamicHeading
            text="Manual Entry"
            className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest text-center"
          />

          <ManualAssessmentEntry />
        </div>
      </motion.div>
    );
  }

  return null;
};

export default FitnessAssessments;