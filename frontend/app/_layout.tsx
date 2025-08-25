import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View, Text } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { PatientsProvider } from '../contexts/PatientsContext';
import { AppointmentProvider } from '@/contexts/AppointmentContext';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { RecordProvider } from '../contexts/RecordContext';
import { DoctorProvider } from '../contexts/DoctorContext';
import { UserProvider } from '../contexts/UserContext';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showFontError, setShowFontError] = useState(false);
  let spaceMonoFont;
  try {
    spaceMonoFont = require('../assets/fonts/SpaceMono-Regular.ttf');
  } catch (e) {
    console.error('Font asset missing:', e);
    spaceMonoFont = undefined;
  }
  const [loaded, error] = useFonts({
    SpaceMono: spaceMonoFont,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error || !spaceMonoFont) {
      setShowFontError(true);
    }
  }, [error, spaceMonoFont]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (showFontError) {
    return <ErrorFallback errorMsg={"Font failed to load. Please reinstall the app or contact support."} />;
  }
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
              <RecordProvider>
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
            </RecordProvider>
          </ReportsProvider>
        </UserProvider>
        </AuthProvider>
      </CustomThemeProvider>
    </ErrorBoundary>
  );
}

function ErrorFallback({ errorMsg }: { errorMsg?: string }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold' }}>Something went wrong.</Text>
      <Text style={{ marginTop: 8 }}>{errorMsg || 'Please restart the app or contact support.'}</Text>
    </View>
  );
}

