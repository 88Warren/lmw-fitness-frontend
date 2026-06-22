import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { showToast } from "../../utils/toastUtil";
import { BACKEND_URL } from "../../utils/config";
import api from "../../utils/api";

const RoutinePage = () => {
  const { loadingAuth, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { programName, routineType } = useParams();
  const [routineData, setRoutineData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const validRoutineType =
    routineType === "warmup" || routineType === "cooldown" ? routineType : "warmup";

  const isWarmup = validRoutineType === "warmup";
  const routineTitle = isWarmup ? "Warm Up" : "Cool Down";
  const routineIcon = isWarmup ? "🔥" : "🧊";
  const routineSubtitle = isWarmup
    ? "Prepare your body and mind before training"
    : "Help your body recover and reduce soreness";
  const pillStyle = isWarmup
    ? "bg-brightYellow text-black shadow-brightYellow/40"
    : "bg-limeGreen text-black shadow-limeGreen/40";

  useEffect(() => {
    if (loadingAuth || !isLoggedIn) return;

    const fetchRoutine = async () => {
      try {
        setIsLoading(true);
        const endpoint = `${BACKEND_URL}/api/workouts/${programName}/routines/${validRoutineType}`;
        const response = await api.get(endpoint);
        setRoutineData(response.data);
      } catch (error) {
        console.error("Failed to fetch routine:", error);
        if (error.response?.status === 403) {
          showToast("error", "You don't have access to this program.");
        } else if (error.response?.status === 404) {
          showToast("error", `${routineTitle} routine not found.`);
        } else {
          showToast("error", `Failed to load ${routineTitle}. Please try again.`);
        }
        setRoutineData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutine();
  }, [programName, validRoutineType, isLoggedIn, loadingAuth, routineTitle]);

  // ── Loading state ──
  if (loadingAuth || !isLoggedIn || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brightYellow mx-auto mb-4"></div>
          <p className="text-base font-titillium text-customGray/60">
            Loading {routineTitle.toLowerCase()}...
          </p>
        </div>
      </div>
    );
  }

  // ── Not found state ──
  if (!routineData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
        <p className="text-customGray font-titillium text-lg mb-6">{routineTitle} routine not found.</p>
        <button
          onClick={() => navigate(`/workouts/${programName}/list`)}
          className="btn-primary mt-0"
        >
          Back to Programme
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <button
            onClick={() => navigate(`/workouts/${programName}/list`)}
            className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Programme
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shrink-0">
              {routineIcon}
            </div>
            <div>
              <span className={`inline-flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full text-xs font-titillium font-bold tracking-widest uppercase shadow-lg ${pillStyle}`}>
                {routineTitle}
              </span>
              <p className="text-sm text-customGray/50 font-titillium">{routineSubtitle}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Video ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl border-2 border-brightYellow shadow-sm overflow-hidden"
        >
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={routineData.videoUrl}
              title={routineTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </motion.div>

        {/* ── Info cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Overview */}
          {routineData.description && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-3">Overview</p>
              <div className="space-y-2">
                {routineData.description.split("\n").map((line, idx) =>
                  line.startsWith("-") ? (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-limeGreen font-bold mt-0.5 shrink-0">•</span>
                      <p className="text-sm text-customGray/70 font-titillium leading-relaxed">
                        {line.replace("-", "").trim()}
                      </p>
                    </div>
                  ) : line.trim() ? (
                    <p key={idx} className="text-sm text-customGray/70 font-titillium leading-relaxed">
                      {line}
                    </p>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          {routineData.instructions && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-3">Instructions</p>
              <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                {routineData.instructions}
              </p>
            </div>
          )}

          {/* Tips */}
          {routineData.tips && (
            <div className="bg-yellow-50 rounded-2xl border border-brightYellow/30 p-6">
              <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-3">Top Tips</p>
              <p className="text-sm text-customGray/70 font-titillium leading-relaxed italic whitespace-pre-line">
                {routineData.tips}
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default RoutinePage;
