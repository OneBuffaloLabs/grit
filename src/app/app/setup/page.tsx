'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCogs,
  faArrowRight,
  faLock,
  faUnlock,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChallengeTypeGrid from '@/components/features/setup/ChallengeTypeGrid';
import GeneralSection from '@/components/features/setup/sections/GeneralSection';
import PhysicalSection from '@/components/features/setup/sections/PhysicalSection';
import HabitsSection from '@/components/features/setup/sections/HabitsSection';

import { useChallengeController } from '@/context/ChallengeContext';
import { ChallengeType, ChallengeRules } from '@/types';
import { CHALLENGE_PRESETS } from '@/data/presets';
import { THEME } from '@/data/theme';

const SetupPage = () => {
  const router = useRouter();
  const { startChallenge } = useChallengeController();

  const getDateSuffix = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' });
  };

  const [selectedType, setSelectedType] = useState<ChallengeType>('hard');
  const [rules, setRules] = useState<ChallengeRules>(CHALLENGE_PRESETS.hard);
  const [isCustom, setIsCustom] = useState(false);
  const [challengeName, setChallengeName] = useState(`75 Hard - ${getDateSuffix()}`);
  const [duration, setDuration] = useState(75);

  const currentTheme = THEME[selectedType];

  const handleSelectType = (type: ChallengeType) => {
    setSelectedType(type);
    setRules(JSON.parse(JSON.stringify(CHALLENGE_PRESETS[type])));
    setIsCustom(type === 'custom');

    const suffix = getDateSuffix();

    if (type === 'hard') setChallengeName(`75 Hard - ${suffix}`);
    if (type === 'soft') setChallengeName(`75 Soft - ${suffix}`);
    if (type === 'balanced') setChallengeName(`75 Balanced - ${suffix}`);
    if (type === 'custom') setChallengeName(`My Custom Challenge - ${suffix}`);
  };

  const preventNonNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRuleChange = (field: keyof ChallengeRules, value: any) => {
    const alwaysEditableFields: (keyof ChallengeRules)[] = [
      'trackWeight',
      'trackMeasurements',
      'useDailyJournal',
      'outdoorWorkout',
    ];

    if (!isCustom && !alwaysEditableFields.includes(field)) return;

    if (['water', 'reading'].includes(field)) {
      const intValue = parseInt(value);
      setRules((prev) => ({ ...prev, [field]: isNaN(intValue) ? 0 : Math.abs(intValue) }));
    } else {
      setRules((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleWorkoutCountChange = (count: number) => {
    if (!isCustom) return;
    setRules((prev) => {
      const newDurations = [...prev.workoutDurations];
      while (newDurations.length < count) newDurations.push(30);
      while (newDurations.length > count) newDurations.pop();
      return { ...prev, workouts: count, workoutDurations: newDurations };
    });
  };

  const handleDurationChange = (index: number, value: number) => {
    if (!isCustom) return;
    const intValue = parseInt(value.toString());
    const finalValue = isNaN(intValue) ? 0 : Math.abs(intValue);

    setRules((prev) => {
      const newDurations = [...prev.workoutDurations];
      newDurations[index] = finalValue;
      return { ...prev, workoutDurations: newDurations };
    });
  };

  const handleStart = async () => {
    if (rules.water <= 0 || rules.reading <= 0 || rules.workoutDurations.some((d) => d <= 0)) {
      alert('Please ensure Water, Reading, and Workout Durations are greater than 0.');
      return;
    }
    await startChallenge(challengeName, selectedType, rules, duration);
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

        <ChallengeTypeGrid selectedType={selectedType} onSelect={handleSelectType} />

        <div
          className={`bg-[var(--color-surface)] rounded-2xl border transition-colors duration-300 ${isCustom ? currentTheme.border : 'border-[var(--color-background)]'} overflow-hidden`}>
          <div className="bg-[var(--color-background)]/50 p-4 px-8 border-b border-[var(--color-background)] flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCogs} className={`text-xl ${currentTheme.color}`} />
                <h2 className="text-xl font-bold font-orbitron">
                  {selectedType === 'custom' ? 'Configure Rules' : 'Challenge Rules'}
                </h2>
              </div>
              {!isCustom && (
                <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5 mt-1">
                  <FontAwesomeIcon icon={faInfoCircle} className="w-3 h-3" />
                  <span>Tracking, metrics, and name can be customized for any challenge type.</span>
                </p>
              )}
            </div>

            <div
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 self-start md:self-auto ${isCustom ? currentTheme.badge : 'bg-[var(--color-background)] text-[var(--color-text-muted)]'}`}>
              <FontAwesomeIcon icon={isCustom ? faUnlock : faLock} />
              <span>{isCustom ? 'EDITABLE' : 'LOCKED PRESET'}</span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <GeneralSection
              name={challengeName}
              setName={setChallengeName}
              duration={duration}
              setDuration={setDuration}
              isCustom={isCustom}
              themeAccent={currentTheme.accent}
            />

            <PhysicalSection
              rules={rules}
              isCustom={isCustom}
              theme={currentTheme}
              onWorkoutCountChange={handleWorkoutCountChange}
              onDurationChange={handleDurationChange}
              onRuleChange={handleRuleChange}
              preventNonNumericInput={preventNonNumericInput}
            />

            <HabitsSection
              rules={rules}
              isCustom={isCustom}
              theme={currentTheme}
              onRuleChange={handleRuleChange}
              preventNonNumericInput={preventNonNumericInput}
            />
          </div>
        </div>

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
            By starting, you commit to {challengeName} for {duration} days.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SetupPage;
