'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import type { ChallengeDoc } from '@/types';
import GritTimeline from '@/components/features/dashboard/GritTimeline';
import PhotoGallery from '@/components/ui/PhotoGallery';
import Journal from '@/components/features/dashboard/Journal';
import ChallengeDetails from '@/components/features/dashboard/ChallengeDetails';
import CompletionAlert from '@/components/ui/CompletionAlert';
import WeightTracker from '@/components/features/dashboard/WeightTracker';

const initialTaskState = {
  diet: false,
  workout1: false,
  workout2: false,
  water: false,
  reading: false,
  progressPhoto: false,
};

const DailyDashboard = () => {
  const { challenge } = useChallengeState();
  const dispatch = useChallengeDispatch();

  const [selectedDay, setSelectedDay] = useState(1);
  const [tasks, setTasks] = useState(initialTaskState);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);

  // --- Logic to determine which day to show ---
  const nextDayToShow = useMemo(() => {
    if (!challenge) return 1;
    const completedDays = Object.keys(challenge.days)
      .map(Number)
      .filter((day) => challenge.days[day]?.completed);
    if (completedDays.length === 0) return 1;
    const highestCompletedDay = Math.max(...completedDays);
    return Math.min(highestCompletedDay + 1, 75);
  }, [challenge]);

  useEffect(() => {
    setSelectedDay(nextDayToShow);
  }, [nextDayToShow]);

  // --- Logic to load tasks for the selected day ---
  useEffect(() => {
    if (challenge && challenge.days[selectedDay]) {
      setTasks(challenge.days[selectedDay].tasks);
    } else {
      setTasks(initialTaskState);
    }
  }, [challenge, selectedDay]);

  // --- State variables for UI logic ---
  const isDayComplete = challenge?.days[selectedDay]?.completed || false;
  const isPreviousDayComplete =
    selectedDay === 1 || challenge?.days[selectedDay - 1]?.completed || false;
  const allTasksCompleted = useMemo(() => Object.values(tasks).every(Boolean), [tasks]);

  // --- Handlers for user actions ---
  const handleTaskChange = async (taskName: keyof typeof tasks) => {
    if (!challenge || isDayComplete) return;
    const newTasks = { ...tasks, [taskName]: !tasks[taskName] };
    setTasks(newTasks);
    const updatedChallenge: ChallengeDoc = JSON.parse(JSON.stringify(challenge));
    if (!updatedChallenge.days[selectedDay]) {
      updatedChallenge.days[selectedDay] = {
        completed: false,
        photoAttached: false,
        tasks: initialTaskState,
      };
    }
    updatedChallenge.days[selectedDay].tasks = newTasks;
    try {
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) dispatch({ type: 'SET_CHALLENGE', payload: newRev });
    } catch (error) {
      console.error('Failed to update task:', error);
      setTasks(tasks); // Revert on error
    }
  };

  const handleCompleteDay = async () => {
    if (!challenge) return;
    const updatedChallenge: ChallengeDoc = JSON.parse(JSON.stringify(challenge));
    if (updatedChallenge.days[selectedDay]) {
      updatedChallenge.days[selectedDay].completed = true;
    } else {
      updatedChallenge.days[selectedDay] = { completed: true, photoAttached: false, tasks };
    }
    try {
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });
        setShowCompletionAlert(true);
      }
    } catch (error) {
      console.error('Failed to complete day:', error);
    }
  };

  const handleGoToNextDay = () => {
    setShowCompletionAlert(false);
    if (selectedDay < 75) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const taskItems = [
    { id: 'diet', label: 'Follow a Diet' },
    { id: 'workout1', label: '45-Minute Workout #1' },
    { id: 'workout2', label: '45-Minute Workout #2 (outdoors)' },
    { id: 'water', label: 'Drink 1 Gallon of Water' },
    { id: 'reading', label: 'Read 10 Pages of Non-Fiction' },
    { id: 'progressPhoto', label: 'Take a Progress Picture' },
  ];

  return (
    <section className="bg-[var(--color-surface)] py-12 px-4 sm:px-6 lg:px-8">
      {showCompletionAlert && (
        <CompletionAlert
          day={selectedDay}
          onClose={() => setShowCompletionAlert(false)}
          onGoToNextDay={handleGoToNextDay}
        />
      )}
      {/* Container now uses max-w-7xl on large screens for a wider layout */}
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <div className="flex items-baseline justify-center">
            <h1 className="text-7xl md:text-8xl font-bold font-orbitron text-[var(--color-primary)]">
              Day {selectedDay}
            </h1>
            <p className="text-3xl md:text-4xl text-[var(--color-text-muted)] font-orbitron ml-2">
              / 75
            </p>
          </div>
          <ChallengeDetails />
        </header>

        {/* Universal Timeline */}
        <GritTimeline selectedDay={selectedDay} onDaySelect={setSelectedDay} />

        {/* Responsive Grid Layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* --- Left Column: Primary Actions --- */}
          <div className="flex flex-col gap-8">
            <div className="bg-[var(--color-background)] rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
              {taskItems.map((task) => (
                <label
                  key={task.id}
                  className={`flex items-center text-lg p-4 bg-[var(--color-surface)] rounded-lg transition-all duration-300 ${
                    isDayComplete || !isPreviousDayComplete
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer hover:bg-gray-700'
                  }`}>
                  <input
                    type="checkbox"
                    checked={tasks[task.id as keyof typeof tasks]}
                    onChange={() => handleTaskChange(task.id as keyof typeof tasks)}
                    disabled={isDayComplete || !isPreviousDayComplete}
                    className="h-6 w-6 rounded-md border-gray-500 text-[var(--color-primary)] bg-gray-700 focus:ring-[var(--color-primary)] focus:ring-offset-gray-800 disabled:cursor-not-allowed"
                  />
                  <span
                    className={`ml-4 ${
                      tasks[task.id as keyof typeof tasks]
                        ? 'text-gray-500 line-through'
                        : 'text-[var(--color-foreground)]'
                    }`}>
                    {task.label}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleCompleteDay}
              disabled={!allTasksCompleted || isDayComplete || !isPreviousDayComplete}
              className="w-full bg-[var(--color-primary)] text-white font-bold py-4 px-6 rounded-lg text-xl hover:bg-[var(--color-primary-hover)] transition-colors duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer">
              {isDayComplete ? 'Day Complete' : 'Complete Day'}
            </button>
          </div>

          {/* --- Right Column: Secondary Modules --- */}
          <div className="space-y-8 mt-8 lg:mt-0">
            <WeightTracker currentDay={selectedDay} />
            <Journal currentDay={selectedDay} />
            <PhotoGallery currentDay={selectedDay} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyDashboard;
