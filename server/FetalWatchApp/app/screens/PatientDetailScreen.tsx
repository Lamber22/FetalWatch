import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  FaUserMd, 
  FaHeartbeat, 
  FaNotesMedical, 
  FaCalendarAlt,
  FaChartLine 
} from 'react-icons/fa';

// Mock patient data
const patients = [
  { 
    id: '1', 
    name: 'Maria Silva', 
    age: 28, 
    gestationalWeek: 24, 
    riskLevel: 'High',
    lastCheckup: '2 days ago',
    bloodPressure: '140/90',
    heartRate: 78,
    weight: 68,
    height: 165,
    medicalHistory: ['Gestational Diabetes', 'Hypertension'],
    upcomingAppointments: [
      { date: '2025-05-15', type: 'Ultrasound' },
      { date: '2025-06-01', type: 'Routine Checkup' }
    ]
  },
  // Add more patient data as needed
];

export default function PatientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Find patient by ID
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Patient not found</Text>
      </SafeAreaView>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'High': return '#ff6b6b';
      case 'Medium': return '#feca57';
      case 'Low': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Patient Header */}
        <View style={styles.headerContainer}>
          <View style={styles.patientIconContainer}>
            <FaUserMd size={50} color="#3498db" />
          </View>
          <Text style={styles.patientName}>{patient.name}</Text>
          <View 
            style={[
              styles.riskBadge, 
              { backgroundColor: getRiskColor(patient.riskLevel) }
            ]}
          >
            <Text style={styles.riskBadgeText}>{patient.riskLevel} Risk</Text>
          </View>
        </View>

        {/* Patient Overview */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Patient Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <FaHeartbeat size={24} color="#e74c3c" />
              <Text style={styles.overviewLabel}>Age</Text>
              <Text style={styles.overviewValue}>{patient.age}</Text>
            </View>
            <View style={styles.overviewItem}>
              <FaCalendarAlt size={24} color="#3498db" />
              <Text style={styles.overviewLabel}>Gestational Week</Text>
              <Text style={styles.overviewValue}>{patient.gestationalWeek}</Text>
            </View>
            <View style={styles.overviewItem}>
              <FaChartLine size={24} color="#2ecc71" />
              <Text style={styles.overviewLabel}>Last Checkup</Text>
              <Text style={styles.overviewValue}>{patient.lastCheckup}</Text>
            </View>
          </View>
        </View>

        {/* Medical Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Medical Details</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Blood Pressure</Text>
              <Text style={styles.detailValue}>{patient.bloodPressure}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Heart Rate</Text>
              <Text style={styles.detailValue}>{patient.heartRate} bpm</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Weight</Text>
              <Text style={styles.detailValue}>{patient.weight} kg</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Height</Text>
              <Text style={styles.detailValue}>{patient.height} cm</Text>
            </View>
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <View style={styles.historyContainer}>
            {patient.medicalHistory.map((condition, index) => (
              <View key={index} style={styles.historyItem}>
                <FaNotesMedical size={16} color="#e74c3c" />
                <Text style={styles.historyText}>{condition}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {patient.upcomingAppointments.map((appointment, index) => (
            <View key={index} style={styles.appointmentItem}>
              <FaCalendarAlt size={16} color="#3498db" />
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentDate}>{appointment.date}</Text>
                <Text style={styles.appointmentType}>{appointment.type}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/screens/AddCheckupScreen')}
          >
            <Text style={styles.actionButtonText}>Add Checkup</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push('/screens/RiskAssessmentScreen')}
          >
            <Text style={styles.actionButtonText}>Risk Assessment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    backgroundColor: '#3498db',
    paddingVertical: 20,
    alignItems: 'center',
  },
  patientIconContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
  },
  patientName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  riskBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  riskBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    padding: 10,
  },
  detailLabel: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  detailValue: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    flexDirection: 'column',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#e8f4f8',
    padding: 10,
    borderRadius: 5,
  },
  appointmentDetails: {
    marginLeft: 10,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  appointmentType: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
