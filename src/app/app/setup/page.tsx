'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faArrowRight, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { useChallengeController } from '@/context/ChallengeContext';
import { ChallengeType, ChallengeRules } from '@/types';
import { CHALLENGE_PRESETS } from '@/data/presets';
import { THEME } from '@/data/theme';

const SetupPage = () => {
  const router = useRouter();
  const { startChallenge } = useChallengeController();

  // Default selection
  const [selectedType, setSelectedType] = useState<ChallengeType>('hard');
  const [rules, setRules] = useState<ChallengeRules>(CHALLENGE_PRESETS.hard);
  const [isCustom, setIsCustom] = useState(false);

  // Get current theme based on selection
  const currentTheme = THEME[selectedType];

  // Handle Card Selection
  const handleSelectType = (type: ChallengeType) => {
    setSelectedType(type);
    setRules(JSON.parse(JSON.stringify(CHALLENGE_PRESETS[type]))); // Deep copy
    setIsCustom(type === 'custom');
  };

  // Handle Basic Rule Changes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRuleChange = (field: keyof ChallengeRules, value: any) => {
    if (!isCustom) return;
    setRules((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Workout Count Change (Resize Array)
  const handleWorkoutCountChange = (count: number) => {
    if (!isCustom) return;

    setRules((prev) => {
      const newDurations = [...prev.workoutDurations];
      while (newDurations.length < count) newDurations.push(30);
      while (newDurations.length > count) newDurations.pop();
      return { ...prev, workouts: count, workoutDurations: newDurations };
    });
  };

  // Handle Individual Workout Duration Change
  const handleDurationChange = (index: number, minutes: number) => {
    if (!isCustom) return;
    setRules((prev) => {
      const newDurations = [...prev.workoutDurations];
      newDurations[index] = minutes;
      return { ...prev, workoutDurations: newDurations };
    });
  };

  const handleStart = async () => {
    await startChallenge(selectedType, rules);
    router.push('/app/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold font-orbitron mb-4">Choose Your Path</h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Select a standard challenge to lock in the official rules, or choose
            <span className="text-blue-500 font-bold"> Custom</span> to build your own discipline
            protocol.
          </p>
        </header>

        {/* 1. SELECTION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* SOFT */}
          <div
            onClick={() => handleSelectType('soft')}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 relative ${
              selectedType === 'soft'
                ? `${THEME.soft.border} ${THEME.soft.bgLight} ${THEME.soft.shadow}`
                : 'border-[var(--color-surface)] bg-[var(--color-surface)] hover:border-green-500/50'
            }`}>
            <FontAwesomeIcon
              icon={THEME.soft.icon}
              className={`text-3xl ${selectedType === 'soft' ? THEME.soft.color : 'text-green-500'}`}
            />
            <h3 className="font-bold text-lg font-orbitron">75 Soft</h3>
            <div className="text-xs text-[var(--color-text-muted)] text-center space-y-1">
              <p>64oz Water • 1 Workout</p>
              <p>No restart penalty</p>
            </div>
          </div>

          {/* BALANCED */}
          <div
            onClick={() => handleSelectType('balanced')}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 relative ${
              selectedType === 'balanced'
                ? `${THEME.balanced.border} ${THEME.balanced.bgLight} ${THEME.balanced.shadow}`
                : 'border-[var(--color-surface)] bg-[var(--color-surface)] hover:border-orange-400/50'
            }`}>
            <FontAwesomeIcon
              icon={THEME.balanced.icon}
              className={`text-3xl ${selectedType === 'balanced' ? THEME.balanced.color : 'text-orange-400'}`}
            />
            <h3 className="font-bold text-lg font-orbitron">75 Balanced</h3>
            <div className="text-xs text-[var(--color-text-muted)] text-center space-y-1">
              <p>100oz Water • 1 Workout + Recovery</p>
              <p>Weekly cheats allowed</p>
            </div>
          </div>

          {/* HARD */}
          <div
            onClick={() => handleSelectType('hard')}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 relative ${
              selectedType === 'hard'
                ? `${THEME.hard.border} ${THEME.hard.bgLight} ${THEME.hard.shadow}`
                : 'border-[var(--color-surface)] bg-[var(--color-surface)] hover:border-red-500/50'
            }`}>
            <FontAwesomeIcon
              icon={THEME.hard.icon}
              className={`text-3xl ${selectedType === 'hard' ? THEME.hard.color : 'text-red-500'}`}
            />
            <h3 className="font-bold text-lg font-orbitron">75 Hard</h3>
            <div className="text-xs text-[var(--color-text-muted)] text-center space-y-1">
              <p>1 Gal Water • 2 Workouts</p>
              <p>Zero compromises</p>
            </div>
          </div>

          {/* CUSTOM */}
          <div
            onClick={() => handleSelectType('custom')}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 relative ${
              selectedType === 'custom'
                ? `${THEME.custom.border} ${THEME.custom.bgLight} ${THEME.custom.shadow}`
                : 'border-[var(--color-surface)] bg-[var(--color-surface)] hover:border-blue-500/50'
            }`}>
            <FontAwesomeIcon
              icon={THEME.custom.icon}
              className={`text-3xl ${selectedType === 'custom' ? THEME.custom.color : 'text-blue-500'}`}
            />
            <h3 className="font-bold text-lg font-orbitron">Custom</h3>
            <div className="text-xs text-[var(--color-text-muted)] text-center space-y-1">
              <p>Your Rules.</p>
              <p>Your Pace.</p>
            </div>
          </div>
        </div>

        {/* 2. RULES CONFIGURATION */}
        <div
          className={`bg-[var(--color-surface)] rounded-2xl border transition-colors duration-300 ${isCustom ? currentTheme.border : 'border-[var(--color-background)]'} overflow-hidden`}>
          {/* Header Bar */}
          <div className="bg-[var(--color-background)]/50 p-4 px-8 border-b border-[var(--color-background)] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCogs} className={`text-xl ${currentTheme.color}`} />
              <h2 className="text-xl font-bold font-orbitron">
                {selectedType === 'custom' ? 'Configure Rules' : 'Challenge Rules'}
              </h2>
            </div>

            {/* Lock Indicator */}
            <div
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 ${
                isCustom
                  ? currentTheme.badge
                  : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'
              }`}>
              <FontAwesomeIcon icon={isCustom ? faUnlock : faLock} />
              <span>{isCustom ? 'EDITABLE' : 'LOCKED PRESET'}</span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* --- LEFT COLUMN: WORKOUTS --- */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--color-background)] pb-2">
                Physical Training
              </h3>

              {/* Number of Workouts Slider */}
              <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
                <label className="block text-sm font-bold mb-1">Workouts per Day</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={rules.workouts}
                    onChange={(e) => handleWorkoutCountChange(parseInt(e.target.value))}
                    className={`flex-grow h-2 bg-[var(--color-background)] rounded-lg appearance-none cursor-pointer ${currentTheme.accent}`}
                  />
                  <span
                    className={`text-2xl font-bold font-orbitron w-8 text-center ${currentTheme.color}`}>
                    {rules.workouts}
                  </span>
                </div>
              </div>

              {/* Workout Duration Details Loop */}
              <div className="space-y-3">
                <label className={`block text-sm font-bold ${!isCustom ? 'opacity-70' : ''}`}>
                  Target Duration
                </label>

                {Array.from({ length: rules.workouts }).map((_, index) => (
                  <div
                    key={index}
                    className={`bg-[var(--color-background)] p-3 rounded-lg border border-[var(--color-surface)] text-sm flex justify-between items-center ${!isCustom ? 'opacity-70 pointer-events-none' : ''}`}>
                    <span>
                      Workout {index + 1}
                      {selectedType === 'balanced' && index === 1 && ' (Active Recovery)'}
                    </span>
                    <div className="flex items-center gap-2">
                      {isCustom ? (
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={rules.workoutDurations[index]}
                          onChange={(e) => handleDurationChange(index, parseInt(e.target.value))}
                          className={`w-16 text-center rounded py-1 font-bold bg-[var(--color-surface)] border ${currentTheme.border.replace('border-', 'focus:border-')} outline-none ${currentTheme.color}`}
                        />
                      ) : (
                        <div className={`w-16 text-center py-1 font-bold ${currentTheme.color}`}>
                          {rules.workoutDurations[index]}
                        </div>
                      )}
                      <span className="text-[var(--color-text-muted)]">min</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Outdoor Toggle */}
              <label
                className={`flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-[var(--color-background)] transition-colors ${!isCustom ? 'opacity-70 pointer-events-none' : ''}`}>
                <span className="text-sm font-bold">Outdoor Requirement</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rules.outdoorWorkout}
                    onChange={(e) => handleRuleChange('outdoorWorkout', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${currentTheme.toggle}`}></div>
                </div>
              </label>
            </div>

            {/* --- RIGHT COLUMN: NUTRITION & HABITS --- */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--color-background)] pb-2">
                Nutrition & Habits
              </h3>

              {/* Water */}
              <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
                <label className="block text-sm font-bold mb-1">Water Intake</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={rules.water}
                    onChange={(e) => handleRuleChange('water', parseInt(e.target.value))}
                    className={`w-24 bg-[var(--color-background)] border border-[var(--color-surface)] rounded p-2 focus:border-current outline-none font-bold ${currentTheme.color} ${currentTheme.border.replace('border-', 'focus:border-')}`}
                  />
                  <span className="text-sm text-[var(--color-text-muted)]">oz / day</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  64oz = 2L • 100oz = 3L • 128oz = 1 Gallon
                </p>
              </div>

              {/* Reading */}
              <div className={!isCustom ? 'opacity-70 pointer-events-none' : ''}>
                <label className="block text-sm font-bold mb-1">Reading</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={rules.reading}
                    onChange={(e) => handleRuleChange('reading', parseInt(e.target.value))}
                    className={`w-24 bg-[var(--color-background)] border border-[var(--color-surface)] rounded p-2 focus:border-current outline-none font-bold ${currentTheme.color} ${currentTheme.border.replace('border-', 'focus:border-')}`}
                  />
                  <span className="text-sm text-[var(--color-text-muted)]">pages / day</span>
                </div>
              </div>

              {/* Toggles */}
              <div className={`space-y-2 pt-2 ${!isCustom ? 'pointer-events-none' : ''}`}>
                {[
                  { id: 'noCheatMeals', label: 'No Cheat Meals' },
                  { id: 'noAlcohol', label: 'No Alcohol' },
                  { id: 'progressPhoto', label: 'Daily Progress Photo' },
                ].map((toggle) => (
                  <label
                    key={toggle.id}
                    className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      checked={(rules as any)[toggle.id]}
                      onChange={(e) =>
                        handleRuleChange(toggle.id as keyof ChallengeRules, e.target.checked)
                      }
                      className={`w-5 h-5 rounded cursor-pointer ${currentTheme.accent}`}
                    />
                    <span className="text-sm font-bold">{toggle.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. ACTION BUTTON */}
        <div className="mt-12 text-center pb-12">
          <button
            onClick={handleStart}
            className={`text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto cursor-pointer transform hover:-translate-y-1 ${currentTheme.button}`}>
            <span className="capitalize">
              Start {selectedType === 'custom' ? 'Custom Challenge' : selectedType}
            </span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <p className="text-sm text-[var(--color-text-muted)] mt-4">
            By starting, you commit to these rules for 75 days.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SetupPage;
