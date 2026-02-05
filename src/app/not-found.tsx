import Link from 'next/link';
import type { Metadata } from 'next';
import { generateMetadata } from '@/utils/metadata';

// Generate metadata for the 404 page
export const metadata: Metadata = generateMetadata({
  title: '404 - Protocol Missing',
  description:
    "Oops! The page you're looking for doesn't exist. Return to the dashboard to get back on track.",
  // Good practice to prevent search engines from indexing the 404 page
  robots: {
    index: false,
    follow: true,
  },
});

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-gray-100 px-6 text-center relative overflow-hidden font-orbitron">
      {/* Background Decor - Subtle Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(44,44,44,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(44,44,44,0.2)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />

      {/* Radial Gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#1a1a1a_80%)] z-0 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center animate-fade-in-up">
        {/* The 404 "Scoreboard" */}
        <div className="relative">
          <h1
            className="text-[8rem] sm:text-[12rem] md:text-[14rem] font-bold text-[#e53e3e] leading-none tracking-tighter drop-shadow-[0_0_25px_rgba(229,62,62,0.4)] select-none"
            aria-label="Error 404">
            404
          </h1>
          <div
            className="absolute top-1/2 left-0 w-full h-1 bg-[#1a1a1a]/50 backdrop-blur-sm -rotate-6 transform scale-110"
            aria-hidden="true"
          />
        </div>

        {/* The "Coach" Talk */}
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-wide uppercase">
          Rep Failed
        </h2>

        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto mb-10 font-sans">
          You went too heavy on the URL bar. This page isn&apos;t part of the protocol. Take a
          breath, reset your form, and get back to work.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Primary Action - Back to App */}
          <Link
            href="/app/"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#e53e3e] text-white font-bold uppercase tracking-wider rounded border border-[#e53e3e] overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(229,62,62,0.6)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#f56565] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]">
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Go to Dashboard
            </span>
            {/* Hover slide effect */}
            <div className="absolute inset-0 bg-[#c53030] transform skew-x-12 -translate-x-full transition-transform group-hover:translate-x-0" />
          </Link>

          {/* Secondary Action - Home */}
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-gray-300 font-bold uppercase tracking-wider rounded border border-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]">
            Return Home
          </Link>
        </div>

        {/* Footer Tech Stat */}
        <div className="mt-16 pt-8 border-t border-[#2c2c2c] w-full max-w-xs flex justify-between text-xs text-[#888888] font-mono">
          <span>STATUS: MISSING</span>
          <span>ERR_CODE: OUT_OF_BOUNDS</span>
        </div>
      </div>
    </main>
  );
}
