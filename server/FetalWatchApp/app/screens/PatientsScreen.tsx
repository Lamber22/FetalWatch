import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FaUserInjured, 
  FaSearch, 
  FaUserPlus, 
  FaFilter 
} from 'react-icons/fa';

// Mock patient data
const initialPatients = [
  {
    id: '1',
    name: 'Maria Silva',
    age: 28,
    pregnancyWeek: 24,
    riskLevel: 'Low',
    lastCheckup: '2025-04-15'
  },
  {
    id: '2',
    name: 'Ana Santos',
    age: 35,
    pregnancyWeek: 32,
    riskLevel: 'High',
    lastCheckup: '2025-04-20'
  },
  {
    id: '3',
    name: 'Lucia Oliveira',
    age: 30,
    pregnancyWeek: 16,
    riskLevel: 'Medium',
    lastCheckup: '2025-04-10'
  }
];

export default function PatientsScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState(initialPatients);
  const [searchQuery, setSearchQuery] = useState('');

  const filterPatients = (query: string) => {
    const filteredPatients = initialPatients.filter(patient => 
      patient.name.toLowerCase().includes(query.toLowerCase())
    );
    setPatients(filteredPatients);
  };

  const navigateToPatientDetail = (patientId: string) => {
    router.push(`/screens/PatientDetailScreen?id=${patientId}`);
  };

  const navigateToAddPatient = () => {
    router.push('/screens/AddPatientScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Patients</Text>
        <TouchableOpacity 
          style={styles.addPatientButton}
          onPress={navigateToAddPatient}
        >
          <FaUserPlus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FaSearch size={16} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              filterPatients(text);
            }}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <FaFilter size={16} color="#3498db" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.patientsListContainer}>
        {patients.map((patient) => (
          <TouchableOpacity 
            key={patient.id} 
            style={styles.patientCard}
            onPress={() => navigateToPatientDetail(patient.id)}
          >
            <View style={styles.patientCardIcon}>
              <FaUserInjured size={30} color="#3498db" />
            </View>
            <View style={styles.patientCardDetails}>
              <Text style={styles.patientName}>{patient.name}</Text>
              <View style={styles.patientInfoRow}>
                <Text style={styles.patientInfoText}>Age: {patient.age}</Text>
                <Text style={styles.patientInfoText}>Week: {patient.pregnancyWeek}</Text>
                <Text style={[
                  styles.patientRiskLevel, 
                  patient.riskLevel === 'Low' && styles.lowRisk,
                  patient.riskLevel === 'Medium' && styles.mediumRisk,
                  patient.riskLevel === 'High' && styles.highRisk
                ]}>
                  {patient.riskLevel}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addPatientButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  filterButton: {
    marginLeft: 10,
    padding: 10,
  },
  patientsListContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientCardIcon: {
    marginRight: 15,
  },
  patientCardDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  patientInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientInfoText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  patientRiskLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  lowRisk: {
    backgroundColor: '#2ecc71',
    color: 'white',
  },
  mediumRisk: {
    backgroundColor: '#f39c12',
    color: 'white',
  },
  highRisk: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
});
