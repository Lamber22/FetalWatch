import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { 
  FaHome, 
  FaUserInjured, 
  FaCalendarAlt, 
  FaChartBar, 
  FaBell, 
  FaUserMd, 
  FaCog, 
  FaUserCircle, 
  FaUserPlus 
} from 'react-icons/fa';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

// Animated Tab Icon Component
export interface AndroidBottomNavigationProps extends React.Attributes {
  state: {
    routes: Array<{ key: string; name: string }>;
    index: number;
  };
  descriptors: {
    [key: string]: {
      options: {
        title?: string;
      };
    };
  };
  navigation: {
    emit: (event: any) => any;
    navigate: (route: string) => void;
  };
}

const AndroidBottomNavigation: React.FC<AndroidBottomNavigationProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  return (
    <View style={styles.androidBottomNavContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIcon = () => {
          switch (route.name) {
            case 'index':
              return <FaHome size={24} color={isFocused ? '#3498db' : '#7f8c8d'} />;
            case 'patients':
              return <FaUserInjured size={24} color={isFocused ? '#3498db' : '#7f8c8d'} />;
            case 'pregnancy-tracking':
              return <FaCalendarAlt size={24} color={isFocused ? '#3498db' : '#7f8c8d'} />;
            case 'risk-assessment':
              return <FaChartBar size={24} color={isFocused ? '#3498db' : '#7f8c8d'} />;
            case 'alerts':
              return <FaBell size={24} color={isFocused ? '#3498db' : '#7f8c8d'} />;
            case 'profile':
              return <FaUserMd size={24} color={isFocused ? '#3498db' : '#7f8c8d'} />;
            case 'settings':
              return <FaCog size={24} color={isFocused ? '#3498db' : '#7f8c8d'} />;
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.androidNavItem}
          >
            <View style={styles.androidNavItemContent}>
              {getIcon()}
              <Text style={[
                styles.androidNavItemText, 
                { color: isFocused ? '#3498db' : '#7f8c8d' }
              ]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  androidBottomNavContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 10,
  },
  androidNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidNavItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidNavItemText: {
    fontSize: 10,
    marginTop: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#3498db',
    elevation: 0,
    shadowOpacity: 0,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const AnimatedTabIcon = ({ 
  icon, 
  focused, 
  color 
}: { 
  icon: React.ReactElement, 
  focused: boolean, 
  color?: string 
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(focused ? 1.2 : 1) }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {React.cloneElement(icon, { color: color || '#000' })}
    </Animated.View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: 'FetalWatch',
        headerTitleStyle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
        headerStyle: styles.header,
      }}
      tabBar={(props) => <AndroidBottomNavigation {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={<FaHome size={24} />}
              focused={focused}
              color={color}
            />
          ),
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={<FaUserInjured size={24} />}
              focused={focused}
              color={color}
            />
          ),
          title: 'Patients',
        }}
      />
      <Tabs.Screen
        name="pregnancy-tracking"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={<FaCalendarAlt size={24} />}
              focused={focused}
              color={color}
            />
          ),
          title: 'Pregnancy',
        }}
      />
      <Tabs.Screen
        name="risk-assessment"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={<FaChartBar size={24} />}
              focused={focused}
              color={color}
            />
          ),
          title: 'Risk',
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={<FaBell size={24} />}
              focused={focused}
              color={color}
            />
          ),
          title: 'Alerts',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={<FaUserCircle size={24} />}
              focused={focused}
              color={color}
            />
          ),
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={<FaCog size={24} />}
              focused={focused}
              color={color}
            />
          ),
          title: 'Settings',
        }}
      />
      <Tabs.Screen
        name="add-patient"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              icon={<FaUserPlus />}
              focused={focused}
              color={color}
            />
          ),
          title: 'Add Patient',
        }}
      />
    </Tabs>
  );
}
