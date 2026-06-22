import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAward, FiCalendar, FiRefreshCw } from "react-icons/fi";
import api from "../../utils/api";
import { BACKEND_URL } from "../../utils/config";

const AMRAPHistory = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${BACKEND_URL}/api/amrap/scores`);
      setScores(res.data || []);
    } catch {
      setError("Failed to load your AMRAP history.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatScore = (score) => {
    let s = `${score.rounds} round${score.rounds !== 1 ? "s" : ""}`;
    if (score.partialReps > 0) s += ` + ${score.partialReps} reps`;
    return s;
  };

  const grouped = scores.reduce((acc, score) => {
    const key = score.programName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(score);
    return acc;
  }, {});

  const programLabel = (name) =>
    name
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200 mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>

          <div className="text-center">
            <span className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-limeGreen text-black text-sm font-titillium font-bold tracking-widest uppercase shadow-lg shadow-limeGreen/40">
              <span>⏱️</span> AMRAP History
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-customGray font-titillium">
              Your Personal Bests
            </h1>
            <p className="text-sm text-customGray/50 font-titillium mt-2">
              Come back and beat them.
            </p>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brightYellow mx-auto mb-3"></div>
            <p className="text-sm text-customGray/50 font-titillium">Loading your scores...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-red-400 font-titillium text-sm mb-4">{error}</p>
            <button
              onClick={fetchScores}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brightYellow text-black text-sm font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200"
            >
              <FiRefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && scores.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center"
          >
            <div className="text-5xl mb-4">🏋️</div>
            <p className="text-base font-bold text-customGray font-titillium mb-2">No scores yet</p>
            <p className="text-sm text-customGray/50 font-titillium">
              Complete an AMRAP workout and record your score — it will show up here.
            </p>
          </motion.div>
        )}

        {/* Scores grouped by programme */}
        {!loading && !error && Object.entries(grouped).map(([programName, programScores], groupIdx) => (
          <motion.div
            key={programName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: groupIdx * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            {/* Programme header */}
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-yellow-50 text-lg shrink-0">
                🏆
              </span>
              <h2 className="text-base font-bold text-customGray font-titillium">
                {programLabel(programName)}
              </h2>
              <span className="ml-auto text-xs text-customGray/40 font-titillium">
                {programScores.length} score{programScores.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Score rows */}
            <div className="space-y-3">
              {programScores
                .sort((a, b) => a.dayNumber - b.dayNumber)
                .map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-transparent hover:border-brightYellow hover:bg-yellow-50 transition-all duration-200"
                  >
                    {/* Day badge + score */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center shrink-0">
                        <p className="text-xs text-customGray/40 font-titillium leading-none">Day</p>
                        <p className="text-lg font-bold text-customGray font-titillium leading-tight">
                          {score.dayNumber}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <FiAward className="text-brightYellow shrink-0" size={14} />
                          <span className="text-sm font-bold text-customGray font-titillium">
                            {formatScore(score)}
                          </span>
                        </div>
                        {score.notes && (
                          <p className="text-xs text-customGray/50 font-titillium italic mb-0.5">
                            {score.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-customGray/40 text-xs font-titillium">
                          <FiCalendar size={10} />
                          <span>{formatDate(score.recordedDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Beat it link */}
                    <Link
                      to={`/workouts/${programName}/${score.dayNumber}`}
                      className="shrink-0 text-xs font-titillium font-bold px-3 py-2 bg-brightYellow text-black rounded-lg hover:bg-brightYellow/80 transition-colors duration-200 whitespace-nowrap"
                    >
                      Beat it →
                    </Link>
                  </div>
                ))}
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
};

export default AMRAPHistory;
