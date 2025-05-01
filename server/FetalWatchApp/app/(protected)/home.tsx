import { useRouter } from 'expo-router';
import React, { useState, ReactNode, FC, memo } from 'react';

// Type definitions
// Define screen routes for type-safe navigation
type ScreenRoute = 
  | '/screens/PatientsScreen'
  | '/screens/PregnancyTrackingScreen'
  | '/screens/RiskAssessmentScreen'
  | '/screens/AddPatientScreen'
  | '/screens/AlertsScreen'
  | '/screens/ProfileScreen'
  | '/screens/SettingsScreen'
  | '/screens/ReportsScreen';

type QuickNavOption = {
  label: string;
  description: string;
  route: ScreenRoute;
  icon: ReactNode;
};

type AdditionalNavOption = {
  label: string;
  description: string;
  route: ScreenRoute;
  icon: ReactNode;
};
import {
  FaBell,
  FaCalendarAlt,
  FaChartBar,
  FaClipboardList,
  FaCog,
  FaHome,
  FaUserInjured,
  FaUserMd,
  FaUserPlus
} from 'react-icons/fa';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AndroidBottomNavigation from '../(tabs)/_layout';

// Mock data - replace with actual data fetching
const facilityStats = {
  totalPatients: 245,
  highRiskCases: 37,
  recentCases: [
    { id: '1', name: 'Maria Silva', riskLevel: 'High', lastCheckup: '2 days ago' },
    { id: '2', name: 'Ana Santos', riskLevel: 'Medium', lastCheckup: '5 days ago' },
    { id: '3', name: 'Lucia Oliveira', riskLevel: 'Low', lastCheckup: '1 week ago' },
  ] as RecentCase[]
};

const HomeScreen: FC = () => {
  // Ensure type safety for navigation
  const navigateToRoute = (route: ScreenRoute): void => {
    try {
      router.push(route);
    } catch (error: any) {
      console.error('Navigation error:', error);
    }
  };
  const router = useRouter();
  const [selectedStat, setSelectedStat] = useState(0);

  const navigateTo = (screen: ScreenRoute): void => {
    try {
      router.push(screen);
    } catch (error: any) {
      console.error('Navigation error:', error);
    }
  };

  const quickNavOptions: QuickNavOption[] = [
    {
      icon: <FaUserInjured key="patients-icon" size={30} color="#3498db" />,
      label: 'Patients',
      route: '/screens/PatientsScreen',
      description: 'View and manage patient records'
    },
    {
      icon: <FaCalendarAlt key="pregnancy-tracking-icon" size={30} color="#9b59b6" />,
      label: 'Pregnancy Tracking',
      route: '/screens/PregnancyTrackingScreen',
      description: 'Monitor pregnancy stages and health'
    },
    {
      icon: <FaChartBar size={30} color="#e74c3c" />,
      label: 'Risk Assessment',
      route: '/screens/RiskAssessmentScreen',
      description: 'Analyze potential health risks'
    },
    {
      icon: <FaUserPlus size={30} color="#27ae60" />,
      label: 'Add Patient',
      route: '/screens/AddPatientScreen',
      description: 'Register new patient'
    }
  ];

  const additionalNavOptions: AdditionalNavOption[] = [
    {
      icon: <FaBell key="alerts-icon" size={24} color="#f39c12" />,
      label: 'Alerts',
      route: '/screens/AlertsScreen',
      description: 'View critical health alerts'
    },
    {
      icon: <FaUserMd key="profile-icon" size={24} color="#2980b9" />,
      label: 'Profile',
      route: '/screens/ProfileScreen',
      description: 'Manage your account'
    },
    {
      icon: <FaCog key="settings-icon" size={24} color="#34495e" />,
      label: 'Settings',
      route: '/screens/SettingsScreen',
      description: 'App configuration'
    },
    { 
      icon: <FaClipboardList key="reports-icon" size={24} color="#8e44ad" />, 
      label: 'Reports', 
      route: '/screens/ReportsScreen',
      description: 'Generate health reports'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Patients</Text>
          <Text style={styles.statValue}>{facilityStats.totalPatients}</Text>
                onPress={() => navigateTo(option.route)}
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>High-Risk Cases</Text>
          <Text style={styles.statValue}>{facilityStats.highRiskCases}</Text>
        </View>
      </View>

      <View style={styles.quickNavContainer}>
        {quickNavOptions.map((option, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.quickNavButton}
            onPress={() => navigateTo(option.route)}
          >
            <View style={styles.navIconContainer}>
              {option.icon}
            </View>
            <View style={styles.navTextContainer}>
              <Text style={styles.quickNavButtonText}>{option.label}</Text>
              <Text style={styles.quickNavButtonDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.additionalNavContainer}>
        {additionalNavOptions.map((option, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.additionalNavButton}
            onPress={() => navigateTo(option.route)}
          >
            <View style={styles.navIconContainer}>
              {option.icon}
            </View>
            <View style={styles.navTextContainer}>
              <Text style={styles.additionalNavButtonText}>{option.label}</Text>
              <Text style={styles.additionalNavButtonDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickAccessContainer}>
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => navigateTo('/screens/PatientsScreen')}
        >
          <Image 
            source={require('../../assets/icons/patient-icon.svg')} 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>Patients</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => navigateTo('/screens/AddPatientScreen')}
        >
          <Image 
            source={require('../../assets/icons/add-patient-icon.svg')} 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>Add Patient</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => navigateTo('/screens/ReportsScreen')}
        >
          <Image 
            source={require('../../assets/icons/reports-icon.svg')} 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>Reports</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentCasesContainer}>
        <Text style={styles.sectionTitle}>Recent Cases</Text>
        {facilityStats.recentCases.map((caseItem, index) => (
          <TouchableOpacity 
            key={caseItem.id}
            style={styles.caseCard}
          >
            <View style={styles.caseCardContent}>
              <Text style={styles.patientName}>{caseItem.name}</Text>
              <View style={[styles.riskBadge, caseItem.riskLevel === 'High' ? styles.highRisk : caseItem.riskLevel === 'Medium' ? styles.mediumRisk : styles.lowRisk]}>
                <Text style={styles.riskBadgeText}>{caseItem.riskLevel}</Text>
              </View>
            </View>
            <Text style={styles.lastCheckupText}>Last Checkup: {caseItem.lastCheckup}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  headerContainer: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529'
  },
  quickNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15
  },
  quickNavButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  navIconContainer: {
    marginBottom: 10
  },
  navTextContainer: {
    alignItems: 'center'
  },
  quickNavButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212529'
  },
  quickNavButtonDescription: {
    fontSize: 12,
    color: '#6c757d'
  },
  additionalNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15
  },
  additionalNavButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  additionalNavButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212529'
  },
  additionalNavButtonDescription: {
    fontSize: 12,
    color: '#6c757d'
  },
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  quickAccessButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 12,
    color: '#2c3e50',
  },
  recentCasesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  caseCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  caseCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  highRisk: {
    backgroundColor: '#ff6b6b',
  },
  mediumRisk: {
    backgroundColor: '#feca57',
  },
  lowRisk: {
    backgroundColor: '#2ecc71',
  },
  riskBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lastCheckupText: {
    color: '#7f8c8d',
    fontSize: 12,
    marginTop: 5,
  },
});
