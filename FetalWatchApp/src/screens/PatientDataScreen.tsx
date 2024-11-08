import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { fetchPregnancyById } from '../slices/PregnancySlice'; // Import fetchPregnancyById
import { useDispatch } from 'react-redux';

const PatientDataScreen = ({ route, navigation }: any) => {
    const { patient, newPregnancy: initialPregnancy } = route.params;
    const [newPregnancy, setNewPregnancy] = useState(initialPregnancy);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Fetch or update the newPregnancy data here if needed
            setNewPregnancy(route.params?.newPregnancy || newPregnancy);
            if (newPregnancy) {
                dispatch(fetchPregnancyById(newPregnancy._id)); // Fetch pregnancy details
            }
        });

        return unsubscribe;
    }, [navigation, route.params?.newPregnancy, newPregnancy, dispatch]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Patient Data</Text>

            {/* Display patient information */}
            <Text style={styles.subtitle}>Patient Information</Text>
            <Text style={styles.infoText}>Name: {patient.firstName} {patient.lastName}</Text>
            <Text style={styles.infoText}>Date of Birth: {patient.dateOfBirth}</Text>
            <Text style={styles.infoText}>Age: {patient.age}</Text>
            <Text style={styles.infoText}>Gender: {patient.gender}</Text>
            <Text style={styles.infoText}>Address: {patient.address}</Text>
            <Text style={styles.infoText}>Phone Number: {patient.contactInformation.phone}</Text>
            <Text style={styles.infoText}>Email: {patient.contactInformation.email}</Text>

            {/* Display pregnancy details if available */}
            {newPregnancy ? (
                <>
                    <Text style={styles.subtitle}>Pregnancy Information</Text>
                    <Text style={styles.infoText}>Gestational Age: {newPregnancy.gestationalAge} weeks</Text>
                    <Text style={styles.infoText}>Expected Delivery Date: {newPregnancy.expectedDeliveryDate.toDateString()}</Text>
                    <Text style={styles.infoText}>Number of Visits: {newPregnancy.prenatalCare.numberOfVisits}</Text>
                    <Text style={styles.infoText}>Adherence: {newPregnancy.prenatalCare.adherence ? 'Yes' : 'No'}</Text>
                    <Text style={styles.infoText}>Fetal Movement: {newPregnancy.fetalMovement ? 'Yes' : 'No'}</Text>
                    <Text style={styles.infoText}>Complications: {newPregnancy.complications.join(', ')}</Text>
                    <Text style={styles.infoText}>Weight: {newPregnancy.weight} kg</Text>
                    <Text style={styles.infoText}>Height: {newPregnancy.height} cm</Text>
                    <Text style={styles.infoText}>Immunization Status: {newPregnancy.immunizationStatus}</Text>
                    <Text style={styles.infoText}>Consent Form: {newPregnancy.consentForm ? 'Yes' : 'No'}</Text>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('FetalWatch', { pregnancyId: newPregnancy._id })}
                    >
                        <Text style={styles.addButtonText}>Connect Fetal Device</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddPregnancyDetails', { patient })}
                >
                    <Text style={styles.addButtonText}>Add Pregnancy Details</Text>
                </TouchableOpacity>
            )}
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
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '600',
        marginVertical: 10,  // Increased margin for better spacing
    },
    infoText: {
        fontSize: 15,
        marginVertical: 4,  // Added margin for better spacing
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
        fontSize: 20,  // Increased from 18
        fontWeight: 'bold',
    },
});

export default PatientDataScreen;
