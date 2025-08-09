import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePatients } from '../../contexts/PatientsContext';
import Modal from '../../components/ui/Modal';
import AddPatient from '../../components/forms/AddPatient';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  const { patients, loading: patientsLoading, fetchPatients } = usePatients();
  const colorScheme = useColorScheme();
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

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
    { title: 'Today\'s Appointments', value: '0', icon: 'calendar-outline' },
    { title: 'High Risk Cases', value: highRiskPatients.toString(), icon: 'warning-outline' },
    { title: 'Completed Visits', value: '0', icon: 'checkmark-circle-outline' },
  ];

  const getDisplayName = () => {
    if (!user) return 'Guest';
    if (user.role !== 'healthProvider') {
      return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 
             user.facilityName || user.email || 'User';
    }
    return user.facilityName || 
           (user as any).facility?.facilityName || 
           (user as any).facility?.name || 
           (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
           (user as any).name || 
           user.email || 
           'Health Provider';
  };

  // Responsive sizing
  const { width } = Dimensions.get('window');
  const isSmall = width < 375;
  const isLarge = width > 500;
  const iconSize = isSmall ? 18 : isLarge ? 30 : 24;
  const statIconSize = iconSize;
  const statValueFont = isSmall ? 18 : isLarge ? 28 : 22;
  const statTitleFont = isSmall ? 11 : isLarge ? 16 : 13;
  const patientNameFont = isSmall ? 14 : isLarge ? 20 : 16;
  const patientDetailsFont = isSmall ? 11 : isLarge ? 15 : 13;
  const sectionTitleFont = isSmall ? 16 : isLarge ? 24 : 18;
  const actionFont = isSmall ? 11 : isLarge ? 15 : 13;
  const actionIconSize = isSmall ? 18 : isLarge ? 28 : 24;
  const padding = isSmall ? 10 : isLarge ? 24 : SIZES.padding;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <View style={{ flex: 2 }} />
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/logo/fetalwatch.png')} style={styles.logo} />
          <Text style={styles.title} numberOfLines={1}>FETALWATCH</Text>
        </View>
        <View style={{ flex: 2 }} />
      </View>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary, padding }]}> 
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.white, fontSize: actionFont + 2 }]}>
              Welcome back,
            </Text>
            <Text style={[styles.nameText, { color: colors.white, fontSize: sectionTitleFont + 8 }]}>
              {loading ? 'Loading...' : getDisplayName()}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { 
              backgroundColor: colors.white, 
              width: iconSize * 1.7, 
              height: iconSize * 1.7, 
              borderRadius: iconSize * 0.85,
              marginTop: -14
            }]}
            onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={iconSize} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../assets/illustration/a_vibrant_2d_illustration_featuring_black_obstetricians_and_healthcare_providers_engaging_with_the__lyacw4geud106dkbw8zq_0.png')}
          style={[styles.headerIllustration, { height: iconSize * 5 }]}
          resizeMode="contain"
        />
      </View>

      {/* Quick Actions */}
      <View style={[styles.quickActions, { padding, marginTop: -padding * 2 }]}> 
        {[
          { icon: 'person-add-outline', text: 'Add Patient', onPress: () => setShowAddPatientModal(true) },
          { icon: 'calendar-outline', text: 'Schedule', onPress: () => router.push('/(tabs)/Patients') },
          { icon: 'bar-chart-outline', text: 'Reports', onPress: () => router.push('/(tabs)/Reports') }
        ].map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionButton, { backgroundColor: colors.white, padding }]}
            onPress={action.onPress}
          >
            <Ionicons name={action.icon as any} size={actionIconSize} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text, fontSize: actionFont }]}>
              {action.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Grid */}
      <View style={[styles.statsGrid, { padding }]}> 
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[styles.statCard, { backgroundColor: colors.white, padding }]}
          >
            <Ionicons name={stat.icon as any} size={statIconSize} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text, fontSize: statValueFont }]}>{stat.value}</Text>
            <Text style={[styles.statTitle, { color: colors.gray, fontSize: statTitleFont }]}>{stat.title}</Text>
          </View>
        ))}
      </View>

      {/* Recent Patients */}
      <View style={[styles.section, { padding }]}> 
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: sectionTitleFont }]}>
            Recent Patients
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/Patients')}>
            <Text style={[styles.seeAll, { color: colors.primary, fontSize: actionFont }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        {patientsLoading ? (
          <Text style={[styles.loadingText, { color: colors.gray, fontSize: actionFont + 2 }]}>
            Loading patients...
          </Text>
        ) : recentPatients.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.gray, fontSize: actionFont + 2 }]}>
            No patients yet
          </Text>
        ) : (
          recentPatients.map((patient) => {
            const age = calculateAge(patient.dateOfBirth);
            const risk = getRiskLevel(patient.weekOfPregnancy);
            return (
              <TouchableOpacity
                key={patient._id}
                style={[styles.patientCard, { backgroundColor: colors.white, padding }]}
                onPress={() => router.push(`/(tabs)/Patients/${patient._id}`)}
              >
                <View style={styles.patientInfo}>
                  <Text style={[styles.patientName, { color: colors.text, fontSize: patientNameFont }]}>
                    {patient.name}
                  </Text>
                  <Text style={[styles.patientDetails, { color: colors.gray, fontSize: patientDetailsFont }]}>
                    {age} years • {patient.weekOfPregnancy || 'N/A'} weeks
                  </Text>
                </View>
                <View style={styles.patientStatus}>
                  <View style={[styles.riskBadge, {
                    backgroundColor: risk === 'High' ? colors.error : colors.success,
                    paddingHorizontal: padding / 2,
                    paddingVertical: padding / 4,
                    borderRadius: padding / 2,
                  }]}>
                    <Text style={[styles.riskText, { fontSize: actionFont }]}>{risk} Risk</Text>
                  </View>
                  <Text style={[styles.lastVisit, { color: colors.gray, fontSize: actionFont }]}>
                    Recent
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Add Patient Modal */}
      <Modal
        visible={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        title="Add New Patient"
        size="large"
        animationType="slide"
      >
        <AddPatient
          onSuccess={() => {
            setShowAddPatientModal(false);
            fetchPatients(); // Refresh the patient list
          }}
          onCancel={() => setShowAddPatientModal(false)}
        />
      </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 0,
  },
  container: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  welcomeText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    opacity: 0.8,
  },
  nameText: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  headerIllustration: {
    width: '100%',
    height: 200,
    marginTop: SIZES.padding,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    marginTop: -SIZES.padding * 2,
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
  section: {
    padding: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    ...SHADOWS.light,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  patientDetails: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  patientStatus: {
    alignItems: 'flex-end',
  },
  riskBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  riskText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  lastVisit: {
    fontSize: SIZES.small,
    marginTop: SIZES.base / 2,
  },
  loadingText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    padding: SIZES.padding,
  },
  emptyText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    padding: SIZES.padding,
  },
});
