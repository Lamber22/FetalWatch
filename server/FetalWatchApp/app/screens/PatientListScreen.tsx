import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FaSearch, FaUserMd } from 'react-icons/fa';

// Mock patient data
const patients = [
  { 
    id: '1', 
    name: 'Maria Silva', 
    age: 28, 
    gestationalWeek: 24, 
    riskLevel: 'High',
    lastCheckup: '2 days ago'
  },
  { 
    id: '2', 
    name: 'Ana Santos', 
    age: 32, 
    gestationalWeek: 18, 
    riskLevel: 'Medium',
    lastCheckup: '5 days ago'
  },
  { 
    id: '3', 
    name: 'Lucia Oliveira', 
    age: 25, 
    gestationalWeek: 12, 
    riskLevel: 'Low',
    lastCheckup: '1 week ago'
  },
];

export default function PatientListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'High': return '#ff6b6b';
      case 'Medium': return '#feca57';
      case 'Low': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.patientCard}
      onPress={() => router.push(`/screens/PatientDetailScreen?id=${item.id}`)}
    >
      <View style={styles.patientCardContent}>
        <View style={styles.patientIcon}>
          <FaUserMd size={24} color="#3498db" />
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientDetails}>
            Age: {item.age} | Week: {item.gestationalWeek}
          </Text>
        </View>
        <View 
          style={[
            styles.riskBadge, 
            { backgroundColor: getRiskColor(item.riskLevel) }
          ]}
        >
          <Text style={styles.riskBadgeText}>{item.riskLevel}</Text>
        </View>
      </View>
      <Text style={styles.lastCheckupText}>
        Last Checkup: {item.lastCheckup}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Patients</Text>
      </View>

      <View style={styles.searchContainer}>
        <FaSearch size={20} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#a9a9a9"
        />
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No patients found</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity 
        style={styles.addPatientButton}
        onPress={() => router.push('/screens/AddPatientScreen')}
      >
        <Text style={styles.addPatientButtonText}>+ Add Patient</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  patientCard: {
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
  patientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientIcon: {
    backgroundColor: '#e8f4f8',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  patientDetails: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  riskBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lastCheckupText: {
    color: '#7f8c8d',
    fontSize: 12,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  addPatientButton: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addPatientButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
