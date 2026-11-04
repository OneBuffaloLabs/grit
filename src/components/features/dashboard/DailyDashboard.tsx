'use client';

import React, { useState, useMemo } from 'react';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import type { ChallengeDoc, ChallengeRules } from '@/types';
import Notification from '@/components/ui/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import {
  calculateCurrentDay,
  getChallengeDayDate,
  formatFriendlyDate,
} from '@/utils/date';

const initialTaskState = {
  diet: false,
  workout1: false,
  workout2: false,
  workout3: false,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      return { ...initialTaskState, ...challenge.days[selectedDay].tasks };
    }
    return initialTaskState;
  }, [challenge, selectedDay]);

  const isDayComplete = challenge?.days[selectedDay]?.completed || false;
  const isPreviousDayComplete =
    selectedDay === 1 || challenge?.days[selectedDay - 1]?.completed || false;
  const isLastDay = selectedDay === challenge?.duration;

  // --- Dynamic Dates & Countdown ---
  const currentCalendarDay = useMemo(() => {
    if (!challenge) return 1;
    return calculateCurrentDay(challenge.startDate, challenge.duration);
  }, [challenge]);

  const selectedDayRemaining = useMemo(() => {
    if (!challenge) return 0;
    return Math.max(0, challenge.duration - selectedDay);
  }, [challenge, selectedDay]);

  const selectedDayFriendlyDate = useMemo(() => {
    if (!challenge) return '';
    const dateStr = getChallengeDayDate(challenge.startDate, selectedDay);
    return formatFriendlyDate(dateStr);
  }, [challenge, selectedDay]);

  const isSelectedDayToday = selectedDay === currentCalendarDay;

  // --- Helpers ---

  const getTaskLabel = (id: string, rules?: ChallengeRules) => {
    if (!rules) return '';
    switch (id) {
      case 'diet':
        if (rules.dietRule === 'strict') return 'Diet: Strict (No Cheats)';
        if (rules.dietRule === 'one_cheat_week') return 'Diet: Stick to plan';
        if (rules.dietRule === 'cut_vice') {
          return rules.vice ? `No ${rules.vice}` : 'Diet: Avoid your Vice';
        }
        return 'Follow Diet';
      case 'workout1':
        return `${rules.workoutDurations[0] || 45}-Minute Workout${
          rules.workouts === 1 && rules.outdoorWorkout ? ' (Outdoors)' : ''
        }`;
      case 'workout2':
        return rules.workouts >= 2
          ? `${rules.workoutDurations[1] || 45}-Minute Workout ${rules.outdoorWorkout ? '(Outdoors)' : ''}`
          : 'Secondary Workout';
      case 'workout3':
        return `${rules.workoutDurations[2] || 30}-Minute Workout`;
      case 'water':
        return `Drink ${rules.water}oz of Water`;
      case 'reading': {
        if (rules.readingType === 'book_or_audio') {
          return `Read ${rules.reading} pages or Listen ${rules.reading * 2} mins`;
        }
        const typeLabel = rules.readingType === 'any_book' ? 'Any Book' : 'Non-Fiction';
        return `Read ${rules.reading} Pages (${typeLabel})`;
      }
      case 'progressPhoto':
        return 'Take Progress Photo';
      default:
        return '';
    }
  };

  // --- Visible Tasks Calculation ---
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

    if (challenge.rules.workouts >= 3) {
      items.splice(3, 0, {
        id: 'workout3',
        label: getTaskLabel('workout3', challenge.rules),
      });
    }

    if (challenge.rules.photoRule !== 'none') {
      let showPhotoTask: boolean;
      const isFirstDay = selectedDay === 1;
      const isLastDay = selectedDay === challenge.duration;

      switch (challenge.rules.photoRule) {
        case 'daily':
          showPhotoTask = true;
          break;
        case 'first_last':
          showPhotoTask = isFirstDay || isLastDay;
          break;
        case 'weekly':
          showPhotoTask = (selectedDay - 1) % 7 === 0;
          break;
        default:
          showPhotoTask = false;
      }

      if (showPhotoTask) {
        items.push({
          id: 'progressPhoto',
          label: getTaskLabel('progressPhoto', challenge.rules),
        });
      }
    }

    return items;
  }, [challenge, selectedDay]);

  // --- Validation Logic ---
  const allTasksCompleted = useMemo(() => {
    if (!taskItems || taskItems.length === 0) return false;
    return taskItems.every((item) => tasks[item.id as keyof typeof tasks]);
  }, [tasks, taskItems]);

  // --- Handlers ---

  const handleTaskChange = async (taskName: keyof typeof tasks) => {
    if (!challenge || isDayComplete || isReadOnly) return;

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
      if (newRev) dispatch({ type: 'SET_CHALLENGE', payload: newRev });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCompleteDay = async () => {
    if (!challenge) return;
    const updatedChallenge: ChallengeDoc = JSON.parse(JSON.stringify(challenge));

    // 1. Mark current day complete
    if (updatedChallenge.days[selectedDay]) {
      updatedChallenge.days[selectedDay].completed = true;
    } else {
      updatedChallenge.days[selectedDay] = { completed: true, photoAttached: false, tasks };
    }

    // 2. Data Carry Over Logic (Metrics)
    // Check if next day exists within duration
    const nextDay = selectedDay + 1;
    if (nextDay <= updatedChallenge.duration) {
      // Ensure next day object exists
      if (!updatedChallenge.days[nextDay]) {
        updatedChallenge.days[nextDay] = {
          completed: false,
          photoAttached: false,
          tasks: initialTaskState,
        };
      }

      const currentData = updatedChallenge.days[selectedDay];
      const nextDayData = updatedChallenge.days[nextDay];

      // Carry Weight (if next day is empty)
      if (currentData.weight !== undefined && nextDayData.weight === undefined) {
        nextDayData.weight = currentData.weight;
      }

      // Carry Measurements (if next day is empty)
      if (currentData.measurements && Object.keys(currentData.measurements).length > 0) {
        if (!nextDayData.measurements || Object.keys(nextDayData.measurements).length === 0) {
          nextDayData.measurements = { ...currentData.measurements };
        }
      }
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

    // Deep copy
    const updatedChallenge: ChallengeDoc = JSON.parse(JSON.stringify(challenge));

    // 1. Mark the FINAL day as completed in the data structure
    if (updatedChallenge.days[selectedDay]) {
      updatedChallenge.days[selectedDay].completed = true;
    } else {
      updatedChallenge.days[selectedDay] = { completed: true, photoAttached: false, tasks };
    }

    // 2. Mark the Challenge itself as completed
    updatedChallenge.status = 'completed';
    updatedChallenge.completionDate = new Date().toISOString();

    try {
      const savedChallenge = await updateChallenge(updatedChallenge);
      if (savedChallenge) {
        dispatch({ type: 'SET_CHALLENGE', payload: savedChallenge });
        // 3. Trigger the modal
        onFinishChallenge();
      }
    } catch (error) {
      console.error('Failed to finish challenge:', error);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-lg border border-[var(--color-surface-border)] overflow-hidden">
      {showCompletionAlert && dayCompletedToShowInAlert !== null && (
        <Notification
          type="success"
          title={`Day ${dayCompletedToShowInAlert} Complete!`}
          message="Great job. Metrics copied to tomorrow."
          onClose={() => {
            setShowCompletionAlert(false);
            setDayCompletedToShowInAlert(null);
          }}
        />
      )}

      <div className="p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--color-background)] pb-4">
          <div>
            <h2 className="text-2xl font-bold font-orbitron flex items-center gap-3">
              Tasks for Day {selectedDay}
              {isDayComplete && (
                <span className="text-sm font-sans font-bold bg-green-500/20 text-green-500 px-2.5 py-0.5 rounded">
                  Complete
                </span>
              )}
            </h2>
            {selectedDayFriendlyDate && (
              <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">
                {selectedDayFriendlyDate}
                {isSelectedDayToday && (
                  <span className="text-[var(--color-primary)] font-semibold ml-1.5">(Today)</span>
                )}
              </p>
            )}
          </div>
          {challenge && challenge.status === 'active' && (
            <div className="text-xs font-orbitron uppercase tracking-wider text-[var(--color-text-muted)] bg-[var(--color-background)] px-3 py-1.5 rounded-lg border border-[var(--color-surface-border)]">
              {selectedDay === challenge.duration ? (
                <span className="text-[var(--color-primary)] font-bold">Final day</span>
              ) : (
                <>
                  <span className="text-[var(--color-primary)] font-bold">
                    {selectedDayRemaining}
                  </span>{' '}
                  {selectedDayRemaining === 1 ? 'day' : 'days'} left
                </>
              )}
            </div>
          )}
        </div>

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
