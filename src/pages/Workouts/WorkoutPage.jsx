import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams, useSearchParams } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import { showToast } from "../../utils/toastUtil";
import WorkoutTimer from "../../components/Workouts/WorkoutTimer";
import WorkoutPreview from "../../components/Workouts/WorkoutPreview";
import ExerciseVideo from "../../components/Workouts/ExerciseVideo";
import { BACKEND_URL } from "../../utils/config";
import DynamicHeading from '../../components/Shared/DynamicHeading';
import { HashLink } from 'react-router-hash-link';

const WorkoutPage = () => {
  const { isLoggedIn, loadingAuth, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { programName, dayNumber } = useParams();
  const [searchParams] = useSearchParams();
  const [workoutData, setWorkoutData] = useState(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const isPreviewMode = searchParams.get('mode') === 'preview';
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRestPeriod, setIsRestPeriod] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [hasStartedWorkout, setHasStartedWorkout] = useState(false); 
  const dayNum = dayNumber ? parseInt(dayNumber, 10) : 1;
  const [isFirstLoad, setIsFirstLoad] = useState(true); 
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [currentModification, setCurrentModification] = useState(null);
  const [showModified, setShowModified] = useState(false);

  useEffect(() => {
    if (!showPreview && !workoutComplete) {
      const progressData = {
        programName,
        dayNumber: dayNum,
        blockIndex: currentBlockIndex,
        exerciseIndex: currentExerciseIndex,
        isRestPeriod,
        hasStartedWorkout
      };
      localStorage.setItem('workoutProgress', JSON.stringify(progressData));
    }
  }, [currentBlockIndex, currentExerciseIndex, isRestPeriod, showPreview, workoutComplete, programName, dayNum]);

  useEffect(() => {
    const handleCompletion = async () => {
      if (workoutComplete) {
        localStorage.removeItem('workoutProgress');
        showToast("success", "Workout completed! Great job!");
  
        try {
          const authToken = localStorage.getItem('jwtToken');
          const response = await fetch(`${BACKEND_URL}/api/workouts/complete-day`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ programName, dayNumber: dayNum })
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
          }

          // console.log("Workout completion recorded successfully");
          
          try {
            await updateUser(); 
          } catch (userUpdateError) {
            console.error("Failed to update user data after workout completion:", userUpdateError);
          }
        } catch (error) {
          console.error("Failed to update user completion status:", error);
        }
      }
    };
    handleCompletion();
  }, [workoutComplete, programName, dayNum, updateUser]);

  const handleGoBackToProgram = () => {
    navigate(`/workouts/${programName}/list`);
  };

  const handleShowModificationModal = useCallback((modificationData) => {
    setCurrentModification(modificationData);
    setShowModificationModal(true);
  }, []);

  useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      // console.log("WorkoutPage: Not logged in, redirecting to login.");
      navigate("/login");
      return;
    }
    if (!loadingAuth && isLoggedIn && user?.mustChangePassword) {
      // console.log("WorkoutPage: Must change password, redirecting.");
      navigate("/change-password-first-login");
      return;
    }

    const fetchWorkout = async () => {
      setLoadingWorkout(true);
      setError(null);
      try {
        // console.log("WorkoutPage: Attempting to fetch workout...");
        // console.log("WorkoutPage: User from context:", user);
        // console.log("WorkoutPage: Program Name from URL params:", programName);
        // console.log("WorkoutPage: Day Number from URL params:", dayNum);
        // console.log("WorkoutPage: Is Preview Mode:", isPreviewMode);
        
        if (!user || (user.role !== 'user' && user.role !== 'admin')) {
          setError("You are not authorised to view this program.");
          setLoadingWorkout(false);
          return;
        }

        if (user.role === 'user' && !user.purchasedPrograms.includes(programName)) {
          // console.log("WorkoutPage: User has an account but does not have the program in purchasedPrograms.");
          setError("You are not authorised to view this program.");
          setLoadingWorkout(false);
          return;
        }

        const authToken = localStorage.getItem('jwtToken');
        if (!authToken) {
            // console.log("WorkoutPage: Authentication token not found.");
            throw new Error("Authentication token not found.");
        }

        const savedProgress = localStorage.getItem('workoutProgress');

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
        // console.log("WorkoutPage: Successfully fetched workout data:", data);

        if (data.workoutBlocks && data.workoutBlocks.length > 0) {
          setWorkoutData(data);
          
          if (isPreviewMode) {
            setShowPreview(true);
          } else if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            if (
              progress.programName === programName &&
              progress.dayNumber === dayNum
            ) {
              setCurrentBlockIndex(progress.blockIndex);
              setCurrentExerciseIndex(progress.exerciseIndex);
              setIsRestPeriod(progress.isRestPeriod);
              setHasStartedWorkout(progress.hasStartedWorkout || false);
              setShowPreview(false);
            } else {
              localStorage.removeItem('workoutProgress');
              if (isFirstLoad) {
                setShowPreview(true);
              }
            }
          } else {
            if (isFirstLoad) {
              setShowPreview(true);
            }
          }
          setIsFirstLoad(false);
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

  const handleStartWorkout = useCallback(() => {
    if (isPreviewMode) {
      navigate(`/workouts/${programName}/${dayNumber}`); 
      return;
    }
    setShowPreview(false);
    setCurrentBlockIndex(0);
    setCurrentExerciseIndex(0);
    setIsRestPeriod(false);
    setWorkoutComplete(false);
    setHasStartedWorkout(false); 
  }, [isPreviewMode, navigate, programName, dayNumber]);

  const handleExerciseComplete = useCallback(() => {
      if (!workoutData) return;
      if (!hasStartedWorkout) {
        setHasStartedWorkout(true);
      }
      const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
      if (isRestPeriod) {
          setIsRestPeriod(false);
          const nextExerciseExistsInBlock = currentExerciseIndex < currentBlock.exercises.length - 1;
          if (nextExerciseExistsInBlock) {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
          } else {
              const nextBlockExists = currentBlockIndex < workoutData.workoutBlocks.length - 1;
              if (nextBlockExists) {
                  setCurrentBlockIndex(currentBlockIndex + 1);
                  setCurrentExerciseIndex(0);
              } else {
                  setWorkoutComplete(true);
                  // showToast("success", "Workout completed! Great job!");
              }
          }
      } else {
          const nextExerciseExistsInBlock = currentExerciseIndex < currentBlock.exercises.length - 1;
          const nextBlockExists = currentBlockIndex < workoutData.workoutBlocks.length - 1;
          if (nextExerciseExistsInBlock || nextBlockExists) {
              setIsRestPeriod(true);
          } else {
              setWorkoutComplete(true);
              // showToast("success", "Workout completed! Great job!");
          }
      }
  }, [currentBlockIndex, currentExerciseIndex, isRestPeriod, workoutData, showToast, hasStartedWorkout]);

  const handleGoBack = useCallback(() => {
      if (isRestPeriod) {
          setIsRestPeriod(false);
      } else {
          if (currentExerciseIndex > 0) {
              setCurrentExerciseIndex(currentExerciseIndex - 1);
          } else if (currentBlockIndex > 0) {
              const prevBlock = workoutData.workoutBlocks[currentBlockIndex - 1];
              setCurrentBlockIndex(currentBlockIndex - 1);
              setCurrentExerciseIndex(prevBlock.exercises.length - 1);
          } else {
              setShowPreview(true);
              setHasStartedWorkout(false);
          }
      }
  }, [currentBlockIndex, currentExerciseIndex, isRestPeriod, workoutData]);

  const getCurrentExercise = useCallback(() => {
    if (!workoutData || !workoutData.workoutBlocks || workoutData.workoutBlocks.length === 0) {
      return null;
    }
    const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
    const currentWorkoutExercise = currentBlock?.exercises[currentExerciseIndex];

    // console.log("DEBUG getCurrentExercise:", {
    //   currentWorkoutExercise,
    //   isRestPeriod,
    //   currentBlockIndex,
    //   currentExerciseIndex
    // });

    if (!currentWorkoutExercise) {
        return null;
    }
    
    if (isRestPeriod) {
      return {
        name: "Rest",
        // rest: currentBlock.exercises[currentExerciseIndex]?.rest || "30 seconds",
        rest: currentWorkoutExercise?.rest || "30 seconds",
        exercise: { name: "Rest" } 
      };
    }

    // let exerciseData;

    const baseExercise = currentWorkoutExercise.exercise;
    const modifiedExercise = baseExercise?.modification;

    // const activeExercise = showModified && modifiedExercise ? modifiedExercise : baseExercise;

  const exerciseData = {
    exercise: {
      name: baseExercise.name,
      videoId: baseExercise.videoId,
      instructions: baseExercise.instructions,
      tips: baseExercise.tips,
      // Put the modification inside the exercise object
      modification: modifiedExercise ? {
        name: modifiedExercise.name,
        videoId: modifiedExercise.videoId,
        instructions: modifiedExercise.instructions,
        tips: modifiedExercise.tips,
        description: modifiedExercise.description
      } : null
    },
    duration: currentWorkoutExercise.duration,
    rest: currentWorkoutExercise.rest,
    // Also keep instructions and tips at the top level for the timer
    instructions: (showModified && modifiedExercise ? modifiedExercise.instructions : baseExercise.instructions) || currentWorkoutExercise.instructions || "",
    tips: (showModified && modifiedExercise ? modifiedExercise.tips : baseExercise.tips) || currentWorkoutExercise.tips || "",
    modification: modifiedExercise, // Keep this for the timer component
    isStopwatch: currentWorkoutExercise.duration === "Max Time"
  };

  // console.log("DEBUG exerciseData result:", exerciseData);
  return exerciseData;
}, [workoutData, currentBlockIndex, currentExerciseIndex, isRestPeriod, showModified]);

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

if (showPreview || isPreviewMode) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-customGray/30 to-white">
      <WorkoutPreview
        workoutData={workoutData}
        onStartWorkout={handleStartWorkout}
        onGoBackToProgram={handleGoBackToProgram} 
      />
    </div>
  );
}

  if (workoutComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-4 rounded-lg text-center max-w-5xl w-full h-full lg:max-h-[90vh] flex flex-col border-brightYellow border-2r">
          <div className="text-6xl mb-6">🎉</div>
          <DynamicHeading
            text="Workout Complete"
            className="font-higherJump text-2xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
          />
          <p className="text-lg text-logoGray my-6">
            Great job completing today&apos;s workout! <br/> You are another step closer to your fitness goals.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleGoBackToProgram}
              className="btn-full-colour mr-2 md:mr-4"
            >
              Back to Program
            </button>
            <button
              onClick={() => {
                setShowPreview(true);
                setWorkoutComplete(false);
                setHasStartedWorkout(false);
              }}
              className="btn-cancel mt-2 px-6 py-3 md:mt-6"
            >
              Restart Workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentExerciseData = getCurrentExercise();
  const isStopwatchMode = currentExerciseData?.isStopwatch;
  const isFirstExercise = currentBlockIndex === 0 && currentExerciseIndex === 0 && !isRestPeriod;
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

  const shouldAutoStart = hasStartedWorkout || !isFirstExercise;

  // Show active workout
  return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
            <div className="bg-customGray p-4 rounded-lg text-center max-w-5xl w-full h-full lg:max-h-[110vh] flex flex-col border-brightYellow border-2 mt-20 md:mt-26">

                {/* Workout Title and Buttons at the top */}
                <div className="flex flex-col">
                    <DynamicHeading
                        text={workoutData.title}
                        className="font-higherJump m-4 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
                    />

                    {/* Buttons*/}
                    <div className="flex flex-col md:flex-row justify-center items-center md:m-4">
                      <button
                        onClick={handleGoBackToProgram} // <-- corrected
                        className="btn-cancel mt-0"
                      >
                        Back to Overview
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl p-4 md:p-0 md:mb-4">
                      {workoutData.description && (
                        <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                              <span className="text-limeGreen font-bold">Description:</span> {workoutData.description}
                          </p>
                        </div>
                      )}

                      {workoutData.workoutBlocks[currentBlockIndex]?.blockNotes && (
                        <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-3 text-center">
                          <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                            <span className="text-limeGreen font-bold">Notes:</span> {workoutData.workoutBlocks[currentBlockIndex].blockNotes}
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Main content grid for video and timer */}
                <div className="flex-grow flex flex-col lg:flex-row-reverse lg:items-start justify-center gap-6 overflow-hidden mt-2 md:mt-4">
                  {/* Right Column: Timer, Instructions, and Progress */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <WorkoutTimer
                            key={`${currentBlockIndex}-${currentExerciseIndex}-${hasStartedWorkout}`}
                            currentBlockType={workoutData.workoutBlocks[currentBlockIndex].blockType}
                            currentExerciseNumber={currentExerciseIndex + 1}
                            totalExercisesInBlock={workoutData.workoutBlocks[currentBlockIndex].exercises.length}
                            currentExercise={currentExerciseData} 
                            nextExercise={getNextExercise()}
                            onExerciseComplete={handleExerciseComplete}
                            onGoBack={handleGoBack}
                            canGoBack={!isFirstExercise}
                            isRest={isRestPeriod}
                            isStopwatch={isStopwatchMode}
                            exerciseInstructions={currentExerciseData?.instructions} 
                            exerciseTips={currentExerciseData?.tips} 
                            progressPercentage={progressPercentage}
                            onShowModificationModal={handleShowModificationModal} 
                            currentModification={currentModification} 
                            setShowModificationModal={setShowModificationModal}
                            shouldAutoStart={shouldAutoStart}
                            setShowModified={setShowModified}
                            showModified={showModified} 
                        />

                      {showModificationModal && currentModification && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
                            <div className="bg-customGray p-6 rounded-lg max-w-xl w-full text-center">
                                <h3 className="text-2xl font-bold text-customWhite mb-4">
                                    Modification: {currentModification.name}
                                </h3>
                                <ExerciseVideo exercise={{ exercise: currentModification }} isActive={true} />
                                <p className="text-logoGray my-4">{currentModification.description}</p>
                                <button
                                    onClick={() => setShowModificationModal(false)}
                                    className="btn-primary"
                                >
                                    Back to Workout
                                </button>
                            </div>
                        </div>
                    )}
                    </div>


                    {/* Left Column: Video */}
                    <div className="w-full lg:w-1/2">
                        {isRestPeriod ? (
                            <div className="bg-gray-700 rounded-lg p-10 h-fit flex flex-col items-center justify-center text-center">
                                <div className="text-8xl mb-4">🧘</div>
                                <h3 className="text-xl font-bold text-brightYellow mb-2">Rest Period</h3>
                                <p className="text-logoGray text-md">Get ready for the next exercise</p>
                                {getNextExercise() && (
                                    <p className="text-logoGray mt-2 text-md">Next up: <span className="font-semibold text-white">{getNextExercise().exercise.name}</span></p>
                                )}
                            </div>
                        ) : (
                            <ExerciseVideo
                                exercise={currentExerciseData}
                                isActive={!isRestPeriod}
                                shouldAutoStart={shouldAutoStart}
                                showModified={showModified}
                            />
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default WorkoutPage;