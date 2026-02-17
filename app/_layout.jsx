import { StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { StyleSheet, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { Colors } from '../constants/Colors';
import { AuthProvider } from './_contexts/AuthContext';
import { useAuth } from './_hooks/useAuth';

function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export const Layout = () => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <>
      <StatusBar style='auto' />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShown: false,
        }}
      >
        {user.authenticated ? (
          <Stack.Screen name='(dashboard)' options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name='(Auth)' options={{ headerShown: false }} />
        )}
      </Stack>
    </>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
