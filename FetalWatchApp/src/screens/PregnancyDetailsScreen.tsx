import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const PregnancyDetailsScreen = ({ route, navigation }: any) => {
    const { patient } = route.params; // Retrieve patient data from route params

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Pregnancy Data</Text>

            {/* Display patient information */}
            <Text style={styles.subtitle}>Patient Information</Text>
            <Text>Name: {patient.firstName} {patient.lastName}</Text>
            <Text>Date of Birth: {patient.dateOfBirth}</Text>
            <Text>Age: {patient.age}</Text>
            <Text>Gender: {patient.gender}</Text>
            <Text>Address: {patient.address}</Text>
            <Text>Phone Number: {patient.contactInformation.phone}</Text>
            <Text>Email: {patient.contactInformation.email}</Text>

            {/* Display pregnancy details */}
            {/* Assuming `pregnancy` data might be included later */}
            {/* Add placeholder for now */}
            <Text style={styles.subtitle}>Pregnancy Information</Text>
            {/* You can add specific details here as needed */}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddPregnancyDetails', { patientId: patient._id })}
            >
                <Text style={styles.addButtonText}>Add Pregnancy Details</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
    },
    addButton: {
        backgroundColor: '#d368e4',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PregnancyDetailsScreen;
