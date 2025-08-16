import Welcome from '@/components/Welcome';

export default function HomePage() {
  // In a real application, you'd have logic here to determine
  // if the user has already started a challenge.
  // const hasStartedChallenge = false;

  return (
    // {hasStartedChallenge ? <Dashboard /> : <Welcome />}
    <Welcome />
  );
}
