import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faPaintRoller,
  faTrophy,
  faCodeBranch,
  faBug,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CHANGELOG_DATA, ChangeType } from '@/data/changelog';

// Helper to map string types to Icons
const getIconForType = (type: ChangeType) => {
  switch (type) {
    case 'launch':
      return faRocket;
    case 'feature':
      return faTrophy;
    case 'update':
      return faPaintRoller;
    case 'fix':
      return faBug;
    default:
      return faCodeBranch;
  }
};

const ChangelogPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-[var(--color-background)] text-[var(--color-foreground)]">
        {/* Header Block */}
        <div className="py-16 px-4 text-center bg-[var(--color-surface)]">
          <h1 className="text-4xl md:text-5xl font-bold font-orbitron mb-4">Product Timeline</h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Grit is constantly evolving. Here is a look at our journey, from day one to today.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="relative">
            {/* The Solid Timeline Line (Background) */}
            <div className="absolute left-8 md:left-1/2 top-10 bottom-10 w-0.5 bg-[var(--color-surface)] -translate-x-1/2" />

            {/* FUTURE PATH: Dashed line extending upwards */}
            <div className="relative flex flex-col items-center justify-center mb-16 z-10">
              <div className="bg-[var(--color-surface)] text-[var(--color-text-muted)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2">
                Coming Soon
              </div>
              <div className="h-12 w-0.5 border-l-2 border-dashed border-[var(--color-primary)]/50"></div>
              <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] mt-[-2px]" />
            </div>

            {/* LOOP THROUGH YEARS */}
            {CHANGELOG_DATA.map((yearGroup, yearIdx) => (
              <div key={yearGroup.year}>
                {/* YEAR MARKER (Sticky Header effect purely visual) */}
                <div className="relative flex items-center justify-center mb-12 z-10">
                  <div className="bg-[var(--color-surface)] border border-[var(--color-surface)] text-[var(--color-foreground)] font-orbitron font-bold text-xl px-6 py-2 rounded-full shadow-lg">
                    {yearGroup.year}
                  </div>
                </div>

                {/* LOOP THROUGH EVENTS IN THAT YEAR */}
                {yearGroup.entries.map((event, index) => (
                  <div
                    key={`${yearGroup.year}-${index}`}
                    className="relative flex flex-col md:flex-row gap-8 mb-16 last:mb-16 group">
                    {/* Mobile Date */}
                    <div className="md:hidden pl-16 text-sm text-[var(--color-primary)] font-bold mb-[-20px]">
                      {event.date}
                    </div>

                    {/* Left Side (Date/Version) */}
                    <div className="md:w-1/2 md:text-right flex flex-col md:items-end justify-center">
                      <div className="hidden md:block">
                        <span className="text-[var(--color-primary)] font-bold text-lg">
                          {event.date}
                        </span>
                        {event.version && (
                          <span className="block text-xs text-[var(--color-text-muted)] font-mono mt-1">
                            {event.version}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Center Icon */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-surface)] border-4 border-[var(--color-background)] z-10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={getIconForType(event.type)}
                        className="text-[var(--color-primary)] text-lg"
                      />
                    </div>

                    {/* Right Side (Content) */}
                    <div className="pl-16 md:pl-0 md:w-1/2 text-left">
                      <div className="bg-[var(--color-surface)]/30 p-6 rounded-xl border border-[var(--color-surface)] hover:border-[var(--color-primary)]/50 transition-colors duration-300">
                        <h3 className="text-xl font-bold font-orbitron mb-2 flex items-center gap-2">
                          {event.title}
                        </h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* START POINT: Origin Marker */}
            <div className="relative flex flex-col items-center justify-center mt-12">
              <div className="w-4 h-4 rounded-full bg-[var(--color-primary)] z-10 shadow-[0_0_15px_var(--color-primary)]" />
              <p className="mt-4 text-xs text-[var(--color-text-muted)] uppercase tracking-widest opacity-60">
                The Journey Began Here
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChangelogPage;
