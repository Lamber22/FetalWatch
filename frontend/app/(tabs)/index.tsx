import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/components/constants/Colors';
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Illustration */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.white }]}>
              Welcome back,
            </Text>
            <Text style={[styles.nameText, { color: colors.white }]}>
              {loading ? 'Loading...' : user ? `${user.firstName} ${user.lastName}` : 'Guest'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: colors.white }]}
            onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../assets/illustration/a_vibrant_2d_illustration_featuring_black_obstetricians_and_healthcare_providers_engaging_with_the__lyacw4geud106dkbw8zq_0.png')}
          style={styles.headerIllustration}
          resizeMode="contain"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.white }]}
          onPress={() => setShowAddPatientModal(true)}
        >
          <Ionicons name="person-add-outline" size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Add Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/(tabs)/Appointment')}
        >
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.white }]}
          onPress={() => router.push('/(tabs)/Reports')}
        >
          <Ionicons name="bar-chart-outline" size={24} color={colors.primary} />
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

      {/* Recent Patients */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Patients</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/Patients')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {patientsLoading ? (
          <Text style={[styles.loadingText, { color: colors.gray }]}>Loading patients...</Text>
        ) : recentPatients.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.gray }]}>No patients yet</Text>
        ) : (
          recentPatients.map((patient) => {
            const age = calculateAge(patient.dateOfBirth);
            const risk = getRiskLevel(patient.weekOfPregnancy);
            
            return (
              <TouchableOpacity
                key={patient._id}
                style={[styles.patientCard, { backgroundColor: colors.white }]}
                onPress={() => router.push(`/(tabs)/Patients/${patient._id}`)}
              >
                <View style={styles.patientInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>{patient.name}</Text>
                  <Text style={[styles.patientDetails, { color: colors.gray }]}>
                    {age} years • {patient.weekOfPregnancy || 'N/A'} weeks
                  </Text>
                </View>
                <View style={styles.patientStatus}>
                  <View
                    style={[
                      styles.riskBadge,
                      {
                        backgroundColor:
                          risk === 'High' ? colors.error : colors.success,
                      },
                    ]}
                  >
                    <Text style={styles.riskText}>{risk} Risk</Text>
                  </View>
                  <Text style={[styles.lastVisit, { color: colors.gray }]}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.padding,
    borderBottomLeftRadius: SIZES.radius * 2,
    borderBottomRightRadius: SIZES.radius * 2,
    ...SHADOWS.medium,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
