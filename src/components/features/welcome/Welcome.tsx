'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faRocket,
  faFire,
  faBalanceScale,
  faLeaf,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { CHALLENGE_DATA, CHALLENGE_ORDER } from '@/data/challenges';
import { ChallengeType } from '@/types';

/**
 * Renders the comparison table for a quick "At a Glance" view.
 * Uses a grid layout for responsiveness.
 */
const ComparisonTable = () => {
  const rows = [
    { label: 'Diet', soft: 'Cut 1 Vice', balanced: '1 Cheat/Week', hard: 'Strict. No cheats.' },
    {
      label: 'Workouts',
      soft: '1x 45min movement',
      balanced: '1x 45min + 15min',
      hard: '2x 45min (1 outdoor)',
    },
    { label: 'Water', soft: '2 Liters', balanced: '3 Liters', hard: '1 Gallon' },
    {
      label: 'Reading',
      soft: '10 pages or 20 mins of Audio/Podcast',
      balanced: '10 pages (Any)',
      hard: '10 pages (Non-Fiction)',
    },
    { label: 'Photo', soft: 'Start & End', balanced: 'Weekly', hard: 'Daily' },
    { label: 'Failure', soft: 'Keep Going', balanced: 'Penalty Day', hard: 'Restart at Day 1' },
  ];

  return (
    <div className="overflow-x-auto w-full mb-12">
      {/* table-fixed ensures columns obey the widths we set below */}
      <table className="w-full text-left border-collapse min-w-[600px] table-fixed">
        <thead>
          <tr className="border-b border-[var(--color-surface)]">
            {/* Setting explicit widths to make them uniform */}
            <th className="w-[15%] p-4 bg-[var(--color-background)] text-[var(--color-text-muted)] font-normal text-xs uppercase tracking-wider"></th>
            <th className="w-[28.33%] p-4 bg-[var(--color-background)] text-green-500 font-bold">
              <FontAwesomeIcon icon={faLeaf} className="mr-2" />
              75 Soft
            </th>
            <th className="w-[28.33%] p-4 bg-[var(--color-background)] text-orange-400 font-bold">
              <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />
              75 Balanced
            </th>
            <th className="w-[28.33%] p-4 bg-[var(--color-background)] text-red-500 font-bold">
              <FontAwesomeIcon icon={faFire} className="mr-2" />
              75 Hard
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
              {/* whitespace-normal ensures the text wraps within the fixed-width column */}
              <td className="p-4 text-[var(--color-text-muted)] whitespace-normal break-words text-sm">
                {row.soft}
              </td>
              <td className="p-4 text-[var(--color-text-muted)] whitespace-normal break-words text-sm">
                {row.balanced}
              </td>
              <td className="p-4 text-[var(--color-text-muted)] whitespace-normal break-words text-sm">
                {row.hard}
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
 * Displays the three challenge tiers, a comparison table, and detailed breakdowns.
 */
const Welcome = () => {
  const router = useRouter();
  // Default to 'balanced' as the middle ground, or 'soft' if you prefer lower friction.
  const [activeTab, setActiveTab] = useState<ChallengeType>('soft');

  const handleLaunchApp = () => {
    router.push('/app');
  };

  const activeChallenge = CHALLENGE_DATA[activeTab];

  return (
    <section className="bg-[var(--color-surface)] text-[var(--color-foreground)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold font-orbitron mb-6">Choose Your Hard</h1>
          <p className="text-lg text-[var(--color-text-muted)] mb-8">
            Grit now supports three distinct paths. Whether you are building a foundation or testing
            your limits, there is a challenge for you.
          </p>

          {/* Progression Logic: Soft -> Balanced -> Hard */}
          <div className="grid md:grid-cols-3 gap-4 text-sm text-[var(--color-text-muted)] bg-[var(--color-background)] p-6 rounded-xl border border-[var(--color-surface)]/50">
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faLeaf} className="text-green-500 text-2xl mb-2" />
              <strong className="text-[var(--color-foreground)]">75 Soft</strong>
              <span>Builds the Habit</span>
            </div>
            <div className="flex flex-col items-center border-t md:border-t-0 md:border-l border-[var(--color-surface)] pt-4 md:pt-0">
              <FontAwesomeIcon icon={faBalanceScale} className="text-orange-400 text-2xl mb-2" />
              <strong className="text-[var(--color-foreground)]">75 Balanced</strong>
              <span>Builds Consistency</span>
            </div>
            <div className="flex flex-col items-center border-t md:border-t-0 md:border-l border-[var(--color-surface)] pt-4 md:pt-0">
              <FontAwesomeIcon icon={faFire} className="text-red-500 text-2xl mb-2" />
              <strong className="text-[var(--color-foreground)]">75 Hard</strong>
              <span>Builds Mental Toughness</span>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <h2 className="text-2xl font-bold font-orbitron text-center mb-8">Compare at a Glance</h2>
        <ComparisonTable />

        {/* Detailed Breakdowns (Tabs) */}
        <div className="bg-[var(--color-background)] rounded-2xl shadow-xl overflow-hidden mb-12">
          {/* Tab Navigation */}
          <div className="flex border-b border-[var(--color-surface)]">
            {CHALLENGE_ORDER.map((key) => {
              const variant = CHALLENGE_DATA[key];
              return (
                <button
                  key={variant.id}
                  onClick={() => setActiveTab(variant.id as ChallengeType)}
                  className={`flex-1 py-4 text-center font-bold transition-colors duration-200 flex items-center justify-center gap-2 ${
                    activeTab === variant.id
                      ? `${variant.color} bg-[var(--color-surface)] border-b-2 border-current`
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]/50 cursor-pointer'
                  }`}>
                  <FontAwesomeIcon icon={variant.icon} />
                  <span className="hidden sm:inline">{variant.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className={`text-3xl font-bold font-orbitron mb-2 ${activeChallenge.color}`}>
                  {activeChallenge.title}
                </h3>
                <p className="text-xl font-medium mb-4 text-[var(--color-foreground)]">
                  {activeChallenge.tagline}
                </p>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                  {activeChallenge.description}
                </p>

                <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-surface)]/50">
                  <h4 className="font-bold flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[var(--color-primary)]" />
                    Why this works
                  </h4>
                  <p className="text-sm italic text-[var(--color-text-muted)]">
                    &quot;{activeChallenge.whyItWorks}&quot;
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold font-orbitron mb-6 border-b border-[var(--color-surface)] pb-2">
                  The Rules
                </h4>
                <ul className="space-y-4">
                  {activeChallenge.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={`mt-1 mr-4 flex-shrink-0 ${activeChallenge.color}`}
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
