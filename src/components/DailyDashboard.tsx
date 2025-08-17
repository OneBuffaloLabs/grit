'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import type { ChallengeDoc } from '@/types';
import GritGrid from './GritGrid';
import PhotoGallery from './PhotoGallery';
import Journal from './Journal';
import ChallengeDetails from './ChallengeDetails';

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

  // This state now controls which day is being viewed and edited.
  const [selectedDay, setSelectedDay] = useState(1);
  const [tasks, setTasks] = useState(initialTaskState);

  // This calculates the current calendar day. We use it to set the initial selected day.
  const calendarDay = useMemo(() => {
    if (!challenge?.startDate) return 1;
    const startDate = new Date(challenge.startDate);
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }, [challenge]);

  // Set the selected day to the current calendar day on initial load.
  useEffect(() => {
    setSelectedDay(calendarDay);
  }, [calendarDay]);

  // This effect now loads the tasks for the currently *selected* day.
  useEffect(() => {
    if (challenge && challenge.days[selectedDay]) {
      setTasks(challenge.days[selectedDay].tasks);
    } else {
      setTasks(initialTaskState);
    }
  }, [challenge, selectedDay]);

  const handleTaskChange = async (taskName: keyof typeof tasks) => {
    if (!challenge) return;
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
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      setTasks(tasks); // Revert on error
    }
  };

  const allTasksCompleted = useMemo(() => {
    return Object.values(tasks).every(Boolean);
  }, [tasks]);

  const handleCompleteDay = async () => {
    if (!challenge) return;
    const updatedChallenge: ChallengeDoc = JSON.parse(JSON.stringify(challenge));
    if (updatedChallenge.days[selectedDay]) {
      updatedChallenge.days[selectedDay].completed = true;
    } else {
      updatedChallenge.days[selectedDay] = {
        completed: true,
        photoAttached: false,
        tasks,
      };
    }

    try {
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });
      }
      alert(`Day ${selectedDay} marked as complete!`);
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
            Day {selectedDay}
          </h1>
          <p className="text-2xl text-[var(--color-text-muted)] font-orbitron">/ 75</p>
        </header>

        <ChallengeDetails />

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
        <Journal currentDay={selectedDay} />
        <GritGrid selectedDay={selectedDay} onDaySelect={setSelectedDay} />
        <PhotoGallery currentDay={selectedDay} />
      </div>
    </section>
  );
};

export default DailyDashboard;
