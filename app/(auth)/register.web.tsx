import { Redirect } from 'expo-router';

// Demo mode (web only): no registration, the login screen offers guest access.
export default function Register() {
  return <Redirect href="/(auth)/login" />;
}
