import { faFire, faBalanceScale, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { ChallengeVariant } from '@/types';

export const CHALLENGE_DATA: Record<string, ChallengeVariant> = {
  soft: {
    id: 'soft',
    title: '75 Soft',
    icon: faLeaf,
    color: 'text-green-500',
    tagline: 'Building the Foundation',
    description:
      'For those starting from zero or recovering from burnout. Focus on adding good habits rather than strictly removing bad ones.',
    rules: [
      'Eat mindfully. Cut out ONE specific vice (e.g., soda, fast food).',
      'One 45-minute session of movement daily (walk, yoga, gardening).',
      'Drink 2 Liters (~64 oz) of water.',
      'Read 10 pages of any book, or listen to 20 minutes of an educational audiobook or podcast.',
      'Take a photo on Day 1 and Day 75 only.',
      'No restart penalty. Just keep going.',
    ],
    whyItWorks:
      'Low barrier to entry. "Movement" is less intimidating than "Workout," helping you build the habit of showing up for yourself without the pressure of perfection.',
  },
  balanced: {
    id: 'balanced',
    title: '75 Balanced',
    icon: faBalanceScale,
    color: 'text-orange-400',
    tagline: 'Sustainable Consistency',
    description:
      'Challenge yourself physically and mentally while maintaining social flexibility. Built for parents and 9-to-5 schedules.',
    rules: [
      'Follow a specific diet. One cheat meal & alcohol allowed once per week.',
      'One 45-min workout + 15-min active recovery (stretch, walk) daily.',
      'Drink 3 Liters (~100 oz) of water.',
      'Read 10 pages of any book (Fiction allowed).',
      'Take a progress picture once a week.',
      'Miss a day? Add a penalty day instead of restarting.',
    ],
    whyItWorks:
      'It keeps the discipline of daily movement but removes the burnout risk of two-a-days. It treats food as fuel, not restriction, preventing post-challenge binging.',
  },
  hard: {
    id: 'hard',
    title: '75 Hard',
    icon: faFire,
    color: 'text-red-500',
    tagline: 'The Iron Standard',
    description:
      'The original mental toughness program. Zero compromise. Designed to break your mental barriers and rebuild your discipline.',
    rules: [
      'Follow a strict diet. No alcohol or cheat meals.',
      'Two 45-minute workouts per day. One MUST be outdoors.',
      'Drink 1 gallon (128 oz) of water.',
      'Read 10 pages of a non-fiction book.',
      'Take a progress picture every day.',
      'If you miss ONE task, you start over at Day 1.',
    ],
    whyItWorks:
      'Total elimination of excuses. It teaches you that you are capable of far more than you think by forcing you to execute regardless of how you feel.',
  },
};

// Helper array to ensure consistent rendering order (Soft -> Balanced -> Hard)
export const CHALLENGE_ORDER = ['soft', 'balanced', 'hard'];
