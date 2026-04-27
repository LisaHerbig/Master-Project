import { OnboardingContext } from '@/providers/onboarding-provider';
import { useContext } from 'react';

export const useOnboardingContext = () => useContext(OnboardingContext);
