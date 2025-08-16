'use client';

import React, { useState, useMemo } from 'react';

const DailyDashboard = () => {
  const [tasks, setTasks] = useState({
    diet: false,
    workout1: false,
    workout2: false,
    water: false,
    reading: false,
    progressPhoto: false,
  });

  const handleTaskChange = (taskName: keyof typeof tasks) => {
    const newTasks = { ...tasks, [taskName]: !tasks[taskName] };
    setTasks(newTasks);
    // This is where you would add the PouchDB logic
    // to instantly save the state of the checklist.
    console.log('Saving task state to PouchDB:', newTasks);
  };

  const allTasksCompleted = useMemo(() => {
    return Object.values(tasks).every(Boolean);
  }, [tasks]);

  const handleCompleteDay = () => {
    // This is where you would add the PouchDB logic
    // to finalize the day's document and advance the counter.
    console.log('Completing day and advancing to next day...');
    alert('Day Completed! (PouchDB logic to be implemented)');
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
          <h1 className="text-6xl font-bold font-orbitron text-[var(--color-primary)]">Day 1</h1>
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
