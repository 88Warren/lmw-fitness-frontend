// src/pages/WorkoutPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import { showToast } from "../../utils/toastUtil";
import WorkoutTimer from "../../components/Workouts/WorkoutTimer";
import WorkoutPreview from "../../components/Workouts/WorkoutPreview";
import ExerciseVideo from "../../components/Workouts/ExerciseVideo";
import { BACKEND_URL } from "../../utils/config";

const WorkoutPage = () => {
  const { isLoggedIn, loadingAuth, user } = useAuth();
  const navigate = useNavigate();
  const { programName, dayNumber } = useParams();
  const [workoutData, setWorkoutData] = useState(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [error, setError] = useState(null);

  // Workout state
  const [showPreview, setShowPreview] = useState(true);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRestPeriod, setIsRestPeriod] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const dayNum = dayNumber ? parseInt(dayNumber, 10) : 1;

  useEffect(() => {
    // Only save progress if the workout has started (i.e., not on the preview page)
    if (!showPreview && !workoutComplete) {
      const progressData = {
        programName,
        dayNumber: dayNum,
        blockIndex: currentBlockIndex,
        exerciseIndex: currentExerciseIndex,
        isRestPeriod
      };
      localStorage.setItem('workoutProgress', JSON.stringify(progressData));
    }
    // Clean up local storage if the workout is complete
    if (workoutComplete) {
        localStorage.removeItem('workoutProgress');
    }
  }, [currentBlockIndex, currentExerciseIndex, isRestPeriod, showPreview, workoutComplete, programName, dayNum]);

  const handleGoBackToProfile = () => {
    navigate('/profile');
  };

  useEffect(() => {
    // Auth and redirect logic remains the same
    if (!loadingAuth && !isLoggedIn) {
      console.log("WorkoutPage: Not logged in, redirecting to login.");
      navigate("/login");
      return;
    }
    if (!loadingAuth && isLoggedIn && user?.mustChangePassword) {
      console.log("WorkoutPage: Must change password, redirecting.");
      navigate("/change-password-first-login");
      return;
    }

    const fetchWorkout = async () => {
      setLoadingWorkout(true);
      setError(null);
      try {
        console.log("WorkoutPage: Attempting to fetch workout...");
        console.log("WorkoutPage: User from context:", user);
        console.log("WorkoutPage: Program Name from URL params:", programName);
        console.log("WorkoutPage: Day Number from URL params:", dayNum);

        if (!user || (user.role !== 'user' && user.role !== 'admin')) {
          setError("You are not authorised to view this program.");
          setLoadingWorkout(false);
          return;
        }

        if (user.role === 'user' && !user.purchasedPrograms.includes(programName)) {
          console.log("WorkoutPage: User has an account but does not have the program in purchasedPrograms.");
          setError("You are not authorised to view this program.");
          setLoadingWorkout(false);
          return;
        }

        const authToken = localStorage.getItem('jwtToken');
        if (!authToken) {
            console.log("WorkoutPage: Authentication token not found.");
            throw new Error("Authentication token not found.");
        }

         const savedProgress = localStorage.getItem('workoutProgress');

        // Use programName from URL params to build the fetch URL
        const response = await fetch(`${BACKEND_URL}/api/workouts/${programName}/day/${dayNum}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`, 
            'Content-Type': 'application/json'
          }
        });

         if (!response.ok) {
          const errorData = await response.json();
          console.error("WorkoutPage: Backend response error:", errorData);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
        }

        const data = await response.json();
        console.log("WorkoutPage: Successfully fetched workout data:", data);

        if (data.workoutBlocks && data.workoutBlocks.length > 0) {
          setWorkoutData(data);
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            if (
              progress.programName === programName &&
              progress.dayNumber === dayNum
            ) {
              setCurrentBlockIndex(progress.blockIndex);
              setCurrentExerciseIndex(progress.exerciseIndex);
              setIsRestPeriod(progress.isRestPeriod);
              setShowPreview(false);
            } else {
              localStorage.removeItem('workoutProgress');
            }
          }

        } else {
          setError("Workout data is missing blocks.");
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
  }, [isLoggedIn, loadingAuth, navigate, user, dayNum, programName, showToast]);

  // Helper functions to manage the workout flow
  const handleStartWorkout = useCallback(() => {
    setShowPreview(false);
    setCurrentBlockIndex(0);
    setCurrentExerciseIndex(0);
    setIsRestPeriod(false);
    setWorkoutComplete(false);
  }, []);

  const handleExerciseComplete = useCallback(() => {
    if (!workoutData) return; 

    const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
    const nextExerciseExistsInBlock = currentExerciseIndex < currentBlock.exercises.length - 1;

    if (isRestPeriod) {
      setIsRestPeriod(false); 
      if (nextExerciseExistsInBlock) {
        setCurrentExerciseIndex(currentExerciseIndex + 1); 
      } else {
        const nextBlockExists = currentBlockIndex < workoutData.workoutBlocks.length - 1;
        if (nextBlockExists) {
          setCurrentBlockIndex(currentBlockIndex + 1); 
          setCurrentExerciseIndex(0);
        } else {
          setWorkoutComplete(true);
          showToast("success", "Workout completed! Great job!");
        }
      }
    } else {
      if (nextExerciseExistsInBlock || currentBlockIndex < workoutData.workoutBlocks.length - 1) {
        setIsRestPeriod(true); 
      } else {
        setWorkoutComplete(true);
        showToast("success", "Workout completed! Great job!");
      }
    }
  }, [currentBlockIndex, currentExerciseIndex, isRestPeriod, workoutData, showToast]);

  const handleGoBack = useCallback(() => {
    if (isRestPeriod) {
      setIsRestPeriod(false);
    } else {
      const prevBlockExists = currentBlockIndex > 0;
      if (currentExerciseIndex > 0) {
        setCurrentExerciseIndex(currentExerciseIndex - 1);
        setIsRestPeriod(true); 
      } else if (prevBlockExists) {
        const prevBlock = workoutData.workoutBlocks[currentBlockIndex - 1];
        setCurrentBlockIndex(currentBlockIndex - 1);
        setCurrentExerciseIndex(prevBlock.exercises.length - 1);
        setIsRestPeriod(true); 
      }
    }
  }, [currentBlockIndex, currentExerciseIndex, isRestPeriod, workoutData]);

  const getCurrentExercise = useCallback(() => {
    if (!workoutData || !workoutData.workoutBlocks || workoutData.workoutBlocks.length === 0) {
      return null;
    }
    const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
    if (isRestPeriod) {
      return {
        name: "Rest",
        rest: currentBlock.exercises[currentExerciseIndex]?.restDuration || "30 seconds",
        exercise: { name: "Rest" } 
      };
    }
    const currentExercise = currentBlock.exercises[currentExerciseIndex];
    if (currentExercise.Reps === "Max Time") {
      return {
        ...currentExercise,
        isStopwatch: true
      };
    }
    return currentExercise;
  }, [workoutData, currentBlockIndex, currentExerciseIndex]);

  const getNextExercise = useCallback(() => {
    if (!workoutData || !workoutData.workoutBlocks || workoutData.workoutBlocks.length === 0) {
      return null;
    }
    const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
    if (currentExerciseIndex < currentBlock.exercises.length - 1) {
      return currentBlock.exercises[currentExerciseIndex + 1];
    }
    if (currentBlockIndex < workoutData.workoutBlocks.length - 1) {
      const nextBlock = workoutData.workoutBlocks[currentBlockIndex + 1];
      return nextBlock.exercises[0];
    }
    return null;
  }, [workoutData, currentBlockIndex, currentExerciseIndex]);

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

  if (!workoutData || !workoutData.workoutBlocks || workoutData.workoutBlocks.length === 0) {
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
            workoutData={workoutData}
            onStartWorkout={handleStartWorkout}
            onSkipPreview={() => setShowPreview(false)}
            onGoBackToProfile={handleGoBackToProfile} 
          />
        </div>
      </div>
    );
  }

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

  // Determine if the current exercise is a stopwatch
  const currentExerciseData = getCurrentExercise();
  const isStopwatchMode = currentExerciseData?.isStopwatch;
  const isFirstExercise = currentBlockIndex === 0 && currentExerciseIndex === 0 && !isRestPeriod;

  // Progress Calculation
  const totalExercisesInWorkout = workoutData.workoutBlocks.reduce(
    (total, block) => total + block.exercises.length,
    0
  );

  let exercisesCompleted = 0;
  for (let i = 0; i < currentBlockIndex; i++) {
    exercisesCompleted += workoutData.workoutBlocks[i].exercises.length;
  }
  exercisesCompleted += currentExerciseIndex;

  const progressPercentage = (exercisesCompleted / totalExercisesInWorkout) * 100;

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
            <p>
              {workoutData.workoutBlocks[currentBlockIndex].blockType}:{" "}
              {workoutData.workoutBlocks[currentBlockIndex].blockNotes}
            </p>
            <p className="text-sm mt-1">
              Exercise {currentExerciseIndex + 1} of{" "}
              {workoutData.workoutBlocks[currentBlockIndex].exercises.length}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {isRestPeriod ? (
                // Display a simple placeholder during rest periods
                <div className="bg-gray-700 rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
                    <div className="text-6xl text-limeGreen mb-4">🧘</div>
                    <h3 className="text-2xl font-bold text-brightYellow mb-2">Rest Period</h3>
                    <p className="text-logoGray">Get ready for the next exercise!</p>
                    {getNextExercise() && (
                        <p className="text-logoGray mt-2 text-sm">Next up: <span className="font-semibold text-white">{getNextExercise().exercise.name}</span></p>
                    )}
                </div>
            ) : (
                // Display the video component for exercises
                <ExerciseVideo
                    exercise={getCurrentExercise()}
                    isActive={!isRestPeriod}
                />
            )}
          </div>

          {/* Timer */}
          <div>
            <WorkoutTimer
              currentExercise={getCurrentExercise()}
              nextExercise={getNextExercise()}
              onExerciseComplete={handleExerciseComplete}
              onGoBack={handleGoBack} 
              canGoBack={!isFirstExercise} 
              isRest={isRestPeriod}
              isStopwatch={isStopwatchMode} 
            />
          </div>
        </div>

         {/* Progress Bar */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between text-sm text-logoGray mb-2">
            <span>Progress</span>
            <span>
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-limeGreen to-brightYellow h-3 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;