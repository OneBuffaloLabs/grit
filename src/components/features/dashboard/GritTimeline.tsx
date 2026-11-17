'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChallengeState } from '@/context/ChallengeContext';
import { calculateCurrentDay } from '@/utils/date';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

interface GritTimelineProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

const GritTimeline = ({ selectedDay, onDaySelect }: GritTimelineProps) => {
  const { challenge } = useChallengeState();
  const timelineRef = useRef<HTMLDivElement>(null);
  const selectedDayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showChevrons, setShowChevrons] = useState(false);

  // Use the challenge's duration, with a fallback to 75
  const challengeDuration = challenge?.duration || 75;

  // Calculate current calendar day
  const currentDay = challenge?.startDate ? calculateCurrentDay(challenge.startDate, challengeDuration) : 1;

  // Find the last logged/active day (highest day number with any task entry or completed status)
  const lastLoggedDay = (() => {
    if (!challenge?.days) return 1;
    for (let d = challengeDuration; d >= 1; d--) {
      const dayData = challenge.days[d];
      if (dayData) {
        const hasCompleted = dayData.completed;
        const tasks = dayData.tasks;
        const hasTaskActivity = tasks && (
          tasks.workout1 ||
          tasks.workout2 ||
          tasks.water ||
          tasks.reading ||
          tasks.diet ||
          dayData.photoAttached ||
          (dayData.journal && dayData.journal.trim().length > 0) ||
          (dayData.waterConsumed && dayData.waterConsumed > 0) ||
          Boolean(dayData.weight)
        );
        if (hasCompleted || hasTaskActivity) {
          return d;
        }
      }
    }
    return 1;
  })();

  // This effect scrolls the selected day into view when it changes
  useEffect(() => {
    if (selectedDayRef.current) {
      selectedDayRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedDay]);

  // This effect checks if the timeline is scrollable to decide whether to show the chevrons
  useEffect(() => {
    const checkScrollable = () => {
      if (timelineRef.current) {
        setShowChevrons(timelineRef.current.scrollWidth > timelineRef.current.clientWidth);
      }
    };

    // Check on mount and on resize
    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    // Re-check after a short delay to account for rendering
    const timeoutId = setTimeout(checkScrollable, 100);

    return () => {
      window.removeEventListener('resize', checkScrollable);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - timelineRef.current.offsetLeft);
    setScrollLeft(timelineRef.current.scrollLeft);
    timelineRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (timelineRef.current) {
      setIsDragging(false);
      timelineRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    if (timelineRef.current) {
      setIsDragging(false);
      timelineRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !timelineRef.current) return;
    e.preventDefault();
    const x = e.pageX - timelineRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for faster scrolling
    timelineRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (timelineRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      timelineRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-lg p-4 mb-8">
      {/* Catch-up / Missing days banner if user is behind */}
      {currentDay > lastLoggedDay + 1 && (
        <div className="mb-4 bg-surface border border-border rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-text-secondary text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>
              You have unlogged days between Day {lastLoggedDay + 1} and Today (Day {currentDay}). Did you fail or miss tasks? You can restart in{' '}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openSettingsModal'))}
                className="text-primary hover:underline font-medium inline cursor-pointer">
                Settings
              </button>.
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onDaySelect(lastLoggedDay + 1)}
              className="text-xs bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer">
              Fill Missing Days
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold font-orbitron text-center sm:text-left">
          Your {challengeDuration} Day Journey
        </h2>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Jump to Current Day */}
          {currentDay <= challengeDuration && currentDay !== selectedDay && (
            <button
              onClick={() => onDaySelect(currentDay)}
              className="text-xs bg-primary/20 hover:bg-primary/30 text-primary px-2.5 py-1.5 rounded-md border border-primary/30 transition-colors flex items-center gap-1.5 font-medium cursor-pointer shadow-sm"
              title={`Jump to today (Day ${currentDay})`}>
              <FontAwesomeIcon icon={faCalendarDay} />
              <span>Today (Day {currentDay})</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative flex items-center">
        {showChevrons && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/50 hover:bg-gray-800/80 rounded-full w-8 h-8 flex items-center justify-center text-white transition-opacity cursor-pointer"
            aria-label="Scroll left">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}

        <div
          ref={timelineRef}
          className="flex overflow-x-auto space-x-2 py-2 scrollbar-hide px-10 cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}>
          {Array.from({ length: challengeDuration }, (_, i) => {
            const dayNumber = i + 1;
            // If challenge is completed, all days are complete. Otherwise, check the day's status.
            const isCompleted =
              challenge?.status === 'completed' || challenge?.days[dayNumber]?.completed || false;
            // A day is selectable if:
            // 1. It's day 1, OR
            // 2. It's already completed, OR
            // 3. The previous day is completed AND the day number is NOT in the future (dayNumber <= currentDay).
            const isPreviousCompleted = dayNumber === 1 || (challenge?.days[dayNumber - 1]?.completed || false);
            const isNotInFuture = dayNumber <= currentDay;
            const isSelectable =
              dayNumber === 1 || isCompleted || (isPreviousCompleted && isNotInFuture);

            const isToday = dayNumber === currentDay;
            const isLastLogged = dayNumber === lastLoggedDay;

            let dayStyles = 'bg-surface';
            if (isCompleted) dayStyles = 'bg-primary';
            if (selectedDay === dayNumber)
              dayStyles += ' ring-2 ring-offset-2 ring-offset-background ring-primary-hover';
            if (!isSelectable) dayStyles += ' opacity-50 !cursor-not-allowed';

            return (
              <div
                key={dayNumber}
                ref={selectedDay === dayNumber ? selectedDayRef : null}
                onClick={() => isSelectable && onDaySelect(dayNumber)}
                className={`relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md font-mono text-sm transition-all duration-200 ${
                  isSelectable ? 'cursor-pointer' : ''
                } ${dayStyles}`}
                title={`Day ${dayNumber}${isToday ? ' (Today)' : ''}${isLastLogged ? ' (Last Logged)' : ''}`}>
                {isCompleted ? (
                  <FontAwesomeIcon icon={faTimes} className="text-white text-lg" />
                ) : (
                  dayNumber
                )}

                {/* Indicator dots for Today / Last Logged */}
                <div className="absolute -top-1 -right-1 flex items-center gap-0.5">
                  {isToday && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-background shadow-sm" title="Today" />
                  )}
                  {isLastLogged && !isToday && (
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-hover border-2 border-background shadow-sm" title="Last Logged" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showChevrons && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/50 hover:bg-gray-800/80 rounded-full w-8 h-8 flex items-center justify-center text-white transition-opacity cursor-pointer"
            aria-label="Scroll right">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
    </div>
  );
};

export default GritTimeline;
