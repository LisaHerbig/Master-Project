import { H3, S2 } from '@/components/atoms/text';
import { Button, Input, ProgressIndicator } from '@/components/molecules';
import { Colors, Typography } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BACKGROUND_URI = require('@/assets/images/Image_welcome-hand.png');

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignUp() {
    setLoading(true);
    setError('');
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (signUpError) setError(signUpError.message);
    setLoading(false);
  }

  return (
    <ImageBackground source={BACKGROUND_URI} resizeMode="cover" style={styles.root} imageStyle={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.centered}>
            <View style={styles.card}>
              <ProgressIndicator step={3} total={3} />

              <View style={styles.headingGroup}>
                <H3>DEINE REISE{'\n'}BEGINNT</H3>
                <S2>ERSTELLE DIR EINEN ACCOUNT</S2>
              </View>

              <Text style={styles.body}>
                Anschließend kannst du die Bücher scannen und mehr über die Welten erfahren.
              </Text>

              <View style={styles.fields}>
                <Input
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  textContentType="name"
                />
                <Input
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  variant={error ? 'error' : 'default'}
                />
                <Input
                  placeholder="Passwort"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  textContentType="newPassword"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <View style={styles.buttons}>
                <Button
                  label="Account erstellen"
                  size="large"
                  variant="primary"
                  style={styles.fullWidth}
                  onPress={handleSignUp}
                  loading={loading}
                />
                <Text style={styles.loginPrompt}>Du hast schon einen Account?</Text>
                <Button
                  label="Einloggen"
                  size="medium"
                  variant="outline"
                  onPress={() => router.replace('/(auth)/login')}
                />
              </View>
            </View>
          </View>
          </TouchableWithoutFeedback>
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
    paddingVertical: 40,
    paddingHorizontal: 32,
    shadowColor: '#1C1408',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  headingGroup: {
    marginTop: 24,
    marginBottom: 12,
    gap: 8,
  },
  body: {
    ...Typography.b2Regular,
    color: Colors.colorDark,
    marginBottom: 20,
  },
  fields: {
    gap: 10,
    marginBottom: 24,
  },
  errorText: {
    ...Typography.b3Regular,
    color: Colors.error,
    paddingHorizontal: 8,
  },
  buttons: {
    alignItems: 'center',
    gap: 12,
  },
  fullWidth: {
    width: '100%',
  },
  loginPrompt: {
    ...Typography.b2Regular,
    color: Colors.colorDark,
  },
});
