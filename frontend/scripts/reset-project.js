#!/usr/bin/env node

/**
 * This script resets the project to a clean, professional mobile app structure.
 * It follows Expo Router best practices with proper authentication flow.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

// Root index that handles auth routing
const rootIndexContent = `import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from './contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from './components/constants/Theme';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Redirect based on authentication status
  return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
}
`;

// Root layout
const rootLayoutContent = `import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Context Providers
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PatientsProvider } from './contexts/PatientsContext';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
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

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <CustomThemeProvider>
          <AuthProvider>
            <PatientsProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
              </ThemeProvider>
            </PatientsProvider>
          </AuthProvider>
        </CustomThemeProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

function ErrorFallback() {
  return null;
}
`;

// Auth layout
const authLayoutContent = `import { Stack } from 'expo-router';
import { COLORS } from '../../components/constants/Theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.white },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Login" />
      <Stack.Screen name="Register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
`;

// Auth index (landing page)
const authIndexContent = `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';

export default function AuthIndex() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>FetalWatch</Text>
        </View>
        
        <Text style={styles.title}>Welcome to FetalWatch</Text>
        <Text style={styles.subtitle}>
          Professional fetal health monitoring and patient management
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/(auth)/Login')}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/(auth)/Register')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.padding * 3,
  },
  buttonContainer: {
    width: '100%',
    gap: SIZES.padding,
  },
  button: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
});
`;

// Main tabs layout - matches your existing structure
const tabsLayoutContent = `import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../components/constants/Theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Patients"
        options={{
          title: 'Patients',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Appointment"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
`;

// Dashboard screen
const dashboardContent = `import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../../components/constants/Theme';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { usePatients } from '../../../contexts/PatientsContext';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  const { patients, loading: patientsLoading, fetchPatients } = usePatients();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const getRiskLevel = (weekOfPregnancy?: number) => {
    if (!weekOfPregnancy) return 'Medium';
    if (weekOfPregnancy < 20 || weekOfPregnancy > 35) return 'High';
    return 'Low';
  };

  const highRiskPatients = patients.filter(p => getRiskLevel(p.weekOfPregnancy) === 'High').length;
  const recentPatients = patients.slice(0, 3);

  const stats = [
    { title: 'Total Patients', value: patients.length.toString(), icon: 'people-outline' },
    { title: 'Today\\'s Appointments', value: '0', icon: 'calendar-outline' },
    { title: 'High Risk Cases', value: highRiskPatients.toString(), icon: 'warning-outline' },
    { title: 'Completed Visits', value: '0', icon: 'checkmark-circle-outline' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.white }]}>
              Welcome back,
            </Text>
            <Text style={[styles.nameText, { color: colors.white }]}>
              {loading ? 'Loading...' : user ? \`\${user.firstName} \${user.lastName}\` : 'Guest'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: colors.white }]}
            onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/(tabs)/Patients/add')}
        >
          <Ionicons name="person-add" size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Add Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/(tabs)/Appointment')}
        >
          <Ionicons name="calendar" size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/(tabs)/Reports')}
        >
          <Ionicons name="bar-chart" size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[styles.statCard, { backgroundColor: colors.white }]}
          >
            <Ionicons name={stat.icon as any} size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statTitle, { color: colors.gray }]}>{stat.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  welcomeText: {
    fontSize: SIZES.medium,
    opacity: 0.8,
  },
  nameText: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SIZES.base,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  actionText: {
    marginTop: SIZES.base,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.padding,
    gap: SIZES.base,
  },
  statCard: {
    width: '48%',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  statValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: SIZES.base,
  },
  statTitle: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
});
`;

// Modal component
const modalContent = `import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
}: ModalProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getModalStyle = () => {
    switch (size) {
      case 'small':
        return styles.modalSmall;
      case 'medium':
        return styles.modalMedium;
      case 'large':
        return styles.modalLarge;
      case 'fullscreen':
        return styles.modalFullscreen;
      default:
        return styles.modalMedium;
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modal,
                getModalStyle(),
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {showCloseButton && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={24} color={COLORS.gray} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.content}>{children}</View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    ...SHADOWS.heavy,
    maxHeight: '90%',
  },
  modalSmall: {
    width: '80%',
    maxWidth: 300,
  },
  modalMedium: {
    width: '90%',
    maxWidth: 400,
  },
  modalLarge: {
    width: '95%',
    maxWidth: 500,
  },
  modalFullscreen: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    margin: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  closeButton: {
    padding: SIZES.base / 2,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
});
`;

// Create app structure
const createAppStructure = async (userInput) => {
  try {
    if (userInput === "y") {
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      }
    }

    // Create new app structure
    const appPath = path.join(root, newAppDir);
    await fs.promises.mkdir(appPath, { recursive: true });

    // Create directory structure that matches your existing app
    const dirs = [
      'app/(auth)',
      'app/(tabs)',
      'app/(tabs)/Patients',
      'app/(tabs)/Appointment', 
      'app/(tabs)/Reports',
      'app/(tabs)/Profile',
      'components/ui',
      'components/constants',
      'components/forms',
      'contexts',
      'services',
      'utils',
      'types',
      'hooks'
    ];

    for (const dir of dirs) {
      await fs.promises.mkdir(path.join(root, dir), { recursive: true });
    }

    // Create files with correct structure
    const files = [
      { path: 'app/index.tsx', content: rootIndexContent },
      { path: 'app/_layout.tsx', content: rootLayoutContent },
      { path: 'app/(auth)/_layout.tsx', content: authLayoutContent },
      { path: 'app/(auth)/index.tsx', content: authIndexContent },
      { path: 'app/(tabs)/_layout.tsx', content: tabsLayoutContent },
      { path: 'app/(tabs)/index.tsx', content: dashboardContent },
      { path: 'components/ui/Modal.tsx', content: modalContent },
    ];

    for (const file of files) {
      await fs.promises.writeFile(path.join(root, file.path), file.content);
      console.log(`📄 ${file.path} created.`);
    }

    console.log("\n✅ Professional app structure created successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Run `npm install` to ensure all dependencies are installed");
    console.log("2. Run `npx expo start` to start development");
    console.log("3. The app now follows proper routing: / → (auth) or (tabs)");
    console.log("4. Tab structure matches your existing: Patients, Appointment, Reports, Profile");
    console.log("5. Complete the remaining screens in each section");
    
    if (userInput === "y") {
      console.log(`6. Reference /${exampleDir} for existing code`);
      console.log(`7. Delete /${exampleDir} when no longer needed`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Do you want to move existing files to /app-example? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      createAppStructure(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
