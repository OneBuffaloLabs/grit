'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Welcome = () => {
  const handleStartChallenge = () => {
    // This is where you would add the PouchDB logic
    // to create the initial challenge document.
    console.log('Starting 75 Hard Challenge...');
    // After creating the document, you would redirect the user.
    // For now, we'll just log to the console.
    alert('Challenge Started! (PouchDB logic to be implemented)');
  };

  const rules = [
    'Follow a diet. No alcohol or cheat meals.',
    'Work out twice a day for at least 45 minutes.',
    'One workout must be outdoors.',
    'Drink 1 gallon of water.',
    'Read 10 pages of a non-fiction book.',
    'Take a progress picture every day.',
  ];

  return (
    <section className="bg-[var(--color-surface)] text-[var(--color-foreground)] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl text-center">
        <h1 className="text-5xl font-bold font-orbitron mb-4">Welcome to Grit</h1>
        <p className="text-lg text-[var(--color-text-muted)] mb-8">
          The privacy-first tracker for the 75 Hard challenge. Your data stays on your device,
          always.
        </p>
        <div className="bg-[var(--color-secondary)] rounded-lg shadow-lg p-8 text-left mb-8">
          <h2 className="text-3xl font-bold font-orbitron text-center mb-6">The 75 Hard Rules</h2>
          <ul className="space-y-4">
            {rules.map((rule, index) => (
              <li key={index} className="flex items-start">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-[var(--color-primary)] mt-1 mr-4 flex-shrink-0"
                />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleStartChallenge}
          className="cursor-pointer w-full max-w-xs mx-auto bg-[var(--color-primary)] text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-[var(--color-primary-hover)] transition-transform duration-300 transform hover:scale-105">
          Start Challenge
        </button>
      </div>
    </section>
  );
};

export default Welcome;
