import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

interface Patient {
    _id: string;
    name: string;
    age: number;
    gestationalAge: string;
    expectedDeliveryDate: string;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const dummyPatients: Patient[] = [
            {
                _id: '1',
                name: 'Mary Kollie',
                age: 30,
                gestationalAge: '32 weeks',
                expectedDeliveryDate: '2024-03-15',
            },
            {
                _id: '2',
                name: 'Faith Dolo',
                age: 28,
                gestationalAge: '36 weeks',
                expectedDeliveryDate: '2024-02-20',
            },
        ];
        setPatients(dummyPatients);
    }, []);

    const handleAddNewPatient = () => {
        navigation.navigate('AddPatient', {
            onSubmit: (newPatient: Patient) => {
                setPatients([...patients, newPatient]);
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FetalWatch</Text>

            <View style={styles.headerContainer}>
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
            </View>

            <FlatList
                data={patients}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.patientName}>{item.name}</Text>
                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => navigation.navigate('Patient', { id: item._id })}
                        >
                            <Text style={styles.detailsButtonText}>View details</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <View style={styles.analyticsContainer}>
                <Text style={styles.analyticsText}>Total Patient: 500</Text>
                <Text style={styles.analyticsText}>Active patients: 400</Text>
                <Text style={styles.analyticsText}>Expected to Deliver today: 20</Text>
                <Text style={styles.analyticsText}>Expected this month: 200</Text>
                <Text style={styles.analyticsText}>Expected to next month: 180</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 10,
    },
    headerContainer: {
        marginBottom: 20,
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
    analyticsText: {
        fontSize: 20,
        marginBottom: 5,
    },
});

export default HomeScreen;
