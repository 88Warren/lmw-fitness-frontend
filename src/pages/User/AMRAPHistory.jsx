import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiAward, FiCalendar, FiRefreshCw } from "react-icons/fi";
import api from "../../utils/api";
import { BACKEND_URL } from "../../utils/config";
import DynamicHeading from "../../components/Shared/DynamicHeading";

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
    } catch (e) {
      setError("Failed to load your AMRAP history.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatScore = (score) => {
    let s = `${score.rounds} round${score.rounds !== 1 ? "s" : ""}`;
    if (score.partialReps > 0) s += ` + ${score.partialReps} reps`;
    return s;
  };

  // Group scores by program
  const grouped = scores.reduce((acc, score) => {
    const key = score.programName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(score);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-linear-to-b from-customGray/30 to-white p-6 pt-28"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-start mb-6">
          <Link
            to="/profile"
            className="flex items-center text-customGray hover:text-logoGray transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Profile
          </Link>
        </div>

        <div className="text-center mb-8">
          <DynamicHeading
            text="AMRAP History"
            className="font-higherJump text-3xl md:text-4xl font-bold text-customGray mb-2 leading-loose tracking-widest"
          />
          <p className="text-gray-600">Your personal bests — come back and beat them.</p>
        </div>

        {loading && (
          <div className="text-center py-12 text-customGray">Loading...</div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchScores} className="btn-full-colour flex items-center gap-2 mx-auto">
              <FiRefreshCw size={16} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && scores.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">🏋️</div>
            <p className="text-customGray font-semibold text-lg mb-2">No scores yet</p>
            <p className="text-gray-500 text-sm">
              Complete an AMRAP workout and record your score — it will show up here.
            </p>
          </div>
        )}

        {!loading && !error && Object.entries(grouped).map(([programName, programScores]) => (
          <div key={programName} className="mb-8">
            <h2 className="text-lg font-bold text-customGray mb-3 capitalize">
              {programName.replace(/-/g, " ")}
            </h2>
            <div className="grid gap-3">
              {programScores
                .sort((a, b) => a.dayNumber - b.dayNumber)
                .map((score) => (
                  <div
                    key={score.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-customGray text-white rounded-lg px-3 py-2 text-center min-w-[56px]">
                        <p className="text-xs text-logoGray">Day</p>
                        <p className="text-xl font-bold leading-none">{score.dayNumber}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <FiAward className="text-brightYellow" size={16} />
                          <span className="font-bold text-customGray text-lg">
                            {formatScore(score)}
                          </span>
                        </div>
                        {score.notes && (
                          <p className="text-gray-500 text-xs italic mt-0.5">{score.notes}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1 text-gray-400 text-xs">
                          <FiCalendar size={11} />
                          <span>{formatDate(score.recordedDate)}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/workouts/${programName}/${score.dayNumber}`}
                      className="text-xs bg-customGray text-white px-3 py-2 rounded-lg hover:bg-logoGray transition-colors whitespace-nowrap"
                    >
                      Beat it →
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AMRAPHistory;
