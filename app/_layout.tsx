import { useAuthContext } from '@/hooks/use-auth-context';
import { useOnboardingContext } from '@/hooks/use-onboarding-context';
import AuthProvider from '@/providers/auth-provider';
import OnboardingProvider from '@/providers/onboarding-provider';
import { EBGaramond_600SemiBold, useFonts } from '@expo-google-fonts/eb-garamond';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, LogBox, View } from 'react-native';

// Supabase internally retries failed token refreshes and logs these before firing SIGNED_OUT.
// The app handles this correctly — suppress the dev overlay noise.
LogBox.ignoreLogs(['AuthRetryableFetchError', 'Network request failed']);

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoggedIn, isLoading: authLoading } = useAuthContext();
  const { hasSeenOnboarding, isChecked } = useOnboardingContext();

  if (authLoading || !isChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!hasSeenOnboarding}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={hasSeenOnboarding && !isLoggedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={hasSeenOnboarding && isLoggedIn}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ EBGaramond_600SemiBold });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <OnboardingProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </OnboardingProvider>
  );
}
