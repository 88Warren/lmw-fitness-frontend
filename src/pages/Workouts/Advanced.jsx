import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import { showToast } from "../../utils/toastUtil";
import WorkoutTimer from "../../components/Workouts/WorkoutTimer";
import WorkoutPreview from "../../components/Workouts/WorkoutPreview";
import ExerciseVideo from "../../components/Workouts/ExerciseVideo";

const AdvancedWorkoutPage = () => {
  const { isLoggedIn, loadingAuth, user } = useAuth();
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [error, setError] = useState(null);
  
  // Workout state
  const [showPreview, setShowPreview] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRestPeriod, setIsRestPeriod] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  // In a real app, you'd get the day number from the URL params
  const programId = "advanced-program";
  const dayNumber = 1;

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
        // --- Mock Data for Advanced Program with Individual Exercises ---
        const mockWorkoutData = {
          title: `Day ${dayNumber}: Advanced Strength & Conditioning`,
          description: `Welcome to Day ${dayNumber} of the Advanced Program! This is a high-intensity strength and conditioning workout designed for experienced fitness enthusiasts.`,
          exercises: [
            {
              name: "Burpees with Pull-up",
              video_id: "your_burpee_pullup_video_id",
              duration: "60 seconds",
              rest: "45 seconds",
              tips: "Explosive movement, full range of motion, maintain form throughout.",
              instructions: "Start standing, drop to plank, do push-up, jump feet forward, jump up and pull-up."
            },
            {
              name: "Weighted Squats",
              video_id: "your_weighted_squat_video_id",
              duration: "90 seconds",
              rest: "45 seconds",
              tips: "Keep chest up, go parallel or below, maintain proper form with weight.",
              instructions: "Hold dumbbells at shoulders, squat down keeping weight in heels."
            },
            {
              name: "Diamond Push-ups",
              video_id: "your_diamond_pushup_video_id",
              duration: "60 seconds",
              rest: "45 seconds",
              tips: "Form diamond shape with hands, lower chest to hands, keep body straight.",
              instructions: "Place hands in diamond shape under chest, perform push-ups."
            },
            {
              name: "Mountain Climbers",
              video_id: "your_mountain_climber_video_id",
              duration: "45 seconds",
              rest: "30 seconds",
              tips: "Keep core engaged, alternate legs quickly, maintain plank position.",
              instructions: "In plank position, alternate bringing knees toward chest rapidly."
            },
            {
              name: "Plank with Leg Raises",
              video_id: "your_plank_leg_raise_video_id",
              duration: "60 seconds",
              rest: "30 seconds",
              tips: "Maintain plank position, lift leg straight up, engage core.",
              instructions: "Hold plank position and alternate lifting each leg straight up."
            },
            {
              name: "Box Jumps",
              video_id: "your_box_jump_video_id",
              duration: "45 seconds",
              rest: "45 seconds",
              tips: "Land softly, use proper box height, maintain momentum.",
              instructions: "Jump onto box, step down carefully, repeat with good form."
            },
            {
              name: "Renegade Rows",
              video_id: "your_renegade_row_video_id",
              duration: "60 seconds",
              rest: "45 seconds",
              tips: "Keep body straight, alternate arms, maintain plank position.",
              instructions: "In plank with dumbbells, row one arm up while maintaining balance."
            },
            {
              name: "Wall Balls",
              video_id: "your_wall_ball_video_id",
              duration: "60 seconds",
              rest: "30 seconds",
              tips: "Squat deep, throw ball high, catch and repeat smoothly.",
              instructions: "Squat with medicine ball, throw to wall target, catch and repeat."
            }
          ],
          warmup: "10 minutes dynamic warmup: High knees, butt kicks, arm circles, leg swings, jumping jacks, and mobility exercises.",
          cooldown: "10 minutes static stretching focusing on hamstrings, quads, calves, chest, and shoulders. Include foam rolling if available.",
          equipment: "Dumbbells, resistance bands, pull-up bar, box/step for jumps, medicine ball",
          difficulty: "Advanced - Requires good fitness foundation",
        };

        // Simulate backend authorization check
        if (user && (user.role === 'member' || user.role === 'admin')) {
            setWorkoutData(mockWorkoutData);
        } else {
            setError("You are not authorised to view this program.");
        }

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
  }, [isLoggedIn, loadingAuth, navigate, user, programId, dayNumber]);

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
        showToast("success", "Advanced workout completed! Excellent work!");
      }
    } else {
      // Exercise finished, start rest period
      setIsRestPeriod(true);
    }
  };

  const handleWorkoutComplete = () => {
    setWorkoutComplete(true);
    showToast("success", "Advanced workout completed! Excellent work!");
  };

  const getCurrentExercise = () => {
    if (isRestPeriod) {
      return {
        name: "Rest",
        duration: workoutData.exercises[currentExerciseIndex]?.rest || "45 seconds",
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
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 border border-hotPink text-center">
          <div className="text-6xl mb-6">💪</div>
          <h1 className="text-4xl font-bold text-brightYellow mb-4 font-higherJump">
            Advanced Workout Complete!
          </h1>
          <p className="text-lg text-logoGray mb-8">
            Outstanding work! You&apos;ve completed today&apos;s advanced workout. Your dedication is impressive!
          </p>
          
          <div className="space-y-4">
            <Link to="/profile" className="btn-primary bg-hotPink hover:bg-pink-600 text-white px-8 py-3 rounded-lg">
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
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-hotPink">
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
              className="bg-gradient-to-r from-hotPink to-brightYellow h-3 rounded-full transition-all duration-500"
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

export default AdvancedWorkoutPage;
