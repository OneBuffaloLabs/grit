'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import type { ChallengeDoc } from '@/types';

const DailyDashboard = () => {
  const { challenge } = useChallengeState();
  const dispatch = useChallengeDispatch();

  // Defines the initial state for the tasks.
  const initialTaskState = {
    diet: false,
    workout1: false,
    workout2: false,
    water: false,
    reading: false,
    progressPhoto: false,
  };

  const [tasks, setTasks] = useState(initialTaskState);

  // Calculates the current day of the challenge based on the start date.
  const currentDay = useMemo(() => {
    if (!challenge?.startDate) return 1;
    const startDate = new Date(challenge.startDate);
    const today = new Date();
    // Set time to the beginning of the day for accurate day difference calculation
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }, [challenge]);

  // useEffect hook to load the current day's tasks from the database when the component mounts or the day changes.
  useEffect(() => {
    if (challenge && challenge.days[currentDay]) {
      setTasks(challenge.days[currentDay].tasks);
    } else {
      // Reset tasks for the new day if no data exists
      setTasks(initialTaskState);
    }
  }, [challenge, currentDay]);

  // Handles changes to a task's completion status and updates the database.
  const handleTaskChange = async (taskName: keyof typeof tasks) => {
    if (!challenge) return;

    const newTasks = { ...tasks, [taskName]: !tasks[taskName] };
    setTasks(newTasks);

    // Create a deep copy of the challenge to avoid direct state mutation
    const updatedChallenge: ChallengeDoc = JSON.parse(JSON.stringify(challenge));

    if (!updatedChallenge.days[currentDay]) {
      updatedChallenge.days[currentDay] = { completed: false, tasks: initialTaskState };
    }
    updatedChallenge.days[currentDay].tasks = newTasks;

    try {
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      // Optionally, revert the UI state if the DB update fails
      setTasks(tasks);
    }
  };

  const allTasksCompleted = useMemo(() => {
    return Object.values(tasks).every(Boolean);
  }, [tasks]);

  // Marks the current day as complete and advances the challenge.
  const handleCompleteDay = async () => {
    if (!challenge) return;

    // Create a deep copy for modification
    const updatedChallenge: ChallengeDoc = JSON.parse(JSON.stringify(challenge));

    // Mark the current day as complete
    if (updatedChallenge.days[currentDay]) {
      updatedChallenge.days[currentDay].completed = true;
    } else {
      // This case handles if a user clicks complete without toggling any tasks first
      updatedChallenge.days[currentDay] = { completed: true, tasks };
    }

    try {
      // Save to PouchDB and update context
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });
      }
      alert(`Day ${currentDay} Complete! Great work.`);
    } catch (error) {
      console.error('Failed to complete day:', error);
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
      <div className="container mx-auto max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold font-orbitron text-[var(--color-primary)]">
            Day {currentDay}
          </h1>
          <p className="text-2xl text-[var(--color-text-muted)] font-orbitron">/ 75</p>
        </header>

        <div className="bg-[var(--color-background)] rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
          {taskItems.map((task) => (
            <label
              key={task.id}
              className="flex items-center text-lg p-4 bg-[var(--color-surface)] rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-700">
              <input
                type="checkbox"
                checked={tasks[task.id as keyof typeof tasks]}
                onChange={() => handleTaskChange(task.id as keyof typeof tasks)}
                className="h-6 w-6 rounded-md border-gray-500 text-[var(--color-primary)] bg-gray-700 focus:ring-[var(--color-primary)] focus:ring-offset-gray-800"
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

        <div className="mt-8">
          <button
            onClick={handleCompleteDay}
            disabled={!allTasksCompleted}
            className="w-full bg-[var(--color-primary)] text-white font-bold py-4 px-6 rounded-lg text-xl hover:bg-[var(--color-primary-hover)] transition-colors duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer">
            Complete Day
          </button>
        </div>
      </div>
    </section>
  );
};

export default DailyDashboard;
