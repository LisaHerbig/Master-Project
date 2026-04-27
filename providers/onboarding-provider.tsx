import AsyncStorage from '@react-native-async-storage/async-storage';
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

const STORAGE_KEY = 'hasSeenOnboarding';

export default function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      setHasSeenOnboarding(value === 'true');
      setIsChecked(true);
    });
  }, []);

  const complete = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenOnboarding(true);
  };

  return (
    <OnboardingContext.Provider value={{ hasSeenOnboarding, isChecked, complete }}>
      {children}
    </OnboardingContext.Provider>
  );
}
