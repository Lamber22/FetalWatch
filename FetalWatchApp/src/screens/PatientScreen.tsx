// src/screens/PatientScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import {
  Appbar,
  Searchbar,
  Chip,
  Surface,
  List,
  Avatar,
  Badge,
  IconButton,
  useTheme,
  Text,
  ActivityIndicator,
  Menu,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getPatients, getPatientById } from '../slices/patientSlice';
import { fetchPregnancies, fetchPregnancyById } from '../slices/PregnancySlice';
import { RootState, store } from '../store/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNav from '../components/BottomNav';
import { globalStyles } from '../theme';

type PatientScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PatientScreen'>;

interface Props {
  navigation: PatientScreenNavigationProp;
}

const PatientScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch<typeof store.dispatch>();
  const { patients, loading, error } = useSelector((state: RootState) => state.patients);
  const { pregnancies } = useSelector((state: RootState) => state.pregnancies);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getPatients());
    dispatch(fetchPregnancies());
  }, [dispatch]);

  const filters = [
    { id: 'all', label: 'All Patients' },
    { id: 'high-risk', label: 'High Risk' },
    { id: 'due-soon', label: 'Due Soon' },
    { id: 'recent', label: 'Recent Visits' },
  ];

  const handlePatientPress = (patientId: string) => {
    dispatch(getPatientById(patientId)).then(() => {
      dispatch(fetchPregnancyById(patientId)).then(() => {
        navigation.navigate('PatientDetail', { id: patientId });
      });
    });
  };

  const handleAddNewPatient = () => {
    navigation.navigate('AddPatient');
  };

  const openMenu = (patientId: string) => {
    setSelectedPatientId(patientId);
    setMenuVisible(true);
  };

  const filteredPatients = patients?.filter(patient => {
    // Filter by search term
    const matchesSearch = 
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Get patient pregnancies
    const patientPregnancies = pregnancies?.filter(p => p.patientId === patient._id) || [];
    const hasHighRiskPregnancy = patientPregnancies.some(p => p.isHighRisk);
    
    // Filter by category
    switch (selectedFilter) {
      case 'high-risk':
        return hasHighRiskPregnancy;
      case 'due-soon':
        return patientPregnancies.some(p => 
          p.dueDate && new Date(p.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        );
      case 'recent':
        return patient.lastVisit && new Date(patient.lastVisit) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  });

  const renderPatientCard = ({ item: patient }) => {
    // Get patient pregnancies
    const patientPregnancies = pregnancies?.filter(p => p.patientId === patient._id) || [];
    const hasHighRiskPregnancy = patientPregnancies.some(p => p.isHighRisk);
    
    return (
      <Surface style={[globalStyles.surface, styles.patientCard]}>
        <List.Item
          title={`${patient.firstName} ${patient.lastName}`}
          description={() => (
            <View>
              <Text variant="bodyMedium">Age: {patient.age || 'N/A'}</Text>
              {patientPregnancies.length > 0 && (
                <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                  Pregnancies: {patientPregnancies.length}
                </Text>
              )}
            </View>
          )}
          left={props => (
            <Avatar.Text
              {...props}
              label={`${patient.firstName?.[0] || ''}${patient.lastName?.[0] || ''}`}
              size={40}
            />
          )}
          right={props => (
            <View style={styles.rightContent}>
              {hasHighRiskPregnancy && (
                <Badge style={{ backgroundColor: theme.colors.error, color: 'white' }}>
                  High Risk
                </Badge>
              )}
              <IconButton
                icon="dots-vertical"
                onPress={() => openMenu(patient._id)}
              />
            </View>
          )}
          onPress={() => handlePatientPress(patient._id)}
        />
      </Surface>
    );
  };

  return (
    <View style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.Content title="Patients" subtitle={`${patients?.length || 0} total`} />
        <Appbar.Action icon="plus" onPress={handleAddNewPatient} />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search patients"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {filters.map(filter => (
            <Chip
              key={filter.id}
              selected={selectedFilter === filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={styles.filterChip}
            >
              {filter.label}
            </Chip>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : error ? (
          <Surface style={styles.errorContainer}>
            <Text variant="bodyLarge" style={styles.errorText}>{error}</Text>
            <IconButton icon="refresh" onPress={() => dispatch(getPatients())} />
          </Surface>
        ) : (
          <FlatList
            data={filteredPatients}
            renderItem={renderPatientCard}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
      >
        <Menu.Item
          leadingIcon="eye"
          onPress={() => {
            setMenuVisible(false);
            if (selectedPatientId) handlePatientPress(selectedPatientId);
          }}
          title="View Details"
        />
        <Menu.Item
          leadingIcon="baby"
          onPress={() => {
            setMenuVisible(false);
            if (selectedPatientId) navigation.navigate('AddPregnancyDetails', { patientId: selectedPatientId });
          }}
          title="Add Pregnancy Details"
        />
        <Menu.Item
          leadingIcon="pencil"
          onPress={() => {
            setMenuVisible(false);
            // Handle edit action when implemented
          }}
          title="Edit Patient"
        />
      </Menu>

      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  searchbar: {
    marginBottom: 8,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  patientCard: {
    marginBottom: 8,
    elevation: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: 8,
  },
  list: {
    paddingBottom: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default PatientScreen;
