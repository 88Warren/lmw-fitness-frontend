import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import { motion } from 'framer-motion';
import DynamicHeading from '../../components/Shared/DynamicHeading';
import { showToast } from "../../utils/toastUtil";
import { BACKEND_URL } from "../../utils/config";
import axios from "axios"; 

const RoutinePage = () => {
  const { user, loadingAuth, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { programName, routineType } = useParams();
  const location = useLocation();
  const [routineData, setRoutineData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate routine type
  const validRoutineType = routineType === 'warmup' || routineType === 'cooldown' ? routineType : 'warmup';
  const routineTitle = validRoutineType === 'warmup' ? 'Warm Up' : 'Cool Down';


  useEffect(() => {
    if (loadingAuth || !isLoggedIn) return;

    const fetchRoutine = async () => {
      try {
        setIsLoading(true);
        const endpoint = validRoutineType === 'warmup' 
          ? `${BACKEND_URL}/api/workouts/${programName}/routines/warmup` 
          : `${BACKEND_URL}/api/workouts/${programName}/routines/cooldown`;
        const response = await axios.get(endpoint); 
        setRoutineData(response.data);
      } catch (error) {
        console.error("Failed to fetch routine:", error);
        if (error.response?.status === 403) {
          showToast("error", "You don't have access to this program.");
        } else if (error.response?.status === 404) {
          showToast("error", `${routineTitle} routine not found.`);
        } else {
          showToast("error", `Failed to load ${validRoutineType} routine. Please try again.`);
        }
        setRoutineData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutine();
  }, [programName, validRoutineType, isLoggedIn, loadingAuth, routineTitle]);

  if (loadingAuth || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-brightYellow">
          Authenticating...
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-customGray/30 to-white p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brightYellow mx-auto mb-4"></div>
          <p className="text-xl font-titillium text-customGray">
            Loading {validRoutineType} routine...
          </p>
        </div>
      </div>
    );
  }

  if (!routineData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-customGray/30 to-white p-4">
        <div className="bg-customGray p-8 rounded-lg text-center max-w-md border-brightYellow border-2">
          <p className="text-xl font-titillium text-brightYellow mb-6">
            {routineTitle} routine not found.
          </p>
          <button
            onClick={() => navigate(`/workouts/${programName}/list`)}
            className="btn-primary text-black"
          >
            Back to Program
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gradient-to-b from-customGray/30 to-white"
    >
      <div className="bg-customGray p-4 md:p-8 m-20 rounded-lg text-center max-w-md sm:max-w-4xl w-full border-brightYellow border-2 shadow-lg">
        <DynamicHeading
          text={routineTitle}
          className="font-higherJump text-2xl md:text-4xl font-bold text-customWhite leading-loose tracking-widest mb-6"
        />

        <button
          onClick={() => navigate(`/workouts/${programName}/list`)}
          className="btn-primary text-black mb-6 hover:scale-105 transition-transform"
        >
          Back to Program
        </button>

        {/* Video Block */}
        <div className="w-full mb-6 rounded-lg overflow-hidden border-2 border-brightYellow shadow-md">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={routineData.videoUrl}
              title={routineTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-4 text-left">
          {/* Main Description */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-brightYellow/30">
            <h3 className="text-brightYellow font-titillium text-lg font-semibold mb-2">
              Overview
            </h3>
            <p className="text-customWhite leading-loose whitespace-pre-line">
                {routineData.description.split("\n").map((line, idx) => 
                  line.startsWith("-") ? (
                    <li key={idx} className="ml-6 list-disc">{line.replace("-", "").trim()}</li>
                  ) : (
                    <p key={idx} className="mb-2">{line}</p>
                  )
                )}
            </p>
          </div>

          {/* Instructions */}
          {routineData.instructions && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-brightYellow/30">
              <h3 className="text-brightYellow font-titillium text-lg font-semibold mb-2">
                Instructions
              </h3>
              <p className="text-customWhite leading-loose whitespace-pre-line">
                {routineData.instructions}
              </p>
            </div>
          )}

          {/* Tips */}
          {routineData.tips && (
            <div className="bg-gray-800/30 p-4 rounded-lg border border-brightYellow/20">
              <h4 className="text-brightYellow font-titillium text-lg font-semibold mb-2">
                Tips
              </h4>
              <p className="text-customWhite leading-loose whitespace-pre-line">
                {routineData.tips}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoutinePage;