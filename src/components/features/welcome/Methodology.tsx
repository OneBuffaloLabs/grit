'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { THEME } from '@/data/theme';
import { ChallengeType } from '@/types';

/**
 * Renders the educational and motivational content.
 * 1. "The 75-Day Why": Explains the psychology of habit formation.
 * 2. "Difficulty Guide": Uses distinct personas to help users choose a tier.
 */
const Methodology = () => {
  const personas: {
    key: ChallengeType;
    title: string;
    match: string;
    description: string;
  }[] = [
    {
      key: 'soft',
      title: 'The Restarter',
      match: '75 Soft',
      description:
        "You're dusting off the cobwebs. Maybe it's been a while, or maybe you're recovering from burnout. You need a win, not a beatdown. This is about proving to yourself that you can show up, day after day.",
    },
    {
      key: 'balanced',
      title: 'The Busy Pro',
      match: '75 Balanced',
      description:
        "You're juggling a career, kids, or a chaotic schedule. You want the physical transformation, but you also need to live in the real world. Intensity is good, but sustainability is king.",
    },
    {
      key: 'hard',
      title: 'The Iron Mind',
      match: '75 Hard',
      description:
        "You're done with your own excuses. You want a total system reset and you're willing to embrace the suck to get it. This isn't just a fitness challenge; it's a test of your character.",
    },
    {
      key: 'custom',
      title: 'The Maverick',
      match: 'Custom Rules',
      description:
        "You march to the beat of your own drum. You know exactly what your body needs—whether that's 3 workouts a day or a specific reading goal. You build the protocol. You set the bar. You crush it.",
    },
  ];

  return (
    <section className="bg-[var(--color-surface)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* The 75-Day Why */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <div className="flex items-center gap-3 text-[var(--color-primary)] mb-6">
              <FontAwesomeIcon icon={faBrain} className="text-3xl" />
              <h2 className="text-3xl font-bold font-orbitron">The Science of 75</h2>
            </div>
            <p className="text-lg text-[var(--color-foreground)] mb-4 font-semibold">
              Why 75 days? Why not 30?
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
              Research suggests it takes an average of <strong>66 days</strong> to wire a new habit
              into your brain. Most challenges stop right when things are getting real.
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Grit pushes you to <strong>75 days</strong> to take you beyond the &quot;honeymoon
              phase&quot; and into lifestyle permanence. By the time you cross the finish line,
              these tasks aren&apos;t chores anymore&mdash;they&apos;re just who you are.
            </p>
          </div>

          <div className="bg-[var(--color-background)] p-8 rounded-2xl border-l-4 border-[var(--color-primary)] shadow-lg relative overflow-hidden">
            {/* Subtle texture or accent */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[var(--color-primary)]/10 rounded-full blur-2xl"></div>

            <blockquote className="text-xl italic text-[var(--color-text-muted)] mb-4 relative z-10">
              &quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.
              &quot;
            </blockquote>
            <cite className="block text-right font-bold text-[var(--color-foreground)] relative z-10">
              — Will Durant
            </cite>
          </div>
        </div>

        {/* Difficulty / Persona Guide */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-orbitron mb-4">Find Your Path</h2>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Not sure where to start? Identify your current season of life. There is no shame in
            starting where you are—only in staying there.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona, idx) => {
            const theme = THEME[persona.key];

            return (
              <div
                key={idx}
                className={`group bg-[var(--color-background)] p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-[var(--color-surface)] flex flex-col items-center text-center hover:-translate-y-2`}>
                <div
                  className={`w-16 h-16 rounded-full ${theme.bgLight} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <FontAwesomeIcon icon={theme.icon} className={`text-3xl ${theme.color}`} />
                </div>

                <h3 className="text-xl font-bold font-orbitron mb-2">{persona.title}</h3>

                <div
                  className={`text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full ${theme.badge}`}>
                  {persona.match}
                </div>

                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                  {persona.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
