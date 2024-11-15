import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientById } from '../slices/patientSlice';
import { useRoute } from '@react-navigation/native';
import { fetchPregnanciesByPatientId } from '../slices/PregnancySlice';

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const PatientDetailScreen = () => {
    const route = useRoute();
    const { id } = route.params;
    const dispatch = useDispatch();
    const { patient, loading, error } = useSelector((state: RootState) => state.patients);
    const { pregnancies } = useSelector((state: RootState) => state.pregnancies);

    useEffect(() => {
        if (id) {
            dispatch<any>(getPatientById(id)).then(() => {
                return dispatch<any>(fetchPregnanciesByPatientId(id));
            });
        }
    }, [dispatch, id]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>{error}</Text>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Patient Details</Text>
            {patient && (
                <View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <Text style={styles.label}>Name: <Text style={styles.value}>{patient.firstName || 'N/A'} {patient.lastName || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Date of Birth: <Text style={styles.value}>{patient.dateOfBirth ? formatDate(patient.dateOfBirth) : 'N/A'}</Text></Text>
                        <Text style={styles.label}>Age: <Text style={styles.value}>{patient.age || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Gender: <Text style={styles.value}>{patient.gender || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Address: <Text style={styles.value}>{patient.address || 'N/A'}</Text></Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                        <Text style={styles.label}>Phone: <Text style={styles.value}>{patient.contactInformation?.phone || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Email: <Text style={styles.value}>{patient.contactInformation?.email || 'N/A'}</Text></Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Emergency Contact</Text>
                        <Text style={styles.label}>Name: <Text style={styles.value}>{patient.emergencyContact?.name || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Phone: <Text style={styles.value}>{patient.emergencyContact?.phone || 'N/A'}</Text></Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Medical History</Text>
                        <Text style={styles.label}>Previous Pregnancies:</Text>
                        <Text style={styles.subLabel}>Number: <Text style={styles.value}>{patient.medicalHistory?.previousPregnancies?.number || 'N/A'}</Text></Text>
                        <Text style={styles.subLabel}>Outcomes: <Text style={styles.value}>{patient.medicalHistory?.previousPregnancies?.outcomes || 'N/A'}</Text></Text>
                        <Text style={styles.subLabel}>Complications: <Text style={styles.value}>{patient.medicalHistory?.previousPregnancies?.complications || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Obstetric History:</Text>
                        <Text style={styles.subLabel}>Gravida: <Text style={styles.value}>{patient.medicalHistory?.obstetricHistory?.gravida || 'N/A'}</Text></Text>
                        <Text style={styles.subLabel}>Para: <Text style={styles.value}>{patient.medicalHistory?.obstetricHistory?.para || 'N/A'}</Text></Text>
                        <Text style={styles.subLabel}>Abortions: <Text style={styles.value}>{patient.medicalHistory?.obstetricHistory?.abortions || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Chronic Illnesses: <Text style={styles.value}>{patient.medicalHistory?.chronicIllnesses || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Allergies: <Text style={styles.value}>{patient.medicalHistory?.allergies || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Contraception History: <Text style={styles.value}>{patient.medicalHistory?.contraceptionHistory || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Surgical History: <Text style={styles.value}>{patient.medicalHistory?.surgicalHistory || 'N/A'}</Text></Text>
                        <Text style={styles.label}>Current Medications: <Text style={styles.value}>{patient.medicalHistory?.currentMedications || 'N/A'}</Text></Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pregnancy Details</Text>
                        {pregnancies.map(pregnancy => (
                            <View key={pregnancy._id} style={styles.pregnancyDetails}>
                                <Text style={styles.label}>Pregnancy ID: <Text style={styles.value}>{pregnancy._id}</Text></Text>
                                <Text style={styles.label}>Gestational Age: <Text style={styles.value}>{pregnancy.gestationalAge}</Text></Text>
                                <Text style={styles.label}>Expected Delivery Date: <Text style={styles.value}>{pregnancy.expectedDeliveryDate}</Text></Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subLabel: {
        fontSize: 14,
        marginLeft: 10,
        marginBottom: 5,
    },
    value: {
        fontWeight: 'normal',
    },
    pregnancyDetails: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    }
});

export default PatientDetailScreen;
