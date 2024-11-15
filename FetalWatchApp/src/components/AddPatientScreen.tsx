import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Modal,
    Platform,
} from 'react-native';
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
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

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
        if (!firstName || !lastName || !dateOfBirth || !gender) {
            setErrorMessage('Please fill in all required fields.');
            setShowErrorModal(true);
            return;
        }

        const newPatient = {
            firstName,
            lastName,
            dateOfBirth,
            age: parseInt(age),
            gender,
        };

        if (route.params && route.params.onSubmit) {
            route.params.onSubmit(newPatient);
            navigation.navigate('PatientDetails', { patient: newPatient });
        } else {
            setErrorMessage('An error occurred while submitting the form.');
            setShowErrorModal(true);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: 20,
                }}
            >
                <Text style={styles.title}>Add New Patient</Text>

                <Modal
                    transparent={true}
                    visible={showErrorModal}
                    animationType="slide"
                    onRequestClose={() => setShowErrorModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{errorMessage}</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setShowErrorModal(false)}
                            >
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <FloatingLabelInput label="First Name" value={firstName} onChange={setFirstName} />
                <FloatingLabelInput label="Last Name" value={lastName} onChange={setLastName} />

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

                <FloatingLabelInput label="Age" value={age} onChange={setAge} keyboardType="numeric" />

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

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#d368e4',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default AddPatientScreen;
