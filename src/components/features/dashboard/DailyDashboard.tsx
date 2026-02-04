'use client';

import React, { useState, useMemo } from 'react';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import type { ChallengeDoc, ChallengeRules } from '@/types';
import GritTimeline from '@/components/features/dashboard/GritTimeline';
import Notification from '@/components/ui/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

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
  selectedDay: number;
  onDaySelect: (day: number) => void;
  isReadOnly?: boolean;
}

const DailyDashboard = ({
  onFinishChallenge,
  selectedDay,
  onDaySelect,
  isReadOnly = false,
}: DailyDashboardProps) => {
  const { challenge } = useChallengeState();
  const dispatch = useChallengeDispatch();

  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const [dayCompletedToShowInAlert, setDayCompletedToShowInAlert] = useState<number | null>(null);

  // Derive tasks directly from props/context
  const tasks = useMemo(() => {
    if (challenge && challenge.days[selectedDay]) {
      return challenge.days[selectedDay].tasks || initialTaskState;
    }
    return initialTaskState;
  }, [challenge, selectedDay]);

  const isDayComplete = challenge?.days[selectedDay]?.completed || false;
  // Day 1 is always unlocked. Otherwise check if prev day is complete.
  const isPreviousDayComplete =
    selectedDay === 1 || challenge?.days[selectedDay - 1]?.completed || false;

  const allTasksCompleted = useMemo(() => Object.values(tasks).every(Boolean), [tasks]);
  const isLastDay = selectedDay === challenge?.duration;

  const handleTaskChange = async (taskName: keyof typeof tasks) => {
    if (!challenge || isDayComplete || isReadOnly) return;

    // Calculate new state based on derived values
    const newTasks = { ...tasks, [taskName]: !tasks[taskName] };

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
      // Dispatching here updates the context, which triggers a re-render with new derived tasks
      if (newRev) dispatch({ type: 'SET_CHALLENGE', payload: newRev });
    } catch (error) {
      console.error('Failed to update task:', error);
      // No local state to rollback, source of truth remains unchanged on error
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
      const isFirstDay = selectedDay === 1;
      const isLastDay = selectedDay === challenge.duration;
      const showPhotoTask =
        challenge.rules.photoRule === 'daily' ||
        challenge.rules.photoRule === 'weekly' ||
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
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-lg border border-[var(--color-surface-border)] overflow-hidden">
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

      {/* Timeline Section */}
      <div className="p-4 border-b border-[var(--color-background)] bg-[var(--color-background)]/30">
        <GritTimeline selectedDay={selectedDay} onDaySelect={onDaySelect} />
      </div>

      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold font-orbitron mb-6 flex items-center gap-2">
          Tasks for Day {selectedDay}
          {isDayComplete && (
            <span className="text-sm bg-green-500/20 text-green-500 px-2 py-1 rounded">
              Complete
            </span>
          )}
        </h2>

        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            {taskItems.map((task) => (
              <label
                key={task.id}
                className={`flex items-center text-lg p-4 rounded-xl border transition-all duration-300 ${
                  isDayComplete || !isPreviousDayComplete || isReadOnly
                    ? 'border-transparent bg-[var(--color-background)] opacity-60 cursor-not-allowed'
                    : 'border-[var(--color-background)] bg-[var(--color-background)] hover:border-[var(--color-primary)] cursor-pointer'
                }`}>
                <input
                  type="checkbox"
                  checked={tasks[task.id as keyof typeof tasks]}
                  onChange={() => handleTaskChange(task.id as keyof typeof tasks)}
                  disabled={isDayComplete || !isPreviousDayComplete || isReadOnly}
                  className="h-6 w-6 rounded-md border-gray-500 text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-gray-700 disabled:cursor-not-allowed"
                />
                <span
                  className={`ml-4 font-medium ${
                    tasks[task.id as keyof typeof tasks]
                      ? 'text-[var(--color-text-muted)] line-through'
                      : 'text-[var(--color-text)]'
                  }`}>
                  {task.label}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={isLastDay ? handleFinishChallenge : handleCompleteDay}
            disabled={!allTasksCompleted || isDayComplete || !isPreviousDayComplete || isReadOnly}
            className="w-full bg-[var(--color-primary)] text-white font-bold py-4 px-6 rounded-xl text-xl hover:bg-[var(--color-primary-hover)] transition-colors duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-[var(--color-primary)]/20">
            {isDayComplete ? 'Day Complete' : isLastDay ? 'Finish Challenge' : 'Complete Day'}
          </button>

          <p className="text-center text-sm text-[var(--color-text-muted)] flex items-center justify-center gap-1">
            <FontAwesomeIcon icon={faCog} className="text-xs" />
            <span>Settings allows you to restart if you miss a task.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyDashboard;
