import { H3, S2 } from '@/components/atoms/text';
import { Button, Input } from '@/components/molecules';
import { Colors, Typography } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BACKGROUND_URI = require('@/assets/images/Image_welcome-hand.png');

type FormState = 'idle' | 'loading' | 'error_password' | 'error_email' | 'success';

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');

  async function handleLogin() {
    // Validate email format client-side first
    if (!isValidEmail(email)) {
      setFormState('error_email');
      return;
    }

    setFormState('loading');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Supabase returns a single error for wrong credentials — default to password field
      setFormState('error_password');
      return;
    }

    // Brief success flash before the root navigator redirects automatically
    setFormState('success');
  }

  const emailVariant =
    formState === 'error_email' ? 'error'
    : formState === 'success'   ? 'success'
    : 'default';

  const passwordVariant =
    formState === 'error_password' ? 'error'
    : formState === 'success'      ? 'success'
    : 'default';

  const buttonVariant =
    formState === 'error_email' || formState === 'error_password' ? 'error'
    : formState === 'success'                                      ? 'success'
    : 'primary';

  return (
    <ImageBackground source={BACKGROUND_URI} resizeMode="cover" style={styles.root} imageStyle={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.centered}>
            <View style={styles.card}>
                <H3>WILLKOMMEN</H3>
                <S2 style={styles.subtitle}>BITTE LOGGE DICH EIN</S2>

                <View style={styles.fields}>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={(t) => { setEmail(t); setFormState('idle'); }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    variant={emailVariant}
                  />
                  <Input
                    placeholder="Passwort"
                    value={password}
                    onChangeText={(t) => { setPassword(t); setFormState('idle'); }}
                    secureTextEntry
                    textContentType="password"
                    variant={passwordVariant}
                  />
                </View>

                <View style={styles.buttons}>
                  <Button
                    label="Einloggen"
                    size="large"
                    variant={buttonVariant}
                    style={styles.fullWidth}
                    onPress={handleLogin}
                    loading={formState === 'loading'}
                  />
                  <Text style={styles.registerPrompt}>Du hast noch keinen Account?</Text>
                  <Button
                    label="Account erstellen"
                    size="medium"
                    variant="outline"
                    onPress={() => router.replace('/(auth)/register')}
                  />
                </View>
              </View>
          </View>
        </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
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
  fields: {
    gap: 10,
    marginTop: 32,
    marginBottom: 24,
  },
  buttons: {
    alignItems: 'center',
    gap: 12,
  },
  fullWidth: {
    width: '100%',
  },
  registerPrompt: {
    ...Typography.b2Regular,
    color: Colors.colorDark,
  },
});
