'use client';

import React, { useState, useEffect } from 'react';
import { useChallengeState, useChallengeDispatch } from '@/context/ChallengeContext';
import { updateChallenge } from '@/lib/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface JournalProps {
  currentDay: number;
}

const Journal = ({ currentDay }: JournalProps) => {
  const { challenge } = useChallengeState();
  const dispatch = useChallengeDispatch();
  const [journalText, setJournalText] = useState('');
  const [originalText, setOriginalText] = useState(''); // State to track original text
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const entry = challenge?.days[currentDay]?.journal || '';
    setJournalText(entry);
    setOriginalText(entry); // Set original text when component loads or day changes
  }, [challenge, currentDay]);

  const handleSaveJournal = async () => {
    if (!challenge) return;

    setIsSaving(true);
    setIsSaved(false);

    const updatedChallenge = JSON.parse(JSON.stringify(challenge));

    if (!updatedChallenge.days[currentDay]) {
      updatedChallenge.days[currentDay] = {
        completed: false,
        photoAttached: false,
        tasks: {
          diet: false,
          workout1: false,
          workout2: false,
          water: false,
          reading: false,
          progressPhoto: false,
        },
      };
    }

    updatedChallenge.days[currentDay].journal = journalText;

    try {
      const newRev = await updateChallenge(updatedChallenge);
      if (newRev) {
        dispatch({ type: 'SET_CHALLENGE', payload: newRev });
        setOriginalText(journalText); // Update original text after a successful save
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save journal:', error);
      alert('Could not save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = journalText !== originalText;

  return (
    <div className="bg-[var(--color-background)] rounded-lg shadow-lg p-6 sm:p-8 mt-8">
      <h2 className="text-3xl font-bold font-orbitron text-center mb-6">Daily Journal</h2>
      <textarea
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        placeholder="How did today go? What were your wins? What were your challenges?"
        className="w-full h-40 p-4 bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-md border border-gray-600 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
      />
      <div className="mt-4 text-right">
        <button
          onClick={handleSaveJournal}
          disabled={isSaving || !hasChanges} // Disable if saving or if there are no changes
          className={`w-full sm:w-auto text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 cursor-pointer ${
            isSaving
              ? 'bg-gray-500'
              : isSaved
              ? 'bg-green-600' // Using a success color for "Saved!"
              : hasChanges
              ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}>
          {isSaving ? (
            <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
          ) : isSaved ? (
            'Saved!'
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save Entry
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Journal;
