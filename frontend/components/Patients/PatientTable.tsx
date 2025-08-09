import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { usePatient, PatientUtils } from '../../hooks/usePatient';
import { Patient } from '../../interface/iPatient';

export default function PatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const { allPatients, loadingAllPatients, loadAllPatients } = usePatient();

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      const result = await loadAllPatients();
      if (result === null) {
        setError('Failed to load patients. Please try again.');
      }
    };
    fetchData();
  }, [loadAllPatients]);

  const calculateAge = (dateOfBirth?: string) => {
    return PatientUtils.calculateAge(dateOfBirth) || 'N/A';
  };

  const getRiskLevel = (weekOfPregnancy?: number): 'High' | 'Medium' | 'Low' => {
    if (!weekOfPregnancy) return 'Medium';
    if (weekOfPregnancy < 20 || weekOfPregnancy > 35) return 'High';
    if (weekOfPregnancy < 24 || weekOfPregnancy > 32) return 'Medium';
    return 'Low';
  };

  const filteredPatients = allPatients.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const riskLevel = getRiskLevel(patient.weekOfPregnancy);
    const matchesFilter =
      selectedFilter === 'all' || riskLevel.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const renderPatientCard = ({ item }: { item: Patient }) => {
    const age = calculateAge(item.dateOfBirth);
    const riskLevel = getRiskLevel(item.weekOfPregnancy);
    const patientId = PatientUtils.getPatientId(item);

    return (
      <TouchableOpacity
        style={styles.patientCard}
        onPress={() => router.push(`/(app)/Patients/PatientDetails/${patientId}`)}
      >
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientAge}>Age: {age}</Text>
          <Text style={styles.patientVisit}>
            Week: {item.weekOfPregnancy || 'N/A'}
          </Text>
        </View>
        <View
          style={[
            styles.riskBadge,
            {
              backgroundColor:
                riskLevel === 'High'
                  ? COLORS.error
                  : riskLevel === 'Medium'
                  ? COLORS.warning
                  : COLORS.success,
            },
          ]}
        >
          <Text style={styles.riskText}>{riskLevel}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'all' && styles.filterButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'high' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('high')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'high' && styles.filterButtonTextActive,
            ]}
          >
            High Risk
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'medium' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('medium')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'medium' && styles.filterButtonTextActive,
            ]}
          >
            Medium Risk
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'low' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter('low')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'low' && styles.filterButtonTextActive,
            ]}
          >
            Low Risk
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading/Error/Patient List */}
      {loadingAllPatients ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={async () => {
              setError(null);
              const result = await loadAllPatients();
              if (result === null) {
                setError('Failed to load patients. Please try again.');
              }
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          renderItem={renderPatientCard}
          keyExtractor={(item) => PatientUtils.getPatientId(item) || item.name}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No patients found</Text>
            </View>
          }
        />
      )}

      {/* Add Patient Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/patients/add' as any)}
      >
        <Ionicons name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SIZES.medium,
    padding: SIZES.base,
    borderRadius: SIZES.base,
    ...SHADOWS.light,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.base,
    fontSize: SIZES.font,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  filterButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.base,
    marginRight: SIZES.base,
    backgroundColor: COLORS.lightGray,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.gray,
    fontSize: SIZES.small,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    padding: SIZES.medium,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    marginBottom: SIZES.base,
    borderRadius: SIZES.base,
    ...SHADOWS.light,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  patientAge: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: SIZES.base / 2,
  },
  patientVisit: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: SIZES.base / 2,
  },
  riskBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.base,
    marginLeft: SIZES.base,
  },
  riskText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: SIZES.medium,
    bottom: SIZES.medium,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    fontSize: SIZES.medium,
    color: COLORS.error,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.base,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});