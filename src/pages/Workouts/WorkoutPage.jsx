import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { showToast } from "../../utils/toastUtil";
import WorkoutTimer from "../../components/Workouts/WorkoutTimer";
import WorkoutPreview from "../../components/Workouts/WorkoutPreview";
import ExerciseVideo from "../../components/Workouts/ExerciseVideo";
import AMRAPWorkout from "../../components/Workouts/AMRAPWorkout";
import EMOMWorkout from "../../components/Workouts/EMOMWorkout";
import MobilityWorkout from "../../components/Workouts/MobilityWorkout";
import TabataWorkout from "../../components/Workouts/TabataWorkout";
import ForTimeWorkout from "../../components/Workouts/ForTimeWorkout";
import WorkoutChoice from "../../components/Workouts/WorkoutChoice";
import { BACKEND_URL } from "../../utils/config";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import { getToggleButtonText } from "../../utils/exerciseUtils";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
import useAnalytics from "../../hooks/useAnalytics";

const parseDurationToSeconds = (duration) => {
  if (typeof duration === "number") return duration;
  if (typeof duration === "string") {
    if (duration.trim() === "" || duration === "0s" || duration === "0") {
      return 0;
    }

    const match = duration.match(
      /(\d+)\s*(seconds?|secs?|sec|s|minutes?|mins?|min|m)/i
    );
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();

      if (unit.includes("min") || unit === "m") {
        return value * 60;
      }
      return value;
    }
  }
  return 0;
};

