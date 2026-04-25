/*import { StyleSheet, Text, View } from "react-native";*/
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

console.log('supabase import in index:', supabase)
console.log('supabase.auth in index:', supabase?.auth)

export default function HomeScreen() {
  const {profile} = useAuthContext();

  async function onSignOutButtonPress() {
     console.log('before signOut, supabase =', supabase)
    console.log('before signOut, supabase.auth =', supabase?.auth)

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };
  return (
    <View>
      <Stack.Screen options={{headerShown: true, title:'Welcome'}}/>
      <Text>
        {profile?.full_name}
      </Text>
      <Button title="Sign Out" onPress={onSignOutButtonPress}/>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
