'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListCheck,
  faDatabase,
  faUserShield,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Visualizes the "Local-First" architecture to build trust.
 * Explains that data stays on the device and highlights Offline capabilities.
 */
const HowItWorks = () => {
  const steps = [
    {
      icon: faListCheck,
      title: '1. You Log a Task',
      description: 'You mark your daily progress. No login, no account, no signup form.',
    },
    {
      icon: faDatabase,
      title: '2. Instant Local Save',
      description: "Data is written immediately to your browser's internal database (PouchDB).",
    },
    {
      icon: faUserShield,
      title: '3. Zero Data Leaks',
      description: 'Your personal data never touches a server. It stays encrypted on your device.',
    },
  ];

  return (
    <section className="bg-[var(--color-background)] py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--color-surface)]">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-6">
          No Cloud. No Compromise.
        </h2>

        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto mb-16">
          Most apps sell your data. Grit doesn&apos;t even have a server to store it. It loads once
          and works anywhere—perfect for those outdoor workouts in remote areas.
        </p>

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Visual Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-[var(--color-surface)] -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center group">
              {/* Icon Circle */}
              <div className="w-24 h-24 bg-[var(--color-surface)] rounded-full flex items-center justify-center mb-6 border-4 border-[var(--color-background)] shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon
                  icon={step.icon}
                  className="text-3xl text-[var(--color-primary)]"
                />
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold font-orbitron mb-3">{step.title}</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed px-4 text-sm">
                {step.description}
              </p>

              {/* Mobile Arrow (Visual Guide) */}
              {index < steps.length - 1 && (
                <div className="md:hidden mt-8 text-[var(--color-surface)]">
                  <FontAwesomeIcon icon={faArrowRight} className="text-2xl rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
