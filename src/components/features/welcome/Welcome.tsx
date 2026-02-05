'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faRocket, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { CHALLENGE_DATA } from '@/data/challenges';
import { THEME } from '@/data/theme';
import { ChallengeType } from '@/types';

/**
 * Renders the comparison table for a quick "At a Glance" view.
 */
const ComparisonTable = () => {
  const rows = [
    {
      label: 'Diet',
      soft: 'Cut 1 Vice',
      balanced: '1 Cheat/Week',
      hard: 'Strict. No cheats.',
      custom: 'You Decide',
    },
    {
      label: 'Workouts',
      soft: '1x 45min',
      balanced: '1x 45min + 15min',
      hard: '2x 45min (1 outdoor)',
      custom: '1-3 Daily Sessions',
    },
    {
      label: 'Water',
      soft: '64oz (2L)',
      balanced: '100oz (3L)',
      hard: '128oz (1 Gal)',
      custom: 'Any Amount',
    },
    {
      label: 'Reading',
      soft: '10 pages or Audio',
      balanced: '10 pages (Any)',
      hard: '10 pages (Non-Fiction)',
      custom: 'Page Goal',
    },
    {
      label: 'Photo',
      soft: 'Day 1 & 75',
      balanced: 'Weekly',
      hard: 'Daily',
      custom: 'Toggle On/Off',
    },
    {
      label: 'Failure',
      soft: 'Keep Going',
      balanced: 'Penalty Day',
      hard: 'Restart at Day 1',
      custom: 'Your Rules',
    },
  ];

  return (
    <div className="overflow-x-auto w-full mb-12">
      <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
        <thead>
          <tr className="border-b border-[var(--color-surface)]">
            <th className="w-[12%] p-4 bg-[var(--color-background)] text-[var(--color-text-muted)] font-normal text-xs uppercase tracking-wider"></th>

            <th
              className={`w-[22%] p-4 bg-[var(--color-background)] font-bold ${THEME.soft.color}`}>
              <FontAwesomeIcon icon={THEME.soft.icon} className="mr-2" />
              75 Soft
            </th>
            <th
              className={`w-[22%] p-4 bg-[var(--color-background)] font-bold ${THEME.balanced.color}`}>
              <FontAwesomeIcon icon={THEME.balanced.icon} className="mr-2" />
              75 Balanced
            </th>
            <th
              className={`w-[22%] p-4 bg-[var(--color-background)] font-bold ${THEME.hard.color}`}>
              <FontAwesomeIcon icon={THEME.hard.icon} className="mr-2" />
              75 Hard
            </th>
            <th
              className={`w-[22%] p-4 bg-[var(--color-background)] font-bold ${THEME.custom.color}`}>
              <FontAwesomeIcon icon={THEME.custom.icon} className="mr-2" />
              Custom
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={
                idx % 2 === 0 ? 'bg-[var(--color-surface)]/30' : 'bg-[var(--color-background)]'
              }>
              <td
                className="p-4 font-semibold text-[var(--color-foreground)] truncate"
                title={row.label}>
                {row.label}
              </td>
              <td className="p-4 text-[var(--color-text-muted)] whitespace-normal break-words text-sm">
                {row.soft}
              </td>
              <td className="p-4 text-[var(--color-text-muted)] whitespace-normal break-words text-sm">
                {row.balanced}
              </td>
              <td className="p-4 text-[var(--color-text-muted)] whitespace-normal break-words text-sm">
                {row.hard}
              </td>
              <td className="p-4 text-[var(--color-text-muted)] whitespace-normal break-words text-sm italic">
                {row.custom}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * The enhanced Welcome component.
 */
const Welcome = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ChallengeType>('soft');

  const handleLaunchApp = () => {
    router.push('/app');
  };

  // Helper to get display data
  const getDisplayData = (type: ChallengeType) => {
    // 1. Handle Custom Case
    if (type === 'custom') {
      return {
        id: 'custom',
        title: 'Custom Challenge',
        tagline: 'Your Rules. Your Pace.',
        description:
          'You know exactly what you need. Build a protocol that fits your specific goals, whether that means 3 workouts a day or just drinking more water.',
        whyItWorks:
          'Ownership creates adherence. When you build the plan, you are more likely to stick to it.',
        rules: [
          'Set your own workout frequency (1-3/day)',
          'Define your water intake goal',
          'Toggle reading, photos, and diet rules',
          'Choose your own failure conditions',
        ],
        theme: THEME.custom,
      };
    }

    // 2. Handle Standard Cases
    const data = CHALLENGE_DATA[type];

    // Safety fallback
    if (!data) {
      return {
        id: 'hard',
        title: '75 Hard',
        tagline: 'The Iron Standard',
        description: 'The original mental toughness program.',
        whyItWorks: 'Total elimination of excuses.',
        rules: [],
        theme: THEME.hard,
      };
    }

    return {
      ...data,
      theme: THEME[type],
    };
  };

  const activeData = getDisplayData(activeTab);

  const TABS: ChallengeType[] = ['soft', 'balanced', 'hard', 'custom'];

  return (
    <section className="bg-[var(--color-surface)] text-[var(--color-foreground)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold font-orbitron mb-6">Choose Your Hard</h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-8">
            Grit supports distinct paths. Whether you are building a foundation, testing your
            limits, or forging your own way, there is a challenge for you.
          </p>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[var(--color-text-muted)] bg-[var(--color-background)] p-6 rounded-xl border border-[var(--color-surface)]/50">
            <div className="flex flex-col items-center">
              <FontAwesomeIcon
                icon={THEME.soft.icon}
                className={`${THEME.soft.color} text-2xl mb-2`}
              />
              <strong className="text-[var(--color-foreground)]">Soft</strong>
              <span className="text-xs">Builds Habit</span>
            </div>
            <div className="flex flex-col items-center border-l border-[var(--color-surface)]">
              <FontAwesomeIcon
                icon={THEME.balanced.icon}
                className={`${THEME.balanced.color} text-2xl mb-2`}
              />
              <strong className="text-[var(--color-foreground)]">Balanced</strong>
              <span className="text-xs">Builds Consistency</span>
            </div>
            <div className="flex flex-col items-center border-l border-[var(--color-surface)]">
              <FontAwesomeIcon
                icon={THEME.hard.icon}
                className={`${THEME.hard.color} text-2xl mb-2`}
              />
              <strong className="text-[var(--color-foreground)]">Hard</strong>
              <span className="text-xs">Mental Toughness</span>
            </div>
            <div className="flex flex-col items-center border-l border-[var(--color-surface)]">
              <FontAwesomeIcon
                icon={THEME.custom.icon}
                className={`${THEME.custom.color} text-2xl mb-2`}
              />
              <strong className="text-[var(--color-foreground)]">Custom</strong>
              <span className="text-xs">Total Control</span>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <h2 className="text-2xl font-bold font-orbitron text-center mb-8">Compare at a Glance</h2>
        <ComparisonTable />

        {/* Detailed Breakdowns (Tabs) */}
        <div className="bg-[var(--color-background)] rounded-2xl shadow-xl overflow-hidden mb-12 border border-[var(--color-surface)]">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-[var(--color-surface)]">
            {TABS.map((key) => {
              const theme = THEME[key];
              const isActive = activeTab === key;
              const title =
                key === 'custom' ? 'Custom' : `75 ${key.charAt(0).toUpperCase() + key.slice(1)}`;

              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 py-4 min-w-[100px] text-center font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isActive
                      ? `${theme.color} bg-[var(--color-surface)] border-b-2 border-current shadow-[inset_0_-2px_0_0_currentColor]`
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]/50 cursor-pointer'
                  }`}>
                  <FontAwesomeIcon icon={theme.icon} />
                  <span className="hidden sm:inline">{title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className={`text-3xl font-bold font-orbitron mb-2 ${activeData.theme.color}`}>
                  {activeData.title}
                </h3>
                <p className="text-xl font-medium mb-4 text-[var(--color-foreground)]">
                  {activeData.tagline}
                </p>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                  {activeData.description}
                </p>

                <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-surface)]/50">
                  <h4 className="font-bold flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[var(--color-primary)]" />
                    Why this works
                  </h4>
                  <p className="text-sm italic text-[var(--color-text-muted)]">
                    &quot;{activeData.whyItWorks}&quot;
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold font-orbitron mb-6 border-b border-[var(--color-surface)] pb-2">
                  The Rules
                </h4>
                <ul className="space-y-4">
                  {activeData.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={`mt-1 mr-4 flex-shrink-0 ${activeData.theme.color}`}
                      />
                      <span className="text-[var(--color-text-muted)]">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleLaunchApp}
            className="w-full max-w-md mx-auto bg-[var(--color-primary)] text-white font-bold py-5 px-8 rounded-xl text-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-3">
            <FontAwesomeIcon icon={faRocket} />
            <span>Launch App & Start Tracking</span>
          </button>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            No sign-up required. Data stored locally.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
