import { completeOnboarding, hasSeenOnboarding as readHasSeen, subscribe } from '@/lib/demo-store';
import React, { createContext, useEffect, useState } from 'react';

type OnboardingData = {
  hasSeenOnboarding: boolean;
  isChecked: boolean;
  complete: () => Promise<void>;
};

export const OnboardingContext = createContext<OnboardingData>({
  hasSeenOnboarding: false,
  isChecked: false,
  complete: async () => {},
});

// Demo mode (web only): onboarding state lives in the demo store so a reset brings it back.
export default function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(readHasSeen);

  useEffect(() => subscribe(() => setHasSeenOnboarding(readHasSeen())), []);

  const complete = async () => completeOnboarding();

  return (
    <OnboardingContext.Provider value={{ hasSeenOnboarding, isChecked: true, complete }}>
      {children}
    </OnboardingContext.Provider>
  );
}
