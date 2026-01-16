'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faUserTie, faSeedling, faDumbbell } from '@fortawesome/free-solid-svg-icons';

/**
 * Renders the educational and motivational content.
 * 1. "The 75-Day Why": Explains the psychology of habit formation.
 * 2. "Difficulty Guide": Uses distinct personas to help users choose a tier.
 */
const Methodology = () => {
  const personas = [
    {
      title: 'The Restarter',
      icon: faSeedling,
      match: '75 Soft',
      color: 'text-green-500',
      description:
        'You are coming back from a slump, an injury, or burnout. You need to prove to yourself that you can stick to something without the risk of failing.',
    },
    {
      title: 'The Busy Pro',
      icon: faUserTie,
      match: '75 Balanced',
      color: 'text-orange-400',
      description:
        'You have a demanding job or kids. You want physical transformation but need the flexibility to enjoy a wedding toast or a family dinner.',
    },
    {
      title: 'The Iron Mind',
      icon: faDumbbell,
      match: '75 Hard',
      color: 'text-red-500',
      description:
        'You are sick of your own excuses. You want a total mental reset and are willing to sacrifice comfort to build an unbreakable will.',
    },
  ];

  return (
    <section className="bg-[var(--color-surface)] py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        {/* The 75-Day Why */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="flex items-center gap-3 text-[var(--color-primary)] mb-4">
              <FontAwesomeIcon icon={faBrain} className="text-3xl" />
              <h2 className="text-3xl font-bold font-orbitron">The Science of 75</h2>
            </div>
            <p className="text-lg text-[var(--color-foreground)] mb-4 font-semibold">
              Why 75 days? Why not 30?
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
              Research from University College London suggests it takes an average of{' '}
              <strong>66 days</strong> to form a new habit automatically.
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Grit pushes you to <strong>75 days</strong> to take you beyond just "habit formation"
              and into "lifestyle permanence." By the time you finish, these tasks aren't
              chores—they are just who you are.
            </p>
          </div>
          {/* Visual abstract representation of a brain or growth could go here,
              but we'll use a clean typographic quote for now */}
          <div className="bg-[var(--color-background)] p-8 rounded-2xl border-l-4 border-[var(--color-primary)] shadow-lg">
            <blockquote className="text-xl italic text-[var(--color-text-muted)] mb-4">
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            </blockquote>
            <cite className="block text-right font-bold text-[var(--color-foreground)]">
              — Will Durant
            </cite>
          </div>
        </div>

        {/* Difficulty / Persona Guide */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-orbitron mb-4">Find Your Path</h2>
          <p className="text-[var(--color-text-muted)]">
            Not sure which version to choose? Identify your current season of life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((persona, idx) => (
            <div
              key={idx}
              className="bg-[var(--color-background)] p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-[var(--color-surface)]/50 flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-6 ${persona.color}`}>
                <FontAwesomeIcon icon={persona.icon} className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold font-orbitron mb-2">{persona.title}</h3>
              <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${persona.color}`}>
                Best Match: {persona.match}
              </div>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Methodology;
