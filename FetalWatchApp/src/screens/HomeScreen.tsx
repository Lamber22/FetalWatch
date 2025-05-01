import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { 
  Appbar, 
  Surface, 
  Card, 
  Title, 
  Paragraph, 
  Searchbar,
  List,
  Badge,
  IconButton,
  Avatar,
  useTheme,
  ActivityIndicator,
  Text
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNav from '../components/BottomNav';
import { useDispatch, useSelector } from 'react-redux';
import { getPatients, createPatient, getPatientById } from '../slices/patientSlice';
import Patient from '../slices/patientSlice';
import { RootState, store } from '../store/store';
import { fetchPatientsAfterAdd } from '../slices/homeSlice';
import { fetchPregnancyById } from '../slices/PregnancySlice';
import { globalStyles } from '../theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

const StatCard = ({ title, value, icon, trend }: { title: string; value: string | number; icon: string; trend?: number }) => {
  const theme = useTheme();
  return (
    <Card style={styles.statCard}>
      <Card.Content style={styles.statCardContent}>
        <IconButton icon={icon} size={24} iconColor={theme.colors.primary} />
        <Title style={styles.statTitle}>{title}</Title>
        <Paragraph style={styles.statValue}>{value}</Paragraph>
        {trend !== undefined && (
          <IconButton 
            icon={trend > 0 ? 'trending-up' : 'trending-down'} 
            size={20} 
            iconColor={trend > 0 ? theme.colors.secondary : theme.colors.error}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const theme = useTheme();
    const dispatch = useDispatch<typeof store.dispatch>();
    const { patients, loading, error } = useSelector((state: RootState) => state.patients);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getPatients());
    }, [dispatch]);

    // Debugging: Log the patients data to ensure it is being fetched correctly
    useEffect(() => {
        console.log(patients);
    }, [patients]);

    useEffect(() => {
        navigation.setOptions({
            onSubmit: (newPatient: Patient) => {
                dispatch(createPatient(newPatient)).then((action) => {
                    if (createPatient.fulfilled.match(action)) {
                        const patientId = action.payload._id;
                        navigation.navigate('FetalWatch', { patientId });
                    }
                    dispatch(fetchPatientsAfterAdd());
                });
            }
        });
    }, [navigation, dispatch]);

    const handleAddNewPatient = () => {
        navigation.navigate('AddPatient');
    };

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    const handleViewDetails = (patientId: string) => {
        dispatch(getPatientById(patientId)).then(() => {
            dispatch(fetchPregnancyById(patientId)).then(() => {
                navigation.navigate('PatientDetail', { id: patientId }); // Ensure correct navigation
            });
        });
    };

    return (
        <View style={globalStyles.container}>
            <Appbar.Header>
                <Appbar.Content title="FetalWatch" subtitle="Central Hospital" />
                <Appbar.Action icon="bell-outline" onPress={() => {}} />
                <Appbar.Action icon="logout" onPress={handleLogout} />
                <Avatar.Image size={40} source={require('../assets/logo.png')} />
            </Appbar.Header>

            <View style={styles.content}>
                <View style={globalStyles.statsGrid}>
                    <StatCard 
                        title="Total Patients" 
                        value={500} 
                        icon="account-group"
                        trend={5}
                    />
                    <StatCard 
                        title="Active Cases" 
                        value={400} 
                        icon="account-clock"
                        trend={2}
                    />
                    <StatCard 
                        title="Due Today" 
                        value={20} 
                        icon="calendar-today"
                    />
                    <StatCard 
                        title="High Risk" 
                        value={45} 
                        icon="alert-circle"
                        trend={-3}
                    />
                </View>

                <Title style={styles.sectionTitle}>Manage Patients</Title>

                <Searchbar
                    placeholder="Search patients"
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                    style={styles.searchbar}
                />

                <View style={styles.listContainer}>
                    {loading ? (
                        <Surface style={styles.loadingContainer}>
                            <ActivityIndicator animating={true} color={theme.colors.primary} />
                        </Surface>
                    ) : error ? (
                        <Surface style={styles.errorContainer}>
                            <Title>Error</Title>
                            <Paragraph>{error}</Paragraph>
                            <IconButton icon="refresh" onPress={() => dispatch(getPatients())} />
                        </Surface>
                    ) : (
                        <FlatList
                            data={patients.data}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Surface style={[globalStyles.surface, styles.patientCard]}>
                                    <List.Item
                                        title={`${item.firstName} ${item.lastName}`}
                                        description={`Age: ${item.age || 'N/A'}`}
                                        left={props => <Avatar.Icon {...props} icon="account" />}
                                        right={props => (
                                            <View style={styles.rightContent}>
                                                <Badge style={{ backgroundColor: theme.colors.error, color: 'white' }}>High Risk</Badge>
                                                <IconButton icon="chevron-right" onPress={() => handleViewDetails(item._id)} />
                                            </View>
                                        )}
                                        onPress={() => handleViewDetails(item._id)}
                                    />
                                </Surface>
                            )}
                        />
                    )}
                </View>

                <IconButton
                    icon="plus"
                    mode="contained"
                    size={24}
                    onPress={handleAddNewPatient}
                    style={styles.fab}
                />
            </View>
            
            <BottomNav navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    statCard: {
        flex: 1,
        margin: 4,
        minWidth: '45%',
    },
    statCardContent: {
        alignItems: 'center',
        padding: 8,
    },
    statTitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    searchbar: {
        marginVertical: 8,
        elevation: 2,
    },
    listContainer: {
        flex: 1,
        marginTop: 8,
    },
    patientCard: {
        elevation: 2,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingContainer: {
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
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

export default HomeScreen;
