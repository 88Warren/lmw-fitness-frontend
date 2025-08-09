import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import { showToast } from "../../utils/toastUtil";
import WorkoutTimer from "../../components/Workouts/WorkoutTimer";
import WorkoutPreview from "../../components/Workouts/WorkoutPreview";
import ExerciseVideo from "../../components/Workouts/ExerciseVideo";
import { BACKEND_URL } from "../../utils/config";

const BeginnerWorkoutPage = () => {
  const { isLoggedIn, loadingAuth, user } = useAuth();
  const navigate = useNavigate();
  const { dayNumber } = useParams();
  const [workoutData, setWorkoutData] = useState(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [error, setError] = useState(null);
  
  // Workout state
  const [showPreview, setShowPreview] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRestPeriod, setIsRestPeriod] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const dayNum = dayNumber ? parseInt(dayNumber) : 1;

  useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!loadingAuth && isLoggedIn && user && user.mustChangePassword) {
      navigate("/change-password-first-login");
      return;
    }

    const fetchWorkout = async () => {
      setLoadingWorkout(true);
      setError(null);
      try {
        // Check authorization first
        if (!user || (user.role !== 'member' && user.role !== 'admin')) {
          setError("You are not authorised to view this program.");
          return;
        }

        // Fetch workout data from backend
        const response = await fetch(`${BACKEND_URL}/api/workouts/beginner-program/day/${dayNum}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform backend data to frontend format
        const transformedData = {
          title: data.title || `Day ${dayNum}: Full Body Fitness Test`,
          description: data.description || `Welcome to Day ${dayNum}! Today's workout focuses on building a solid foundation.`,
          exercises: data.exercises.map(exercise => ({
            name: exercise.exercise.name,
            video_id: exercise.exercise.video_id,
            duration: exercise.duration,
            rest: exercise.rest_duration,
            tips: exercise.tips,
            instructions: exercise.instructions
          })),
          warmup: data.warmup || "5 minutes light cardio (jogging in place, jumping jacks), dynamic stretches (arm circles, leg swings).",
          cooldown: data.cooldown || "5 minutes static stretches (hamstring stretch, quad stretch, tricep stretch).",
        };

        setWorkoutData(transformedData);

      } catch (err) {
        console.error("Failed to fetch workout:", err);
        setError("Failed to load workout. Please try again later.");
        showToast("error", "Failed to load workout.");
      } finally {
        setLoadingWorkout(false);
      }
    };

    if (!loadingAuth && isLoggedIn && user && !user.mustChangePassword) {
      fetchWorkout();
    }
  }, [isLoggedIn, loadingAuth, navigate, user, dayNum]);

  const handleStartWorkout = () => {
    setShowPreview(false);
    setCurrentExerciseIndex(0);
    setIsRestPeriod(false);
    setWorkoutComplete(false);
  };

  const handleSkipPreview = () => {
    setShowPreview(false);
    setCurrentExerciseIndex(0);
    setIsRestPeriod(false);
    setWorkoutComplete(false);
  };

  const handleExerciseComplete = () => {
    if (isRestPeriod) {
      // Rest period finished, move to next exercise
      setIsRestPeriod(false);
      if (currentExerciseIndex < workoutData.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        // Workout complete
        setWorkoutComplete(true);
        showToast("success", "Workout completed! Great job!");
      }
    } else {
      // Exercise finished, start rest period
      setIsRestPeriod(true);
    }
  };

  const handleWorkoutComplete = () => {
    setWorkoutComplete(true);
    showToast("success", "Workout completed! Great job!");
  };

  const getCurrentExercise = () => {
    if (isRestPeriod) {
      return {
        name: "Rest",
        duration: workoutData.exercises[currentExerciseIndex]?.rest || "30 seconds",
        rest: "0 seconds"
      };
    }
    return workoutData.exercises[currentExerciseIndex];
  };

  const getNextExercise = () => {
    if (currentExerciseIndex < workoutData.exercises.length - 1) {
      return workoutData.exercises[currentExerciseIndex + 1];
    }
    return null;
  };

  if (loadingAuth || !isLoggedIn || (user && user.mustChangePassword)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-brightYellow">
          Loading workout or redirecting...
        </p>
      </div>
    );
  }

  if (loadingWorkout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-limeGreen">Loading workout details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-red-500">{error}</p>
      </div>
    );
  }

  if (!workoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-logoGray">No workout data available.</p>
      </div>
    );
  }

  // Show preview if not started
  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10 font-titillium">
        <div className="max-w-4xl mx-auto">
          <WorkoutPreview
            exercises={workoutData.exercises}
            onStartWorkout={handleStartWorkout}
            onSkipPreview={handleSkipPreview}
          />
        </div>
      </div>
    );
  }

  // Show workout complete screen
  if (workoutComplete) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10 font-titillium">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 border border-limeGreen text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-brightYellow mb-4 font-higherJump">
            Workout Complete!
          </h1>
          <p className="text-lg text-logoGray mb-8">
            Great job completing today&apos;s workout! You&apos;re one step closer to your fitness goals.
          </p>
          
          <div className="space-y-4">
            <Link to="/profile" className="btn-primary bg-limeGreen hover:bg-green-600 text-white px-8 py-3 rounded-lg">
              Back to Profile
            </Link>
            <button
              onClick={() => {
                setShowPreview(true);
                setWorkoutComplete(false);
              }}
              className="btn-primary bg-brightYellow hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg ml-4"
            >
              Restart Workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show active workout
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10 font-titillium">
      <div className="max-w-4xl mx-auto">
        {/* Workout Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-limeGreen">
          <h1 className="text-3xl font-bold text-brightYellow text-center mb-2 font-higherJump">
            {workoutData.title}
          </h1>
          <div className="text-center text-logoGray">
            <p>Exercise {currentExerciseIndex + 1} of {workoutData.exercises.length}</p>
            {!isRestPeriod && (
              <p className="text-sm mt-1">{workoutData.exercises[currentExerciseIndex]?.name}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Exercise Video */}
          <div>
            <ExerciseVideo 
              exercise={isRestPeriod ? null : getCurrentExercise()} 
              isActive={!isRestPeriod}
            />
          </div>

          {/* Timer */}
          <div>
            <WorkoutTimer
              currentExercise={getCurrentExercise()}
              nextExercise={getNextExercise()}
              onExerciseComplete={handleExerciseComplete}
              onWorkoutComplete={handleWorkoutComplete}
              isRest={isRestPeriod}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between text-sm text-logoGray mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentExerciseIndex + (isRestPeriod ? 0.5 : 0)) / workoutData.exercises.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-limeGreen to-brightYellow h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${((currentExerciseIndex + (isRestPeriod ? 0.5 : 0)) / workoutData.exercises.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginnerWorkoutPage;
