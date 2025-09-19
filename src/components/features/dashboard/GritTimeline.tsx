'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChallengeState } from '@/context/ChallengeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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
      <h2 className="text-xl font-bold font-orbitron text-center mb-4">
        Your {challengeDuration} Day Journey
      </h2>
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
            const isSelectable =
              dayNumber === 1 || isCompleted || challenge?.days[dayNumber - 1]?.completed || false;

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
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md font-mono text-sm transition-all duration-200 ${
                  isSelectable ? 'cursor-pointer' : ''
                } ${dayStyles}`}>
                {isCompleted ? (
                  <FontAwesomeIcon icon={faTimes} className="text-white text-lg" />
                ) : (
                  dayNumber
                )}
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
