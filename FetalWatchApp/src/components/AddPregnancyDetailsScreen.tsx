import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const AddPregnancyDetailsScreen = ({ route, navigation }: any) => {
    const { patientId } = route.params;

    const [gestationalAge, setGestationalAge] = useState('');
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
    const [numberOfVisits, setNumberOfVisits] = useState('');
    const [adherence, setAdherence] = useState(false);
    const [fetalMovement, setFetalMovement] = useState(false);
    const [complications, setComplications] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [immunizationStatus, setImmunizationStatus] = useState('');
    const [consentForm, setConsentForm] = useState(false);

    const handleSubmit = () => {
        const newPregnancy = {
            patientId,
            gestationalAge: parseInt(gestationalAge),
            expectedDeliveryDate: new Date(expectedDeliveryDate),
            prenatalCare: {
                numberOfVisits: parseInt(numberOfVisits),
                adherence
            },
            fetalMovement,
            complications: complications.split(',').map(item => item.trim()),
            weight: parseFloat(weight),
            height: parseFloat(height),
            immunizationStatus,
            socialDeterminantsOfHealth: {
            },
            consentForm
        };

        // Submit newPregnancy to your backend or state management here
        // ...

        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add Pregnancy Details</Text>
            <TextInput
                style={styles.input}
                placeholder="Gestational Age (weeks)"
                value={gestationalAge}
                onChangeText={setGestationalAge}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Expected Delivery Date (YYYY-MM-DD)"
                value={expectedDeliveryDate}
                onChangeText={setExpectedDeliveryDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Number of Prenatal Visits"
                value={numberOfVisits}
                onChangeText={setNumberOfVisits}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Adherence to Prenatal Care (true/false)"
                value={adherence.toString()}
                onChangeText={(text) => setAdherence(text.toLowerCase() === 'true')}
            />
            <TextInput
                style={styles.input}
                placeholder="Fetal Movement (true/false)"
                value={fetalMovement.toString()}
                onChangeText={(text) => setFetalMovement(text.toLowerCase() === 'true')}
            />
            <TextInput
                style={styles.input}
                placeholder="Complications (comma separated)"
                value={complications}
                onChangeText={setComplications}
            />
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Immunization Status"
                value={immunizationStatus}
                onChangeText={setImmunizationStatus}
            />
            <TextInput
                style={styles.input}
                placeholder="Consent Form (true/false)"
                value={consentForm.toString()}
                onChangeText={(text) => setConsentForm(text.toLowerCase() === 'true')}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
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
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#d368e4',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddPregnancyDetailsScreen;
