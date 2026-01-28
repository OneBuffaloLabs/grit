'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import type { ChallengeDoc, ChallengeRules } from '@/types';
import GritTimeline from '@/components/features/dashboard/GritTimeline';
import PhotoGallery from '@/components/ui/PhotoGallery';
import Journal from '@/components/features/dashboard/Journal';
import ChallengeDetails from '@/components/features/dashboard/ChallengeDetails';
import Notification from '@/components/ui/Notification';
import WeightTracker from '@/components/features/dashboard/WeightTracker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const initialTaskState = {
  diet: false,
  workout1: false,
  workout2: false,
  water: false,
  reading: false,
  progressPhoto: false,
};

interface DailyDashboardProps {
  onFinishChallenge: () => void;
}

const DailyDashboard = ({ onFinishChallenge }: DailyDashboardProps) => {
  const { challenge } = useChallengeState();
  const dispatch = useChallengeDispatch();
  const isReadOnly = challenge?.status !== 'active';
  const [selectedDay, setSelectedDay] = useState(1);
  const [tasks, setTasks] = useState(initialTaskState);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const [dayCompletedToShowInAlert, setDayCompletedToShowInAlert] = useState<number | null>(null);

  const nextDayToShow = useMemo(() => {
    if (!challenge) return 1;
    const completedDays = Object.keys(challenge.days)
      .map(Number)
      .filter((day) => challenge.days[day]?.completed);
    if (completedDays.length === 0) return 1;
    const highestCompletedDay = Math.max(...completedDays);
    return Math.min(highestCompletedDay + 1, challenge.duration);
  }, [challenge]);

  useEffect(() => {
    setSelectedDay(nextDayToShow);
  }, [nextDayToShow]);

  useEffect(() => {
    if (challenge && challenge.days[selectedDay]) {
      setTasks(challenge.days[selectedDay].tasks || initialTaskState);
    } else {
      setTasks(initialTaskState);
    }
  }, [challenge, selectedDay]);

  const isDayComplete = challenge?.days[selectedDay]?.completed || false;
  const isPreviousDayComplete =
    selectedDay === 1 || challenge?.days[selectedDay - 1]?.completed || false;
  const allTasksCompleted = useMemo(() => Object.values(tasks).every(Boolean), [tasks]);
  const isLastDay = selectedDay === challenge?.duration;

  const handleTaskChange = async (taskName: keyof typeof tasks) => {
    if (!challenge || isDayComplete || isReadOnly) return;
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
      setTasks(tasks);
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
      setDayCompletedToShowInAlert(selectedDay);
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });
        setShowCompletionAlert(true);
      }
    } catch (error) {
      console.error('Failed to complete day:', error);
      setDayCompletedToShowInAlert(null);
    }
  };

  const handleFinishChallenge = async () => {
    if (!challenge) return;

    const updatedChallenge = {
      ...challenge,
      status: 'completed' as const,
      completionDate: new Date().toISOString(),
    };

    try {
      const savedChallenge = await updateChallenge(updatedChallenge);
      if (savedChallenge) {
        dispatch({ type: 'SET_CHALLENGE', payload: savedChallenge });
        onFinishChallenge();
      }
    } catch (error) {
      console.error('Failed to finish challenge:', error);
    }
  };

  // Helper to generate dynamic task labels
  const getTaskLabel = (id: string, rules?: ChallengeRules) => {
    if (!rules) return '';
    switch (id) {
      case 'diet':
        if (rules.dietRule === 'strict') return 'Diet: Strict (No Cheats)';
        if (rules.dietRule === 'one_cheat_week') return 'Diet: Stick to plan';
        if (rules.dietRule === 'cut_vice') return 'Diet: Avoid your Vice';
        return 'Follow Diet';
      case 'workout1':
        return `${rules.workoutDurations[0] || 45}-Minute Workout`;
      case 'workout2':
        return rules.workouts > 1
          ? `${rules.workoutDurations[1] || 45}-Minute Workout ${rules.outdoorWorkout ? '(Outdoors)' : ''}`
          : 'Secondary Workout';
      case 'water':
        return `Drink ${rules.water}oz of Water`;
      case 'reading': {
        if (rules.readingType === 'book_or_audio') {
          return `Read ${rules.reading} pages or Listen ${rules.reading * 2} mins`;
        }
        const typeLabel = rules.readingType === 'any_book' ? 'Any Book' : 'Non-Fiction';
        return `Read ${rules.reading} Pages (${typeLabel})`;
      }
      case 'progressPhoto': {
        if (rules.photoRule === 'first_last') {
          return 'Photo (Only if Day 1 or Last Day)';
        }
        return rules.photoRule === 'daily'
          ? 'Take Daily Progress Photo'
          : rules.photoRule === 'weekly'
            ? 'Weekly Photo (If due today)'
            : 'Progress Photo';
      }
      default:
        return '';
    }
  };

  // Filter tasks based on rules (e.g., if workouts < 2, don't show workout2)
  const taskItems = useMemo(() => {
    if (!challenge) return [];
    const items = [
      { id: 'diet', label: getTaskLabel('diet', challenge.rules) },
      { id: 'workout1', label: getTaskLabel('workout1', challenge.rules) },
      { id: 'water', label: getTaskLabel('water', challenge.rules) },
      { id: 'reading', label: getTaskLabel('reading', challenge.rules) },
    ];

    if (challenge.rules.workouts >= 2) {
      items.splice(2, 0, {
        id: 'workout2',
        label: getTaskLabel('workout2', challenge.rules),
      });
    }

    if (challenge.rules.photoRule !== 'none') {
      // Logic for first/last day photo visibility
      const isFirstDay = selectedDay === 1;
      const isLastDay = selectedDay === challenge.duration;
      const showPhotoTask =
        challenge.rules.photoRule === 'daily' ||
        challenge.rules.photoRule === 'weekly' || // We show it, user decides if it's "due" (simplification)
        (challenge.rules.photoRule === 'first_last' && (isFirstDay || isLastDay));

      if (showPhotoTask) {
        items.push({
          id: 'progressPhoto',
          label: getTaskLabel('progressPhoto', challenge.rules),
        });
      }
    }

    return items;
  }, [challenge, selectedDay]);

  return (
    <section className="bg-surface py-12 px-4 sm:px-6 lg:px-8">
      {showCompletionAlert && dayCompletedToShowInAlert !== null && (
        <Notification
          type="success"
          title={`Day ${dayCompletedToShowInAlert} Complete!`}
          message="Great job, keep up the momentum."
          onClose={() => {
            setShowCompletionAlert(false);
            setDayCompletedToShowInAlert(null);
          }}
        />
      )}
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <div className="flex items-baseline justify-center">
            <h1 className="text-5xl font-bold font-orbitron text-primary">Day {selectedDay}</h1>
            <p className="text-3xl text-text-muted font-orbitron ml-2">/ {challenge?.duration}</p>
          </div>
          <p className="text-xl text-primary mt-2 font-bold">{challenge?.name}</p>
          <ChallengeDetails />
        </header>

        <div className="mb-8">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 text-text-muted hover:text-foreground transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to All Challenges</span>
          </Link>
        </div>

        <GritTimeline selectedDay={selectedDay} onDaySelect={setSelectedDay} />

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          <div className="flex flex-col gap-8">
            <div className="bg-background rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
              {taskItems.map((task) => (
                <label
                  key={task.id}
                  className={`flex items-center text-lg p-4 bg-surface rounded-lg transition-all duration-300 ${
                    isDayComplete || !isPreviousDayComplete || isReadOnly
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer hover:bg-gray-700'
                  }`}>
                  <input
                    type="checkbox"
                    checked={tasks[task.id as keyof typeof tasks]}
                    onChange={() => handleTaskChange(task.id as keyof typeof tasks)}
                    disabled={isDayComplete || !isPreviousDayComplete || isReadOnly}
                    className="h-6 w-6 rounded-md border-gray-500 text-primary bg-gray-700 focus:ring-primary focus:ring-offset-gray-800 disabled:cursor-not-allowed"
                  />
                  <span
                    className={`ml-4 ${
                      tasks[task.id as keyof typeof tasks]
                        ? 'text-gray-500 line-through'
                        : 'text-foreground'
                    }`}>
                    {task.label}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={isLastDay ? handleFinishChallenge : handleCompleteDay}
              disabled={!allTasksCompleted || isDayComplete || !isPreviousDayComplete || isReadOnly}
              className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg text-xl hover:bg-primary-hover transition-colors duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer">
              {isDayComplete ? 'Day Complete' : isLastDay ? 'Finish Challenge' : 'Complete Day'}
            </button>
            <p className="text-center text-md text-text-muted">
              Missed a task? You must start over. The &apos;Start Over&apos; button is in the
              <FontAwesomeIcon icon={faCog} className="mx-1" />
              settings.
            </p>
          </div>

          <div className="space-y-8 mt-8 lg:mt-0">
            <WeightTracker currentDay={selectedDay} isReadOnly={isReadOnly} />
            <Journal currentDay={selectedDay} isReadOnly={isReadOnly} />
            <PhotoGallery currentDay={selectedDay} isReadOnly={isReadOnly} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyDashboard;
