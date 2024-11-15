import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNav from '../components/ButtomNav';
import { useDispatch, useSelector } from 'react-redux';
import { getPatients, createPatient, getPatientById } from '../slices/patientSlice';
import Patient from '../slices/patientSlice';
import { RootState, store } from '../store/store';
import { fetchPatientsAfterAdd } from '../slices/homeSlice';
import { fetchPregnancyById, createPregnancy } from '../slices/PregnancySlice';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
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
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>FetalWatch</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.header}>Manage Patients</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search patient"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddNewPatient}>
                <Text style={styles.addButtonText}>Add new patient</Text>
            </TouchableOpacity>

            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>Error: {error}</Text>
            ) : (
                <FlatList
                    data={patients.data}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.patientName}>{`${item.firstName} ${item.lastName}`}</Text>
                            {/* <Image
                                source={{ uri: item.imageUri }}
                                style={styles.patientImage}
                            /> */}
                            <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() => handleViewDetails(item._id)}
                            >
                                <Text style={styles.detailsButtonText}>View details</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
            <View style={styles.analyticsContainer}>
                <Text style={styles.header}>Analytics</Text>
                <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>Total Patients:</Text>
                    <Text style={styles.analyticsValue}>500</Text>
                </View>
                <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>Active Patients:</Text>
                    <Text style={styles.analyticsValue}>400</Text>
                </View>
                <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>Expected to Deliver Today:</Text>
                    <Text style={styles.analyticsValue}>20</Text>
                </View>
                <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>Expected Delivery This Month:</Text>
                    <Text style={styles.analyticsValue}>200</Text>
                </View>
                <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>Expected Delivery Next Month:</Text>
                    <Text style={styles.analyticsValue}>180</Text>
                </View>
            </View>
            <BottomNav navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#d368e4',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8d3f7',
        borderRadius: 8,
        marginBottom: 10,
    },
    patientName: {
        flex: 1,
        fontSize: 16,
    },
    detailsButton: {
        backgroundColor: '#d368e4',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    detailsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    analyticsContainer: {
        marginTop: 10,
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    analyticsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    analyticsLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    analyticsValue: {
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    patientImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
});

export default HomeScreen;
