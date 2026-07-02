import { H3, S2 } from '@/components/atoms/text';
import { Button, ProgressIndicator } from '@/components/molecules';
import { Colors, Typography } from '@/constants/theme';
import { useOnboardingContext } from '@/hooks/use-onboarding-context';
import { router } from 'expo-router';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BACKGROUND_URI = require('@/assets/images/Image_welcome-hand.png');

export default function OnboardingTwo() {
  const { complete } = useOnboardingContext();

  const handleSkip = async () => {
    await complete();
    router.replace('/(auth)/login');
  };

  const handleNext = async () => {
    await complete();
    router.replace('/(auth)/register');
  };

  return (
    <ImageBackground source={BACKGROUND_URI} resizeMode="cover" style={styles.root} imageStyle={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <View style={styles.card}>
            <ProgressIndicator step={2} total={3} />
            <View style={styles.headingGroup}>
              <H3>ZWISCHEN DEN{'\n'}ZEILEN</H3>
              <S2>IST ALLES MÖGLICH</S2>
            </View>
            <Text style={styles.body}>
              Entdecke einzigartige Inhalte und interessante Fakten.
              Erlebe noch mehr über die Geschichten, stelle Fragen und tauche tief ein.
            </Text>
            <View style={styles.buttons}>
              <Button
                label="Weiter"
                size="large"
                variant="primary"
                style={styles.fullWidth}
                onPress={handleNext}
              />
              <Button
                label="Überspringen"
                size="large"
                variant="outline"
                onPress={handleSkip}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    top: 30,
  },
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    paddingVertical: 48,
    paddingHorizontal: 32,
    shadowColor: '#1C1408',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  headingGroup: {
    marginTop: 32,
    marginBottom: 16,
    gap: 8,
  },
  body: {
    ...Typography.b2Regular,
    color: Colors.black,
    marginBottom: 48,
  },
  buttons: {
    alignItems: 'center',
    gap: 12,
  },
  fullWidth: {
    width: '100%',
  },
});