const WorkoutPage = () => {
  const { isLoggedIn, loadingAuth, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { programName, dayNumber } = useParams();
  const [searchParams] = useSearchParams();
  const { trackWorkoutStart, trackWorkoutComplete } = useAnalytics();
  const [workoutData, setWorkoutData] = useState(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const isPreviewMode = searchParams.get("mode") === "preview";
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRestPeriod, setIsRestPeriod] = useState(false);
  const [isRoundRest, setIsRoundRest] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [hasStartedWorkout, setHasStartedWorkout] = useState(false);
  const dayNum = dayNumber ? parseInt(dayNumber, 10) : 1;
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [currentModification, setCurrentModification] = useState(null);
  const [workoutChoice, setWorkoutChoice] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentSessionData, setCurrentSessionData] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [showModified, setShowModified] = useState({});
  const { audioEnabled, volume, startSound, toggleAudio, setVolumeLevel, setStartSoundType, playBeep, playStartSound } = useWorkoutAudio();

  useEffect(() => {
    if (!showPreview && !workoutComplete) {
      const progressData = {
        programName,
        dayNumber: dayNum,
        blockIndex: currentBlockIndex,
        exerciseIndex: currentExerciseIndex,
        currentRound,
        isRestPeriod,
        isRoundRest,
        hasStartedWorkout,
      };
      localStorage.setItem("workoutProgress", JSON.stringify(progressData));
    }
  }, [
    currentBlockIndex,
    currentExerciseIndex,
    isRestPeriod,
    showPreview,
    workoutComplete,
    programName,
    dayNum,
  ]);

  useEffect(() => {
    const handleCompletion = async () => {
      if (workoutComplete) {
        localStorage.removeItem("workoutProgress");
        showToast("success", "Workout completed! Great job!");
        try {
          const authToken = localStorage.getItem("jwtToken");
          const response = await fetch(
            `${BACKEND_URL}/api/workouts/complete-day`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({ programName, dayNumber: dayNum }),
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${
                errorData.error || "Unknown error"
              }`
            );
          }
          // console.log("Workout completion recorded successfully");
          try {
            await updateUser();
          } catch (userUpdateError) {
            console.error(
              "Failed to update user data after workout completion:",
              userUpdateError
            );
          }
        } catch (error) {
          console.error("Failed to update user completion status:", error);
        }
      }
    };
    handleCompletion();
  }, [workoutComplete, programName, dayNum, updateUser]);

  const handleShowModificationModal = useCallback((modificationData) => {
    setCurrentModification(modificationData);
    setShowModificationModal(true);
  }, []);

  const handleOriginalClick = useCallback(() => {
    if (typeof setShowModified === "function") {
      setShowModified(prev => ({ ...prev, [currentExerciseIndex]: false }));
    }
  }, [setShowModified, currentExerciseIndex]);

  const handleModifiedClick = useCallback(() => {
    if (typeof setShowModified === "function") {
      setShowModified(prev => ({ ...prev, [currentExerciseIndex]: true }));
    }
  }, [setShowModified, currentExerciseIndex]);

  const handleStartWorkout = useCallback(() => {
    if (isPreviewMode) {
      navigate(`/workouts/${programName}/${dayNumber}`);
      return;
    }
    
    // Track workout start
    const workoutType = workoutData?.workoutBlocks?.[0]?.blockType || 'General';
    trackWorkoutStart(workoutType, programName);
    localStorage.setItem('workoutStartTime', Date.now().toString());
    
    setShowPreview(false);
    setCurrentBlockIndex(0);
    setCurrentExerciseIndex(0);
    setCurrentRound(1);
    setIsRestPeriod(false);
    setIsRoundRest(false);
    setWorkoutComplete(false);
    setHasStartedWorkout(false);
    setWorkoutChoice(null);
    setCurrentSession(null);
  }, [isPreviewMode, navigate, programName, dayNumber]);

  const handleExerciseComplete = useCallback(() => {
    // console.log("handleExerciseComplete called - current state:", {
    //   currentSession,
    //   isRestPeriod,
    //   isRoundRest,
    //   currentExerciseIndex,
    //   currentRound,
    //   hasStartedWorkout,
    // });
    if (!workoutData) return;
    if (!hasStartedWorkout) {
      setHasStartedWorkout(true);
    }
    const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
    const blockRounds = currentBlock.blockRounds || 1;
    const isAMRAP = currentBlock.blockType === "AMRAP";
    const isEMOM = currentBlock.blockType === "EMOM";
    const isTabata = currentBlock.blockType === "Tabata";
    const isForTime = currentBlock.blockType === "For Time";
    const hasRoundRest =
      currentBlock.roundRest && currentBlock.roundRest !== "";
    if (isAMRAP || isEMOM || isTabata || isForTime) {
      return;
    }
    if (isRoundRest) {
      setIsRoundRest(false);
      if (isAMRAP) {
        setCurrentExerciseIndex(0);
      } else {
        setCurrentRound(currentRound + 1);
        setCurrentExerciseIndex(0);
      }
    } else if (isRestPeriod) {
      setIsRestPeriod(false);
      const nextExerciseExistsInBlock =
        currentExerciseIndex < currentBlock.exercises.length - 1;
      if (nextExerciseExistsInBlock) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        if (isAMRAP || currentRound < blockRounds) {
          if (hasRoundRest && !isAMRAP && currentRound < blockRounds) {
            setIsRoundRest(true);
          } else if (isAMRAP) {
            setCurrentExerciseIndex(0);
          } else {
            setCurrentRound(currentRound + 1);
            setCurrentExerciseIndex(0);
          }
        } else {
          if (currentSessionData && currentSessionData.blockIndices) {
            const currentIndexInSession = currentSessionData.blockIndices.indexOf(currentBlockIndex);
            const nextBlockInSession = currentIndexInSession < currentSessionData.blockIndices.length - 1;
            
            if (nextBlockInSession) {
              const nextBlockIndex = currentSessionData.blockIndices[currentIndexInSession + 1];
              setCurrentBlockIndex(nextBlockIndex);
              setCurrentExerciseIndex(0);
              setCurrentRound(1);
            } else {
              handleWorkoutSessionComplete();
            }
          } else {
            const nextBlockExists = currentBlockIndex < workoutData.workoutBlocks.length - 1;
            if (nextBlockExists) {
              const workoutSessions = getWorkoutSessions();
              const isMultiSession = workoutSessions.length > 1 || hasMobilityBlock();
              
              if (isMultiSession) {
                handleWorkoutSessionComplete();
              } else {
                setCurrentBlockIndex(currentBlockIndex + 1);
                setCurrentExerciseIndex(0);
                setCurrentRound(1);
              }
            } else {
              handleWorkoutSessionComplete();
            }
          }
        }
      }
    } else {
      const nextExerciseExistsInBlock =
        currentExerciseIndex < currentBlock.exercises.length - 1;
      const hasMoreRounds = isAMRAP || currentRound < blockRounds;
      const nextBlockExists =
        currentBlockIndex < workoutData.workoutBlocks.length - 1;
      const isLastExerciseInRound = !nextExerciseExistsInBlock;
      if (isLastExerciseInRound && hasRoundRest && currentRound < blockRounds) {
        setIsRoundRest(true);
      } else if (
        nextExerciseExistsInBlock ||
        hasMoreRounds ||
        nextBlockExists
      ) {
        const currentExercise = currentBlock.exercises[currentExerciseIndex];
        const restDuration = parseDurationToSeconds(
          currentExercise?.rest || "0s"
        );

        if (restDuration > 0) {
          setIsRestPeriod(true);
        } else {
          if (nextExerciseExistsInBlock) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
          } else if (currentRound < blockRounds) {
            if (hasRoundRest) {
              setIsRoundRest(true);
            } else {
              setCurrentRound(currentRound + 1);
              setCurrentExerciseIndex(0);
            }
          } else {
            if (currentSessionData && currentSessionData.blockIndices) {
              const currentIndexInSession = currentSessionData.blockIndices.indexOf(currentBlockIndex);
              const nextBlockInSession = currentIndexInSession < currentSessionData.blockIndices.length - 1;
              
              if (nextBlockInSession) {
                const nextBlockIndex = currentSessionData.blockIndices[currentIndexInSession + 1];
                setCurrentBlockIndex(nextBlockIndex);
                setCurrentExerciseIndex(0);
                setCurrentRound(1);
              } else {
                handleWorkoutSessionComplete();
              }
            } else {
              const nextBlockExists = currentBlockIndex < workoutData.workoutBlocks.length - 1;
              if (nextBlockExists) {
                const workoutSessions = getWorkoutSessions();
                const isMultiSession = workoutSessions.length > 1 || hasMobilityBlock();
                
                if (isMultiSession) {
                  handleWorkoutSessionComplete();
                } else {
                  setCurrentBlockIndex(currentBlockIndex + 1);
                  setCurrentExerciseIndex(0);
                  setCurrentRound(1);
                }
              } else {
                handleWorkoutSessionComplete();
              }
            }
          }
        }
      } else {
        handleWorkoutSessionComplete();
      }
    }
  }, [
    currentBlockIndex,
    currentExerciseIndex,
    currentRound,
    isRestPeriod,
    isRoundRest,
    workoutData,
    showToast,
    hasStartedWorkout,
  ]);

  const hasMobilityBlock = useCallback(() => {
    return (
      workoutData?.workoutBlocks?.some(
        (block) => block.blockType === "Mobility"
      ) || false
    );
  }, [workoutData]);

  const hasRegularWorkout = useCallback(() => {
    return (
      workoutData?.workoutBlocks?.some(
        (block) => block.blockType !== "Mobility"
      ) || false
    );
  }, [workoutData]);

  const getMobilityBlock = useCallback(() => {
    return workoutData?.workoutBlocks?.find(
      (block) => block.blockType === "Mobility"
    );
  }, [workoutData]);

  const handleGoBackToProgram = useCallback(async () => {
    const isRecoveryDay = hasMobilityBlock() && hasRegularWorkout();
    const mobilityCompleted = completedSessions.includes("mobility");

    if (isRecoveryDay && mobilityCompleted && !workoutComplete) {
      try {
        localStorage.removeItem("workoutProgress");

        const authToken = localStorage.getItem("jwtToken");
        const response = await fetch(
          `${BACKEND_URL}/api/workouts/complete-day`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ programName, dayNumber: dayNum }),
          }
        );

        if (response.ok) {
          try {
            await updateUser();
          } catch (userUpdateError) {
            console.error(
              "Failed to update user data after workout completion:",
              userUpdateError
            );
          }
        }
      } catch (error) {
        console.error("Failed to update user completion status:", error);
      }
    }

    navigate(`/workouts/${programName}/list`);
  }, [
    hasMobilityBlock,
    hasRegularWorkout,
    completedSessions,
    workoutComplete,
    programName,
    dayNum,
    updateUser,
    navigate,
  ]);

  const handleWorkoutChoice = (choice, sessionData = null) => {
    setWorkoutChoice(choice);
    if (choice === "mobility") {
      setCurrentSession("mobility");
      setCurrentSessionData(null);
    } else if (choice === "workout") {
      setCurrentSession("workout");
      setCurrentSessionData(sessionData);

      if (
        sessionData &&
        sessionData.blockIndices &&
        sessionData.blockIndices.length > 0
      ) {
        setCurrentBlockIndex(sessionData.blockIndices[0]);
      } else {
        const firstRegularBlockIndex = workoutData.workoutBlocks.findIndex(
          (block) => block.blockType !== "Mobility"
        );
        setCurrentBlockIndex(firstRegularBlockIndex);
      }

      setCurrentExerciseIndex(0);
      setCurrentRound(1);
      setIsRestPeriod(false);
      setIsRoundRest(false);
      setHasStartedWorkout(false);
    }
  };

  const handleMobilityComplete = () => {
    const newCompleted = [...completedSessions, "mobility"];
    setCompletedSessions(newCompleted);

    const isRecoveryDay = hasMobilityBlock() && hasRegularWorkout();

    if (!isRecoveryDay) {
      setWorkoutComplete(true);
    } else {
      handleGoBackToChoice();
    }
  };

  const handleMobilityFinishDay = useCallback(() => {
    const newCompleted = completedSessions.includes("mobility")
      ? completedSessions
      : [...completedSessions, "mobility"];
    setCompletedSessions(newCompleted);

    setWorkoutComplete(true);
  }, [completedSessions]);

  const handleOptionalWorkoutComplete = useCallback(() => {
    setCurrentSession(null);
    setWorkoutChoice(null);
    setCurrentSessionData(null);
    setCurrentBlockIndex(0);
    setCurrentExerciseIndex(0);
    setCurrentRound(1);
    setIsRestPeriod(false);
    setIsRoundRest(false);
    setHasStartedWorkout(false);
  }, []);

  const handleGoBackToChoice = useCallback(() => {
    setCurrentSession(null);
    setWorkoutChoice(null);
    setCurrentSessionData(null);
    setCurrentBlockIndex(0);
    setCurrentExerciseIndex(0);
    setCurrentRound(1);
    setIsRestPeriod(false);
    setIsRoundRest(false);
    setHasStartedWorkout(false);
  }, []);

  const getBackHandler = useCallback(() => {
    const isRecoveryDay =
      workoutData?.title?.includes("Recovery day") ||
      workoutData?.description?.includes("AND/OR");
    return isRecoveryDay ? handleGoBackToChoice : handleGoBackToProgram;
  }, [workoutData, handleGoBackToChoice, handleGoBackToProgram]);

  const handleCircuitGoBack = useCallback(() => {
    if (isRoundRest) {
      setIsRoundRest(false);
      const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
      setCurrentExerciseIndex(currentBlock.exercises.length - 1);
      if (currentRound > 1) {
        setCurrentRound(currentRound - 1);
      }
    } else if (isRestPeriod) {
      setIsRestPeriod(false);
    } else {
      if (currentExerciseIndex > 0) {
        setCurrentExerciseIndex(currentExerciseIndex - 1);
        const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
        const prevExercise = currentBlock.exercises[currentExerciseIndex - 1];
        const restDuration = parseDurationToSeconds(prevExercise?.rest || "0s");
        if (restDuration > 0) {
          setIsRestPeriod(true);
        }
      } else if (currentRound > 1) {
        const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
        setCurrentRound(currentRound - 1);
        setCurrentExerciseIndex(currentBlock.exercises.length - 1);
        const hasRoundRest = currentBlock.roundRest && currentBlock.roundRest !== "";
        if (hasRoundRest) {
          setIsRoundRest(true);
        }
      } else if (currentBlockIndex > 0) {
        const prevBlock = workoutData.workoutBlocks[currentBlockIndex - 1];
        const prevBlockRounds = prevBlock.blockRounds || 1;
        setCurrentBlockIndex(currentBlockIndex - 1);
        setCurrentRound(prevBlockRounds);
        setCurrentExerciseIndex(prevBlock.exercises.length - 1);
      } else {
        const isRecoveryDay =
          workoutData?.title?.includes("Recovery day") ||
          workoutData?.description?.includes("AND/OR");
        if (isRecoveryDay) {
          handleGoBackToChoice();
        } else {
          handleGoBackToProgram();
        }
      }
    }
  }, [
    isRoundRest,
    isRestPeriod,
    currentExerciseIndex,
    currentRound,
    currentBlockIndex,
    workoutData,
    handleGoBackToChoice,
    handleGoBackToProgram,
  ]);

  const getWorkoutSessions = useCallback(() => {
    if (!workoutData?.workoutBlocks) return [];

    const sessions = [];
    let currentSession = [];
    let sessionIndex = 0;

    const nonMobilityBlocks = workoutData.workoutBlocks.filter(
      (block) => block.blockType !== "Mobility"
    );

    if (nonMobilityBlocks.length <= 1) {
      if (nonMobilityBlocks.length === 1) {
        const blockIndex = workoutData.workoutBlocks.findIndex(
          (b) => b === nonMobilityBlocks[0]
        );
        sessions.push({
          id: 0,
          blocks: [nonMobilityBlocks[0]],
          blockIndices: [blockIndex],
        });
      }
      return sessions;
    }

    const title = workoutData.title?.toLowerCase() || "";
    const description = workoutData.description?.toLowerCase() || "";
    const hasMultipleCircuits =
      title.includes("circuit") && nonMobilityBlocks.length > 1;
    const hasFinisher =
      description.includes("finisher") ||
      workoutData.workoutBlocks.some((b) =>
        b.blockNotes?.toLowerCase().includes("finisher")
      );
    const specialBlockTypes = [
      ...new Set(
        workoutData.workoutBlocks
          .filter((b) =>
            ["AMRAP", "EMOM", "Tabata", "For Time", "Circuit"].includes(
              b.blockType
            )
          )
          .map((b) => b.blockType)
      ),
    ];

    const hasMultipleSpecialBlocks =
      specialBlockTypes.length > 1 ||
      (specialBlockTypes.length === 1 &&
        specialBlockTypes[0] !== "Tabata" &&
        workoutData.workoutBlocks.filter(
          (b) => b.blockType === specialBlockTypes[0]
        ).length > 1);

    const shouldForceMulti =
      hasMultipleCircuits || hasFinisher || hasMultipleSpecialBlocks;

    workoutData.workoutBlocks.forEach((block, index) => {
      if (block.blockType === "Mobility") return;

      let isNewSession = false;

      if (currentSession.length === 0) {
        isNewSession = false;
      } else {
        const lastBlock = currentSession[currentSession.length - 1];

        isNewSession =
          block.sessionBreak ||
          (block.blockNotes &&
            (block.blockNotes.toLowerCase().includes("workout") ||
              block.blockNotes.toLowerCase().includes("circuit") ||
              block.blockNotes.toLowerCase().includes("finisher"))) ||
          (block.blockType !== lastBlock.blockType &&
            !(
              block.blockType === "Tabata" && lastBlock.blockType === "Tabata"
            )) ||
          (block.blockType !== "Tabata" &&
            lastBlock.blockType !== "Tabata" &&
            ["AMRAP", "EMOM", "For Time", "Circuit"].includes(
              block.blockType
            ) &&
            ["AMRAP", "EMOM", "For Time", "Circuit"].includes(
              lastBlock.blockType
            )) ||
          (shouldForceMulti &&
            nonMobilityBlocks.length > 2 &&
            currentSession.length >= Math.ceil(nonMobilityBlocks.length / 2));
      }

      if (isNewSession && currentSession.length > 0) {
        sessions.push({
          id: sessionIndex,
          blocks: [...currentSession],
          blockIndices: currentSession.map((b) => b.originalIndex),
        });
        currentSession = [];
        sessionIndex++;
      }

      currentSession.push({ ...block, originalIndex: index });
    });

    if (currentSession.length > 0) {
      sessions.push({
        id: sessionIndex,
        blocks: [...currentSession],
        blockIndices: currentSession.map((b) => b.originalIndex),
      });
    }

    if (
      shouldForceMulti &&
      sessions.length === 1 &&
      sessions[0].blocks.length > 1
    ) {
      const blocks = sessions[0].blocks;
      const midPoint = Math.ceil(blocks.length / 2);

      return [
        {
          id: 0,
          blocks: blocks.slice(0, midPoint),
          blockIndices: blocks.slice(0, midPoint).map((b) => b.originalIndex),
        },
        {
          id: 1,
          blocks: blocks.slice(midPoint),
          blockIndices: blocks.slice(midPoint).map((b) => b.originalIndex),
        },
      ];
    }

    return sessions;
  }, [workoutData]);

  const checkAllSessionsComplete = useCallback(
    (completed) => {
      const workoutSessions = getWorkoutSessions();
      const requiredSessions = [];

      if (hasMobilityBlock()) requiredSessions.push("mobility");
      workoutSessions.forEach((session) =>
        requiredSessions.push(`workout-${session.id}`)
      );

      return requiredSessions.every((session) => completed.includes(session));
    },
    [getWorkoutSessions, hasMobilityBlock]
  );

  const handleWorkoutSessionComplete = useCallback(() => {
    const sessionId = currentSessionData
      ? `workout-${currentSessionData.id}`
      : "workout-0";
    const newCompleted = [...completedSessions, sessionId];
    setCompletedSessions(newCompleted);

    const isRecoveryDay =
      workoutData?.title?.includes("Recovery day") ||
      workoutData?.description?.includes("AND/OR");

    const allSessionsComplete = checkAllSessionsComplete(newCompleted);

    if (isRecoveryDay && workoutChoice === "workout" && !allSessionsComplete) {
      handleOptionalWorkoutComplete();
    } else if (allSessionsComplete) {
      setWorkoutComplete(true);
    } else {
      handleOptionalWorkoutComplete();
    }
  }, [
    workoutData,
    workoutChoice,
    currentSessionData,
    completedSessions,
    checkAllSessionsComplete,
    handleOptionalWorkoutComplete,
  ]);

  const getCurrentExercise = useCallback(() => {
    if (
      !workoutData ||
      !workoutData.workoutBlocks ||
      workoutData.workoutBlocks.length === 0
    ) {
      return null;
    }
    const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
    const currentWorkoutExercise =
      currentBlock?.exercises[currentExerciseIndex];
    if (!currentWorkoutExercise) {
      return null;
    }
    if (isRoundRest) {
      return {
        name: "Round Rest",
        rest: currentBlock.roundRest || "60s",
        exercise: { name: "Round Rest" },
      };
    }
    if (isRestPeriod) {
      return {
        name: "Rest",
        rest: currentWorkoutExercise?.rest || "30s",
        exercise: { name: "Rest" },
      };
    }

    const baseExercise = currentWorkoutExercise.exercise;
    const modifiedExercise = baseExercise?.modification;

    const exerciseData = {
      exercise: {
        name: showModified[currentExerciseIndex] && modifiedExercise 
          ? modifiedExercise.name 
          : baseExercise.name,
        videoId: baseExercise.videoId,
        instructions: baseExercise.instructions,
        tips: baseExercise.tips,
        modification: modifiedExercise
          ? {
              name: modifiedExercise.name,
              videoId: modifiedExercise.videoId,
              instructions: modifiedExercise.instructions,
              tips: modifiedExercise.tips,
              description: modifiedExercise.description,
            }
          : null,
      },
      duration: currentWorkoutExercise.duration,
      rest: currentWorkoutExercise.rest,
      instructions:
        (showModified[currentExerciseIndex] && modifiedExercise
          ? modifiedExercise.instructions
          : baseExercise.instructions) ||
        currentWorkoutExercise.instructions ||
        "",
      tips:
        (showModified[currentExerciseIndex] && modifiedExercise
          ? modifiedExercise.tips
          : baseExercise.tips) ||
        currentWorkoutExercise.tips ||
        "",
      modification: modifiedExercise,
      isStopwatch: currentWorkoutExercise.duration === "Max Time",
    };

    return exerciseData;
  }, [
    workoutData,
    currentBlockIndex,
    currentExerciseIndex,
    isRestPeriod,
    isRoundRest,
    showModified,
  ]);

  const getNextExercise = useCallback(() => {
    if (
      !workoutData ||
      !workoutData.workoutBlocks ||
      workoutData.workoutBlocks.length === 0
    ) {
      return null;
    }
    const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
    const blockRounds = currentBlock.blockRounds || 1;

    if (currentExerciseIndex < currentBlock.exercises.length - 1) {
      return currentBlock.exercises[currentExerciseIndex + 1];
    }

    if (currentRound < blockRounds) {
      return {
        ...currentBlock.exercises[0],
        isNextRound: true,
        nextRoundNumber: currentRound + 1,
      };
    }

    if (currentBlockIndex < workoutData.workoutBlocks.length - 1) {
      const nextBlock = workoutData.workoutBlocks[currentBlockIndex + 1];
      return nextBlock.exercises[0];
    }

    return null;
  }, [workoutData, currentBlockIndex, currentExerciseIndex, currentRound]);

  const handleSpecialWorkoutComplete = useCallback(async () => {
    const workoutSessions = getWorkoutSessions();
    const isMultiSession = workoutSessions.length > 1 || hasMobilityBlock();
    
    if (isMultiSession) {
      const sessionId = currentSessionData
        ? `workout-${currentSessionData.id}`
        : "workout-0";
      const newCompleted = [...completedSessions, sessionId];
      setCompletedSessions(newCompleted);

      const allSessionsComplete = checkAllSessionsComplete(newCompleted);
      
      if (allSessionsComplete) {
        await completeEntireWorkout();
      } else {
        showToast("success", "Workout session completed! Great job!");
        handleOptionalWorkoutComplete();
      }
    } else {
      await completeEntireWorkout();
    }
  }, [
    getWorkoutSessions,
    hasMobilityBlock,
    currentSessionData,
    completedSessions,
    checkAllSessionsComplete,
    handleOptionalWorkoutComplete,
    showToast,
  ]);

  const completeEntireWorkout = useCallback(async () => {
    localStorage.removeItem("workoutProgress");

    // Track workout completion
    const workoutType = workoutData?.workoutBlocks?.[0]?.blockType || 'General';
    const workoutStartTime = localStorage.getItem('workoutStartTime');
    const duration = workoutStartTime ? Math.round((Date.now() - parseInt(workoutStartTime)) / 60000) : 0; // Duration in minutes
    trackWorkoutComplete(workoutType, programName, duration);
    localStorage.removeItem('workoutStartTime');

    showToast("success", "Workout completed! Great job!");

    try {
      const authToken = localStorage.getItem("jwtToken");
      const response = await fetch(`${BACKEND_URL}/api/workouts/complete-day`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ programName, dayNumber: dayNum }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.error || "Unknown error"
          }`
        );
      }

      try {
        await updateUser();
      } catch (userUpdateError) {
        console.error(
          "Failed to update user data after workout completion:",
          userUpdateError
        );
      }
    } catch (error) {
      console.error("Failed to update user completion status:", error);
    }

    navigate(`/workouts/${programName}/list`);
  }, [programName, dayNum, updateUser, navigate, showToast]);

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

        if (!user || (user.role !== "user" && user.role !== "admin")) {
          setError("You are not authorised to view this program.");
          setLoadingWorkout(false);
          return;
        }
        if (
          user.role === "user" &&
          !user.purchasedPrograms.includes(programName)
        ) {
          // console.log("WorkoutPage: User has an account but does not have the program in purchasedPrograms.");
          setError("You are not authorised to view this program.");
          setLoadingWorkout(false);
          return;
        }
        const authToken = localStorage.getItem("jwtToken");
        if (!authToken) {
          // console.log("WorkoutPage: Authentication token not found.");
          throw new Error("Authentication token not found.");
        }

        const savedProgress = localStorage.getItem("workoutProgress");
        const response = await fetch(
          `${BACKEND_URL}/api/workouts/${programName}/day/${dayNum}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("WorkoutPage: Backend response error:", errorData);
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorData.error}`
          );
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
              setCurrentRound(progress.currentRound || 1);
              setIsRestPeriod(progress.isRestPeriod);
              setIsRoundRest(progress.isRoundRest || false);
              setHasStartedWorkout(progress.hasStartedWorkout || false);
              setShowPreview(false);
            } else {
              localStorage.removeItem("workoutProgress");
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
        <p className="text-xl font-titillium text-limeGreen">
          Loading workout details...
        </p>
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

  if (
    !workoutData ||
    !workoutData.workoutBlocks ||
    workoutData.workoutBlocks.length === 0
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-logoGray">
          No workout data available.
        </p>
      </div>
    );
  }

  // Show exercise preview
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
        <div className="bg-customGray p-4 rounded-lg text-center max-w-3xl lg:max-w-5xl w-full h-full lg:max-h-[90vh] flex flex-col border-brightYellow border-2">
          <div className="text-6xl mb-6">🎉</div>
          <DynamicHeading
            text="Workout Complete"
            className="font-higherJump text-2xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
          />
          <p className="text-md md-text-xl text-logoGray m-6">
            Great job completing today&apos;s workout! <br /> You are another
            step closer to your fitness goals.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleGoBackToProgram}
              className="btn-full-colour sm:mr-4"
            >
              Back to Program
            </button>
            <button
              onClick={() => {
                setShowPreview(true);
                setWorkoutComplete(false);
                setHasStartedWorkout(false);
                setCurrentBlockIndex(0);
                setCurrentExerciseIndex(0);
                setCurrentRound(1);
                setIsRestPeriod(false);
                setIsRoundRest(false);
              }}
              className="btn-cancel mt-2 md:mt-6"
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
  const isFirstExercise =
    currentBlockIndex === 0 &&
    currentExerciseIndex === 0 &&
    currentRound === 1 &&
    !isRestPeriod &&
    !isRoundRest;

  const totalExercisesInWorkout = workoutData.workoutBlocks.reduce(
    (total, block) => {
      if (
        block.blockType === "AMRAP" ||
        block.blockType === "EMOM" ||
        block.blockType === "Tabata" ||
        block.blockType === "For Time"
      ) {
        return total + block.exercises.length;
      }
      return total + block.exercises.length * (block.blockRounds || 1);
    },
    0
  );

  let exercisesCompleted = 0;
  for (let i = 0; i < currentBlockIndex; i++) {
    const block = workoutData.workoutBlocks[i];
    if (
      block.blockType === "AMRAP" ||
      block.blockType === "EMOM" ||
      block.blockType === "Tabata" ||
      block.blockType === "For Time"
    ) {
      exercisesCompleted += block.exercises.length;
    } else {
      exercisesCompleted += block.exercises.length * (block.blockRounds || 1);
    }
  }

  const currentBlock = workoutData.workoutBlocks[currentBlockIndex];
  if (
    currentBlock.blockType === "AMRAP" ||
    currentBlock.blockType === "EMOM" ||
    currentBlock.blockType === "Tabata" ||
    currentBlock.blockType === "For Time"
  ) {
    exercisesCompleted += currentExerciseIndex;
  } else {
    exercisesCompleted += (currentRound - 1) * currentBlock.exercises.length;
    exercisesCompleted += currentExerciseIndex;
  }

  const progressPercentage =
    (exercisesCompleted / totalExercisesInWorkout) * 100;
  const workoutSessions = getWorkoutSessions();
  const isMultiSession = workoutSessions.length > 1 || hasMobilityBlock();
  const isFromChoiceScreen = workoutChoice === "workout" && isMultiSession;
  const shouldAutoStart =
    (hasStartedWorkout || !isFirstExercise) && !isFromChoiceScreen;
  const needsChoice =
    (hasMobilityBlock() && hasRegularWorkout() && !workoutChoice) ||
    (workoutSessions.length > 1 && !workoutChoice);

  if (needsChoice) {
    return (
      <>
        <WorkoutChoice
          workoutData={workoutData}
          onChoiceMade={handleWorkoutChoice}
          onGoBack={handleGoBackToProgram}
          completedSessions={completedSessions}
        />
      </>
    );
  }

  if (currentSession === "mobility") {
    const mobilityBlock = getMobilityBlock();
    return (
      <MobilityWorkout
        workoutBlock={mobilityBlock}
        onComplete={handleMobilityComplete}
        onGoBack={handleGoBackToChoice}
        canGoBack={true}
        shouldAutoStart={true}
        hasOptionalWorkout={hasRegularWorkout()}
        onFinishDay={handleMobilityFinishDay}
      />
    );
  }

  // Debug workout session
  // if (currentSession === 'workout') {
  //   console.log("Workout session debug:", {
  //     currentSession,
  //     currentBlockIndex,
  //     currentBlock: currentBlock?.blockType,
  //     currentExerciseIndex,
  //     currentRound,
  //     isRestPeriod,
  //     isRoundRest,
  //     totalBlocks: workoutData.workoutBlocks.length,
  //     blockTypes: workoutData.workoutBlocks.map(b => b.blockType),
  //     currentExerciseData,
  //     hasStartedWorkout,
  //     shouldAutoStart
  //   });
  // }

  if (currentSession === "workout" && currentBlock.blockType === "Mobility") {
    const firstRegularBlockIndex = workoutData.workoutBlocks.findIndex(
      (block) => block.blockType !== "Mobility"
    );
    // console.log(
    //   "Correcting block index from",
    //   currentBlockIndex,
    //   "to",
    //   firstRegularBlockIndex
    // );
    if (
      firstRegularBlockIndex !== -1 &&
      firstRegularBlockIndex !== currentBlockIndex
    ) {
      setCurrentBlockIndex(firstRegularBlockIndex);
      return null;
    }
  }

  const isAMRAPBlock = currentBlock.blockType === "AMRAP";
  const isEMOMBlock = currentBlock.blockType === "EMOM";
  const isTabataBlock = currentBlock.blockType === "Tabata";
  const isForTimeBlock = currentBlock.blockType === "For Time";

  if (isAMRAPBlock) {
    return (
      <AMRAPWorkout
        workoutBlock={currentBlock}
        title={workoutData.title}
        description={workoutData.description}
        onComplete={handleSpecialWorkoutComplete}
        onGoBack={getBackHandler()}
        canGoBack={true}
        shouldAutoStart={shouldAutoStart}
        isAdmin={user?.role === "admin"}
      />
    );
  }

  if (isEMOMBlock) {
    return (
      <EMOMWorkout
        workoutBlock={currentBlock}
        title={workoutData.title}
        description={workoutData.description}
        onComplete={handleSpecialWorkoutComplete}
        onGoBack={getBackHandler()}
        canGoBack={true}
        shouldAutoStart={shouldAutoStart}
        isAdmin={user?.role === "admin"}
      />
    );
  }

  if (isTabataBlock) {
    const allTabataBlocks = [];
    let blockIndex = currentBlockIndex;

    while (
      blockIndex < workoutData.workoutBlocks.length &&
      workoutData.workoutBlocks[blockIndex].blockType === "Tabata"
    ) {
      allTabataBlocks.push(workoutData.workoutBlocks[blockIndex]);
      blockIndex++;
    }

    return (
      <TabataWorkout
        workoutBlock={currentBlock}
        allTabataBlocks={allTabataBlocks}
        title={workoutData.title}
        description={workoutData.description}
        onComplete={handleSpecialWorkoutComplete}
        onGoBack={getBackHandler()}
        canGoBack={true}
        shouldAutoStart={shouldAutoStart}
        isAdmin={user?.role === "admin"}
      />
    );
  }

  if (isForTimeBlock) {
    return (
      <ForTimeWorkout
        workoutBlock={currentBlock}
        title={workoutData.title}
        description={workoutData.description}
        onComplete={handleSpecialWorkoutComplete}
        onGoBack={getBackHandler()}
        canGoBack={true}
        shouldAutoStart={shouldAutoStart}
        isAdmin={user?.role === "admin"}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
      <div className="bg-customGray p-4 rounded-lg text-center max-w-6xl w-full h-full lg:max-h-[110vh] flex flex-col border-brightYellow border-2 mt-20 md:mt-26">
        {/* Audio Control and Back Button */}
        <div className="flex justify-between items-center">
          <AudioControl
            audioEnabled={audioEnabled}
            volume={volume}
            startSound={startSound}
            onToggle={toggleAudio}
            onVolumeChange={setVolumeLevel}
            onStartSoundChange={setStartSoundType}
            className="mt-0"
          />
          <button onClick={handleGoBackToProgram} className="btn-cancel mt-0">
            Back to Overview
          </button>
        </div>
        {/* Workout Title and Buttons at the top */}
        <div className="flex flex-col mt-4 mb-4 items-center">
          <DynamicHeading
            text={workoutData.title}
            className="font-higherJump m-4 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
          />
          <div className="flex flex-col md:flex-row gap-0 md:gap-4 w-full items-center md:items-stretch">
            {workoutData.description && (
              <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center flex-1 min-h-[80px]">
                <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                  <span className="text-limeGreen font-bold">Description:</span>{" "}
                  {workoutData.description}
                </p>
              </div>
            )}

            {workoutData.workoutBlocks[currentBlockIndex]?.blockNotes && (
              <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center flex-1 min-h-[80px]">
                <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                  <span className="text-limeGreen font-bold">Notes:</span>{" "}
                  {workoutData.workoutBlocks[currentBlockIndex].blockNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main content grid for video and timer */}
        <div className="flex-grow flex flex-col lg:flex-row-reverse items-start md:gap-6 overflow-hidden m-2">
          {/* Right Column: Timer, Instructions, and Progress */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <WorkoutTimer
              key={`${currentBlockIndex}-${currentExerciseIndex}-${currentRound}-${hasStartedWorkout}`}
              currentBlockType={
                workoutData.workoutBlocks[currentBlockIndex].blockType
              }
              currentExerciseNumber={currentExerciseIndex + 1}
              totalExercisesInBlock={
                workoutData.workoutBlocks[currentBlockIndex].exercises.length
              }
              currentRound={currentRound}
              totalRounds={
                workoutData.workoutBlocks[currentBlockIndex].blockRounds || 1
              }
              currentExercise={currentExerciseData}
              nextExercise={getNextExercise()}
              onExerciseComplete={handleExerciseComplete}
              onGoBack={handleCircuitGoBack}
              canGoBack={!isFirstExercise}
              isRest={isRestPeriod}
              isRoundRest={isRoundRest}
              isStopwatch={isStopwatchMode}
              progressPercentage={progressPercentage}
              onShowModificationModal={handleShowModificationModal}
              currentModification={currentModification}
              setShowModificationModal={setShowModificationModal}
              shouldAutoStart={shouldAutoStart}
              isAdmin={user?.role === "admin"}
              playBeep={playBeep}
              playStartSound={playStartSound}
            />

            {/* Instructions and Tips - Desktop Only (in timer section) */}
            <div className="hidden lg:flex lg:flex-col mt-4 space-y-3">
              {currentExerciseData?.instructions && (
                <div className="bg-gray-600 rounded-lg p-3 text-left">
                  <p>
                    <span className="text-limeGreen text-sm font-bold mb-2">
                      Instructions:{" "}
                    </span>
                    <span className="text-logoGray text-sm">
                      {currentExerciseData.instructions}
                    </span>
                  </p>
                </div>
              )}

              {currentExerciseData?.tips && (
                <div className="bg-gray-600 rounded-lg p-3 text-left">
                  <p>
                    <span className="text-limeGreen font-bold text-sm mb-2">
                      Form Tips:{" "}
                    </span>
                    <span className="text-logoGray text-sm">
                      {currentExerciseData.tips}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {showModificationModal && currentModification && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
                <div className="bg-customGray p-6 rounded-lg max-w-xl w-full text-center">
                  <h3 className="text-2xl font-bold text-customWhite mb-4">
                    Modification: {currentModification.name}
                  </h3>
                  <ExerciseVideo
                    exercise={{ exercise: currentModification }}
                    isActive={true}
                  />
                  <p className="text-logoGray my-4">
                    {currentModification.description}
                  </p>
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
            {isRoundRest ? (
              <div className="h-full flex flex-col">
                {/* Header placeholder to match WorkoutTimer header spacing exactly */}
                <div className="md:min-h-[48px] md:mb-4 flex items-center justify-center">
                  <div className="opacity-0 md:text-2xl font-titillium font-semibold">
                    Placeholder
                  </div>
                </div>

                <div className="bg-gray-600 rounded-lg p-6 flex-1 flex flex-col justify-center text-center">
                  {/* Top spacer for better vertical alignment */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-8xl mb-6">⏰</div>
                    <h3 className="text-2xl font-bold text-hotPink mb-4">
                      Round Rest
                    </h3>
                    <div className="space-y-3">
                      <p className="text-logoGray text-lg">
                        Next:{" "}
                        <span className="font-semibold text-white text-xl">
                           Starting Round {currentRound + 1}
                        </span>
                      </p>
                      {getNextExercise() && (
                        <p className="text-logoGray text-lg mb-5">
                          First exercise:{" "}
                          <span className="font-semibold text-white text-xl">
                            {getNextExercise().exercise.name}
                          </span>
                          {getNextExercise().exercise.modification && (
                            <span className="text-logoGray text-xl ml-2">
                              or{" "}
                              <span className="font-semibold text-brightYellow text-xl">
                                {getNextExercise().exercise.modification.name}
                              </span>
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Bottom spacer for balance */}
                  <div className="flex-1"></div>
                </div>
              </div>
            ) : isRestPeriod ? (
              <div className="h-full flex flex-col">
                {/* Header placeholder to match WorkoutTimer header spacing exactly */}
                <div className="md:min-h-[48px] md:mb-4 flex items-center justify-center">
                  <div className="opacity-0 md:text-2xl font-titillium font-semibold">
                    Placeholder
                  </div>
                </div>

                <div className="bg-gray-600 rounded-lg p-6 flex-1 flex flex-col justify-center text-center">
                  {/* Top spacer for better vertical alignment */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-8xl mb-6">🧘</div>
                    <h3 className="text-2xl font-bold text-brightYellow mb-4">
                      Rest Period
                    </h3>
                    <div className="space-y-3">
                      <p className="text-logoGray text-lg">
                        Get ready for the next exercise
                      </p>
                      {getNextExercise() && (
                        <div>
                          {getNextExercise().isNextRound ? (
                            <div className="space-y-2">
                              <p className="text-logoGray text-lg">
                                <span className="font-semibold text-brightYellow text-xl">
                                  Round {getNextExercise().nextRoundNumber}{" "}
                                  starts next
                                </span>
                              </p>
                              <p className="text-logoGray text-lg">
                                First exercise:{" "}
                                <span className="font-semibold text-white text-xl">
                                  {getNextExercise().exercise.name}
                                </span>
                                {getNextExercise().exercise.modification && (
                                  <span className="text-logoGray text-xl ml-2">
                                    or{" "}
                                    <span className="font-semibold text-brightYellow text-xl">
                                      {getNextExercise().exercise.modification.name}
                                    </span>
                                  </span>
                                )}
                              </p>
                            </div>
                          ) : (
                            <p className="text-logoGray text-lg mb-4">
                              Next up:{" "}
                              <span className="font-semibold text-white text-xl">
                                {getNextExercise().exercise.name}
                              </span>
                              {getNextExercise().exercise.modification && (
                                <span className="text-logoGray text-xl ml-2">
                                  or{" "}
                                  <span className="font-semibold text-brightYellow text-xl">
                                    {getNextExercise().exercise.modification.name}
                                  </span>
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Bottom spacer for balance */}
                  <div className="flex-1"></div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Single placeholder area to match WorkoutTimer - either toggle buttons or placeholder */}
                <div className="md:min-h-[48px] md:mb-4 flex items-center justify-center">
                  {currentExerciseData?.modification ? (
                    <div className="flex space-x-2">
                      {(() => {
                        const { standardText, modifiedText } =
                          getToggleButtonText(currentExerciseData);
                        return (
                          <>
                            <button
                              onClick={handleOriginalClick}
                              className={`${
                                !showModified[currentExerciseIndex]
                                  ? "btn-primary px-4 py-2 mt-2 md:mt-0"
                                  : "btn-cancel px-4 py-2 mt-2 md:mt-0"
                              }`}
                            >
                              {standardText}
                            </button>
                            <button
                              onClick={handleModifiedClick}
                              className={`${
                                showModified[currentExerciseIndex]
                                  ? "btn-primary px-4 py-2 mt-2 md:mt-0"
                                  : "btn-cancel px-4 py-2 mt-2 md:mt-0"
                              }`}
                            >
                              {modifiedText}
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    // Invisible placeholder to match timer height exactly
                    <div className="opacity-0 md:text-2xl font-titillium font-semibold">
                      Placeholder
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <ExerciseVideo
                    exercise={currentExerciseData}
                    isActive={!isRestPeriod && !isRoundRest}
                    shouldAutoStart={false}
                    showModified={showModified[currentExerciseIndex] || false}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Instructions and Tips - Mobile Only (below video) */}
          <div className="lg:hidden mt-4 flex flex-col space-y-3">
            {currentExerciseData?.instructions && (
              <div className="bg-gray-600 rounded-lg p-3 text-left">
                <p>
                  <span className="text-limeGreen text-sm font-bold mb-2">
                    Instructions:{" "}
                  </span>
                  <span className="text-logoGray text-sm">
                    {currentExerciseData.instructions}
                  </span>
                </p>
              </div>
            )}

            {currentExerciseData?.tips && (
              <div className="bg-gray-600 rounded-lg p-3 text-left">
                <p>
                  <span className="text-limeGreen font-bold text-sm mb-2">
                    Form Tips:{" "}
                  </span>
                  <span className="text-logoGray text-sm">
                    {currentExerciseData.tips}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;
