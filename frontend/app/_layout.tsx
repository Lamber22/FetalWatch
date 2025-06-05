import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { COLORS } from '../constants/theme';
import { ThemeProvider } from '../context/ThemeContext';
import { UserProvider } from '../context/UserContext';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { View } from 'react-native';
import { usePathname } from 'expo-router';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  
  // Define paths where the tab bar should be hidden
  const hideTabBarPaths = [
    '/patients/add',
    '/patients/[id]',
    '/calendar/add',
    '/calendar/[id]',
    '/reports/[id]',
    '/profile/personal',
    '/profile/notifications',
    '/profile/security',
    '/profile/support',
    '/profile/about',
  ];

  const shouldShowTabBar = !hideTabBarPaths.some(path => pathname.startsWith(path));

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: COLORS.primary,
              },
              headerTintColor: COLORS.white,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              contentStyle: {
                backgroundColor: COLORS.background,
              },
              tabBarStyle: {
                display: shouldShowTabBar ? 'flex' : 'none',
              },
            }}
          >
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(app)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </View>
      </UserProvider>
    </ThemeProvider>
  );
}
