import { H3, S2 } from '@/components/atoms/text';
import { Button } from '@/components/molecules';
import { Colors, Typography } from '@/constants/theme';
import { signInAsGuest } from '@/lib/demo-store';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BACKGROUND_URI = require('@/assets/images/Image_welcome-hand.png');

// Demo mode (web only): guest access instead of email and password.
export default function Login() {
  return (
    <ImageBackground source={BACKGROUND_URI} resizeMode="cover" style={styles.root} imageStyle={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <View style={styles.card}>
            <H3>WILLKOMMEN</H3>
            <S2 style={styles.subtitle}>ZUR DEMO DER APP</S2>

            <Text style={styles.body}>
              In der echten App meldest du dich mit deinem Account an. Für die Demo brauchst du
              keinen – steig einfach als Gast ein.
            </Text>

            <View style={styles.buttons}>
              <Button
                label="Als Gast fortfahren"
                size="giant"
                variant="primary"
                rightIcon="arrow-next"
                style={styles.fullWidth}
                onPress={signInAsGuest}
              />
              <Text style={styles.note}>Login und Registrierung sind in der Demo deaktiviert.</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // On web the background image keeps its pixel size (874 × 1240) unless it is told to fill
  // the screen; stretch it like on iOS so "cover" crops it around the centre.
  backgroundImage: {
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
    width: 'auto',
    height: 'auto',
  } as any,
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
  subtitle: {
    marginTop: 8,
  },
  body: {
    ...Typography.b2Regular,
    color: Colors.colorDark,
    marginTop: 16,
    marginBottom: 32,
  },
  buttons: {
    alignItems: 'center',
    gap: 16,
  },
  fullWidth: {
    width: '100%',
  },
  note: {
    ...Typography.b3Regular,
    color: Colors.grey500,
    textAlign: 'center',
  },
});
