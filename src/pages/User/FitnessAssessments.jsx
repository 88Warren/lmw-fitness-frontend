import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import AssessmentHistory from "../../components/Assessments/AssessmentHistory";
import ManualAssessmentEntry from "../../components/Assessments/ManualAssessmentEntry";

const FitnessAssessments = () => {
  const { user, isLoggedIn, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("menu");

  if (loadingAuth || !isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <p className="text-base font-titillium text-customGray/60">Loading...</p>
      </div>
    );
  }

  const BackButton = ({ onClick, label = "Back to Assessments" }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200 mb-6"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );

  // ── Menu ──
  if (activeView === "menu") {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BackButton onClick={() => navigate("/profile")} label="Back to Profile" />

            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-hotPink text-white text-sm font-titillium font-bold tracking-widest uppercase shadow-lg shadow-hotPink/30">
                <span>📋</span> Fitness Assessments
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-customGray font-titillium">
                Track Your Progress
              </h1>
              <p className="text-sm text-customGray/50 font-titillium mt-2">
                Day 1 vs Day 30 — see how far you've come.
              </p>
            </div>
          </motion.div>

          {/* Nav cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            {[
              { view: "history", icon: "📅", label: "Assessment History", sub: "View all your recorded results" },
              { view: "progress", icon: "📈", label: "Progress Comparison", sub: "Day 1 vs Day 30 side by side" },
              { view: "manual-entry", icon: "✏️", label: "Manual Entry", sub: "Add results you forgot to record" },
            ].map(({ view, icon, label, sub }) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-brightYellow hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{icon}</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-customGray font-titillium">{label}</p>
                    <p className="text-xs text-customGray/50 font-titillium">{sub}</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-customGray/30 group-hover:text-brightYellow transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </motion.div>

          {/* About card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 rounded-2xl border border-gray-100 p-5"
          >
            <p className="text-xs font-titillium font-bold text-customGray uppercase tracking-wide mb-2">About Assessments</p>
            <p className="text-sm text-customGray/60 font-titillium leading-relaxed">
              Track your progress with Day 1 and Day 30 fitness assessments. Record your results during workouts or add them manually to see your improvement over time.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Shared sub-view wrapper ──
  const viewConfig = {
    history: { icon: "📅", title: "Assessment History", sub: "All your recorded results" },
    progress: { icon: "📈", title: "Progress Comparison", sub: "Day 1 vs Day 30" },
    "manual-entry": { icon: "✏️", title: "Manual Entry", sub: "Add results retroactively" },
  };

  const config = viewConfig[activeView];

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BackButton onClick={() => setActiveView("menu")} />

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
              {config.icon}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-customGray font-titillium leading-tight">
                {config.title}
              </h1>
              <p className="text-sm text-customGray/50 font-titillium">{config.sub}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {activeView === "history" && <AssessmentHistory />}
          {activeView === "progress" && <AssessmentHistory initialTab="progress" />}
          {activeView === "manual-entry" && <ManualAssessmentEntry />}
        </motion.div>
      </div>
    </div>
  );
};

export default FitnessAssessments;
