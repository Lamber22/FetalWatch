import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

interface Patient {
  id: number;
  name: string;
  age: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  lastVisit: string;
  nextVisit: string;
}

const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    age: 28,
    riskLevel: 'High',
    lastVisit: '2024-03-15',
    nextVisit: '2024-03-20',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    age: 32,
    riskLevel: 'Medium',
    lastVisit: '2024-03-10',
    nextVisit: '2024-03-21',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    age: 25,
    riskLevel: 'Low',
    lastVisit: '2024-03-12',
    nextVisit: '2024-03-22',
  },
];

export default function PatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' || patient.riskLevel.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const renderPatientCard = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => router.push({
        pathname: '/patients/[id]',
        params: { id: item.id }
      })}
    >
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientAge}>Age: {item.age}</Text>
        <Text style={styles.patientVisit}>
          Next Visit: {item.nextVisit}
        </Text>
      </View>
      <View
        style={[
          styles.riskBadge,
          {
            backgroundColor:
              item.riskLevel === 'High'
                ? COLORS.error
                : item.riskLevel === 'Medium'
                ? COLORS.warning
                : COLORS.success,
          },
        ]}
      >
        <Text style={styles.riskText}>{item.riskLevel}</Text>
      </View>
    </TouchableOpacity>
  );

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

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

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
}); 