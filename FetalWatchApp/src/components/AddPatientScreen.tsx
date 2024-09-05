import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity, ScrollView, TouchableHighlight } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const FloatingLabelInput = ({ label, value, onChange, onFocus, onBlur }: any) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.floatingLabelContainer}>
            <Text style={[styles.floatingLabel, isFocused || value ? styles.floatingLabelFocused : {}]}>
                {label}
            </Text>
            <TextInput
                style={[styles.input, isFocused || value ? styles.inputWithLabel : {}]}
                value={value}
                onChangeText={onChange}
                onFocus={() => {
                    setIsFocused(true);
                    if (onFocus) onFocus();
                }}
                onBlur={() => {
                    setIsFocused(false);
                    if (onBlur) onBlur();
                }}
                placeholderTextColor="#aaa"
            />
        </View>
    );
};

const AddPatientScreen = ({ navigation, route }: any) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [educationLevel, setEducationLevel] = useState('');
    const [occupation, setOccupation] = useState('');
    const [income, setIncome] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [chronicIllnesses, setChronicIllnesses] = useState('');
    const [allergies, setAllergies] = useState('');
    const [previousPregnancies, setPreviousPregnancies] = useState('');
    const [gravida, setGravida] = useState('');
    const [para, setPara] = useState('');
    const [abortions, setAbortions] = useState('');
    const [contraceptionHistory, setContraceptionHistory] = useState('');
    const [surgicalHistory, setSurgicalHistory] = useState('');
    const [currentMedications, setCurrentMedications] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setDateOfBirth(formattedDate);
            setAge(calculateAge(formattedDate).toString());
        }
    };

    const handleSubmit = () => {
        const newPatient = {
            firstName,
            lastName,
            dateOfBirth,
            age: parseInt(age),
            gender,
            address,
            contactInformation: {
                phone,
                email,
            },
            occupation,
            emergencyContact: {
                name: emergencyName,
                phone: emergencyPhone,
            },
            medicalHistory: {
                chronicIllnesses: chronicIllnesses.split(',').map(item => item.trim()),
                allergies: allergies.split(',').map(item => item.trim()),
                previousPregnancies: {
                    number: parseInt(previousPregnancies),
                    outcomes: [], // Adjust based on how you collect these values
                    complications: [], // Adjust based on how you collect these values
                },
                obstetricHistory: {
                    gravida: parseInt(gravida),
                    para: parseInt(para),
                    abortions: parseInt(abortions),
                },
                contraceptionHistory,
                surgicalHistory: surgicalHistory.split(',').map(item => item.trim()),
                currentMedications: currentMedications.split(',').map(item => item.trim()),
            },
        };

        route.params.onSubmit(newPatient);
        navigation.navigate('PregnancyDetails', { patient: newPatient });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Patient</Text>
            <FloatingLabelInput
                label="First Name"
                value={firstName}
                onChange={setFirstName}
            />
            <FloatingLabelInput
                label="Last Name"
                value={lastName}
                onChange={setLastName}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <FloatingLabelInput
                    label="Date of Birth (YYYY-MM-DD)"
                    value={dateOfBirth}
                    onChange={() => {}}
                    onFocus={() => setShowDatePicker(true)}
                />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <FloatingLabelInput
                label="Age"
                value={age}
                onChange={setAge}
                keyboardType="numeric"
            />

            {/* Gender Dropdown */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Other" value="other" />
                </Picker>
            </View>

            <FloatingLabelInput
                label="Address"
                value={address}
                onChange={setAddress}
            />
            <FloatingLabelInput
                label="Phone Number"
                value={phone}
                onChange={setPhone}
                keyboardType="phone-pad"
            />
            <FloatingLabelInput
                label="Email (optional)"
                value={email}
                onChange={setEmail}
                keyboardType="email-address"
            />
            <FloatingLabelInput
                label="educationLevel"
                value={educationLevel}
                onChange={setEducationLevel}
            />
            <FloatingLabelInput
                label="occupation"
                value={occupation}
                onChange={setOccupation}
            />
            <FloatingLabelInput
                label="income"
                value={income}
                onChange={setIncome}
            />
            <FloatingLabelInput
                label="Emergency Contact Name"
                value={emergencyName}
                onChange={setEmergencyName}
            />
            <FloatingLabelInput
                label="Emergency Contact Phone"
                value={emergencyPhone}
                onChange={setEmergencyPhone}
                keyboardType="phone-pad"
            />

            {/* Medical History */}
            <Text style={styles.subtitle}>Medical History</Text>
            <FloatingLabelInput
                label="Chronic Illnesses (comma separated)"
                value={chronicIllnesses}
                onChange={setChronicIllnesses}
            />
            <FloatingLabelInput
                label="Allergies (comma separated)"
                value={allergies}
                onChange={setAllergies}
            />
            <FloatingLabelInput
                label="Number of Previous Pregnancies"
                value={previousPregnancies}
                onChange={setPreviousPregnancies}
                keyboardType="numeric"
            />
            <FloatingLabelInput
                label="Gravida"
                value={gravida}
                onChange={setGravida}
                keyboardType="numeric"
            />
            <FloatingLabelInput
                label="Para"
                value={para}
                onChange={setPara}
                keyboardType="numeric"
            />
            <FloatingLabelInput
                label="Abortions"
                value={abortions}
                onChange={setAbortions}
                keyboardType="numeric"
            />
            <FloatingLabelInput
                label="Contraception History"
                value={contraceptionHistory}
                onChange={setContraceptionHistory}
            />
            <FloatingLabelInput
                label="Surgical History (comma separated)"
                value={surgicalHistory}
                onChange={setSurgicalHistory}
            />
            <FloatingLabelInput
                label="Current Medications (comma separated)"
                value={currentMedications}
                onChange={setCurrentMedications}
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
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
        textAlign: 'center',
    },
    floatingLabelContainer: {
        marginBottom: 15,
        position: 'relative',
    },
    floatingLabel: {
        position: 'absolute',
        left: 10,
        top: 10,
        fontSize: 16,
        color: '#aaa',
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 4,
        zIndex: 1,
    },
    floatingLabelFocused: {
        fontSize: 12,
        top: -4,
        color: '#d368e4',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    inputWithLabel: {
        marginTop: 20,
    },
    pickerContainer: {
        marginBottom: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
    },
    picker: {
        height: 40,
        width: '100%',
    },
    datePickerButton: {
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: '#d368e4',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddPatientScreen;
