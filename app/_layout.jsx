import { StyleSheet, StatusBar, useColorScheme } from 'react-native';
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
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
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
