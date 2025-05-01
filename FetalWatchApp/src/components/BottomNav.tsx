import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { NavigationProp, useNavigationState } from '@react-navigation/native';
import { theme } from '../theme';

interface BottomNavProps {
  navigation: NavigationProp<any>;
}

const BottomNav: React.FC<BottomNavProps> = ({ navigation }) => {
  const currentRoute = useNavigationState(state => state.routes[state.index].name);

  const [index, setIndex] = React.useState(0);

  // Initialize index based on current route
  React.useEffect(() => {
    const routeMap: Record<string, number> = {
      Home: 0,
      PatientScreen: 1,
      AddPatient: 2,
      Calendar: 3,
      AI: 4,
    };
    setIndex(routeMap[currentRoute] || 0);
  }, [currentRoute]);

  const routes = [
    { key: 'home', title: 'Dashboard', icon: 'home-outline', color: theme.colors.primary },
    { key: 'patients', title: 'Patients', icon: 'account-group-outline', color: theme.colors.primary },
    { key: 'newVisit', title: 'New Visit', icon: 'plus-circle-outline', color: theme.colors.primary },
    { key: 'calendar', title: 'Calendar', icon: 'calendar-outline', color: theme.colors.primary },
    { key: 'analytics', title: 'Analytics', icon: 'chart-box-outline', color: theme.colors.primary },
  ];

  // Define empty scene components for BottomNavigation.SceneMap
  const EmptyComponent = () => null;

  const renderScene = BottomNavigation.SceneMap({
    home: EmptyComponent,
    patients: EmptyComponent,
    newVisit: EmptyComponent,
    calendar: EmptyComponent,
    analytics: EmptyComponent,
  });

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    const destinations = ['Home', 'PatientScreen', 'AddPatient', 'Calendar', 'AI'];
    navigation.navigate(destinations[newIndex]);
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
      barStyle={{ backgroundColor: theme.colors.surface }}
      activeColor={theme.colors.primary}
      inactiveColor="rgba(0, 0, 0, 0.6)"
      sceneAnimationEnabled={true}
    />
  );
};

export default BottomNav;

