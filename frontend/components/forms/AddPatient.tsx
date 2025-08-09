import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  ActionSheetIOS,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SIZES, SHADOWS, lightTheme, darkTheme } from '../constants/Theme';
import { useColorScheme } from '../../hooks/useColorScheme';
import { usePatients } from '../../contexts/PatientsContext';

interface AddPatientProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddPatient({ onSuccess, onCancel }: AddPatientProps) {
  const { createPatient, loading, error } = usePatients();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    contact: '',
    emergencyContact: {
      name: '',
      contactNumber: '',
      location: ''
    }
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      setFormData({ ...formData, dateOfBirth: formattedDate });
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime())) return 0;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : 0;
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter patient name');
      return false;
    }
    if (!formData.dateOfBirth) {
      Alert.alert('Validation Error', 'Please select date of birth');
      return false;
    }
    if (!formData.gender) {
      Alert.alert('Validation Error', 'Please select gender');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Validation Error', 'Please enter address');
      return false;
    }
    if (!formData.contact.trim()) {
      Alert.alert('Validation Error', 'Please enter contact number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const patientData: any = {
        name: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address.trim(),
        contact: formData.contact.trim(),
      };

      // Include emergency contact if any field is filled
      if (formData.emergencyContact.name.trim() || 
          formData.emergencyContact.contactNumber.trim() || 
          formData.emergencyContact.location.trim()) {
        patientData.emergencyContact = {
          name: formData.emergencyContact.name.trim(),
          contactNumber: formData.emergencyContact.contactNumber.trim(),
          location: formData.emergencyContact.location.trim()
        };
      }

      await createPatient(patientData);
      Alert.alert('Success', 'Patient added successfully');
      onSuccess?.();
    } catch (err: any) {
      console.error('Error creating patient:', err);
      let errorMessage = 'Failed to add patient';
      if (err?.message) {
        errorMessage = err.message;
      } else if (error) {
        errorMessage = error;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const handleGenderSelection = () => {
    if (Platform.OS === 'ios') {
      const options = ['Cancel', 'Female', 'Male', 'Other'];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 0,
          title: 'Select Gender'
        },
        (buttonIndex) => {
          if (buttonIndex !== 0) {
            setFormData({ ...formData, gender: options[buttonIndex] });
          }
        }
      );
    }
  };

  const handleDateOfBirthPress = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(!showDatePicker);
    } else {
      setShowDatePicker(true);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Personal Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Full Name *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
          placeholder="Enter full name"
          placeholderTextColor={theme.gray}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Date of Birth *</Text>
        <TouchableWithoutFeedback onPress={handleDateOfBirthPress}>
          <View style={[
            styles.input, 
            { backgroundColor: theme.white, borderColor: theme.border },
            showDatePicker && Platform.OS === 'ios' && styles.inputFocused
          ]}>
            <Text style={formData.dateOfBirth ? [styles.inputText, { color: theme.text }] : [styles.placeholderText, { color: theme.gray }]}>
              {formData.dateOfBirth || 'Select Date of Birth'}
            </Text>
            {Platform.OS === 'ios' && (
              <Text style={[styles.iosPickerIcon, { color: theme.gray }]}>
                {showDatePicker ? '▲' : '▼'}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
        {showDatePicker && (
          <View style={[
            Platform.OS === 'ios' ? styles.iosDatePickerContainer : undefined,
            { backgroundColor: theme.white, borderColor: theme.border }
          ]}>
            <DateTimePicker
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'compact' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
            />
          </View>
        )}
      </View>

      {formData.dateOfBirth ? (
        <Text style={[styles.ageText, { color: theme.gray }]}>
          Age: {calculateAge(formData.dateOfBirth)} years old
        </Text>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Gender *</Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border }]} onPress={handleGenderSelection}>
            <Text style={formData.gender ? [styles.inputText, { color: theme.text }] : [styles.placeholderText, { color: theme.gray }]}>
              {formData.gender || 'Select Gender'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border }]}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(itemValue: any) => setFormData({ ...formData, gender: itemValue })}
              style={[styles.picker, { color: theme.text, backgroundColor: theme.white }]}
              dropdownIconColor={theme.gray}
              mode="dropdown"
            >
              <Picker.Item label="Select Gender" value="" color={theme.text} />
              <Picker.Item label="Female" value="Female" color={theme.text} />
              <Picker.Item label="Male" value="Male" color={theme.text} />
              <Picker.Item label="Other" value="Other" color={theme.text} />
            </Picker>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Address *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
          placeholder="Enter address"
          placeholderTextColor={theme.gray}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Contact Number *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
          placeholder="Enter contact number"
          placeholderTextColor={theme.gray}
          value={formData.contact}
          onChangeText={(text) => setFormData({ ...formData, contact: text })}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: SIZES.large }]}>Emergency Contact</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Emergency Contact Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
          placeholder="Enter emergency contact name"
          placeholderTextColor={theme.gray}
          value={formData.emergencyContact.name}
          onChangeText={(text) => setFormData({ 
            ...formData, 
            emergencyContact: { ...formData.emergencyContact, name: text }
          })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Emergency Contact Number</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
          placeholder="Enter emergency contact number"
          placeholderTextColor={theme.gray}
          value={formData.emergencyContact.contactNumber}
          onChangeText={(text) => setFormData({ 
            ...formData, 
            emergencyContact: { ...formData.emergencyContact, contactNumber: text }
          })}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Emergency Contact Location</Text>
        <TextInput
          style={[styles.input, styles.multilineInput, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
          placeholder="Enter emergency contact location/address"
          placeholderTextColor={theme.gray}
          value={formData.emergencyContact.location}
          onChangeText={(text) => setFormData({ 
            ...formData, 
            emergencyContact: { ...formData.emergencyContact, location: text }
          })}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button, 
            styles.cancelButton,
            { backgroundColor: theme.white, borderColor: theme.gray }
          ]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button, 
            styles.submitButton, 
            { backgroundColor: theme.primary },
            loading && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.submitButtonText]}>
            {loading ? 'Adding...' : 'Add Patient'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 400,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: SIZES.medium,
  },
  inputGroup: {
    marginBottom: SIZES.medium,
  },
  inputLabel: {
    fontSize: SIZES.font,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  input: {
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    fontSize: SIZES.font,
    borderWidth: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  iosPickerIcon: {
    fontSize: SIZES.font,
    marginLeft: 'auto',
  },
  iosDatePickerContainer: {
    borderRadius: SIZES.base,
    marginTop: SIZES.small,
    padding: SIZES.small,
    borderWidth: 1,
    ...SHADOWS.light,
  },
  iosDatePicker: {
    height: 120,
    backgroundColor: 'transparent',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.medium,
    paddingBottom: SIZES.padding,
  },
  button: {
    flex: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    alignItems: 'center',
    marginHorizontal: SIZES.base,
    ...SHADOWS.light,
  },
  cancelButton: {
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: COLORS.white,
  },
  placeholderText: {
    fontSize: SIZES.font,
  },
  ageText: {
    fontSize: SIZES.small,
    marginTop: -SIZES.small,
    marginBottom: SIZES.medium,
    marginLeft: SIZES.small,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: -8, // Adjust for better alignment
  },
  disabledButton: {
    opacity: 0.6,
  },
  inputText: {
    fontSize: SIZES.font,
  },
  iosPicker: {
    borderRadius: SIZES.base,
    marginTop: SIZES.small,
  },
});
