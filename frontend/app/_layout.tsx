import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { PatientsProvider } from '../contexts/PatientsContext';
import { AppointmentProvider } from '@/contexts/AppointmentContext';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { DoctorProvider } from '../contexts/DoctorContext';
import { UserProvider } from '../contexts/UserContext';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <CustomThemeProvider>
        <AuthProvider>
          <UserProvider>
            <ReportsProvider>
              <AppointmentProvider>
                <PatientsProvider>
                  <DoctorProvider>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                      <Stack
                        screenOptions={{
                          headerShown: false,
                        }}
                      >
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                      </Stack>
                    </ThemeProvider>
                  </DoctorProvider>
                </PatientsProvider>
              </AppointmentProvider>
            </ReportsProvider>
          </UserProvider>
        </AuthProvider>
      </CustomThemeProvider>
    </ErrorBoundary>
  );
}

function ErrorFallback() {
  return null;
}

