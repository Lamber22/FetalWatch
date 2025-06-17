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
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { usePatients } from '../../contexts/PatientsContext';

interface AddPatientProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddPatient({ onSuccess, onCancel }: AddPatientProps) {
  const { createPatient, loading, error } = usePatients();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    contact: '',
    weekOfPregnancy: '',
    expectedDeliveryDate: '',
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

  const handleDeliveryDateChange = (event: any, selectedDate?: Date) => {
    setShowDeliveryDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      setFormData({ ...formData, expectedDeliveryDate: formattedDate });
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
    if (formData.weekOfPregnancy && (isNaN(parseInt(formData.weekOfPregnancy, 10)) || parseInt(formData.weekOfPregnancy, 10) < 1 || parseInt(formData.weekOfPregnancy, 10) > 42)) {
      Alert.alert('Validation Error', 'Week of pregnancy must be between 1 and 42');
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

      if (formData.weekOfPregnancy && formData.weekOfPregnancy.trim() !== '') {
        const week = parseInt(formData.weekOfPregnancy, 10);
        if (!isNaN(week) && week >= 1 && week <= 42) {
          patientData.weekOfPregnancy = week;
        }
      }

      if (formData.expectedDeliveryDate && formData.expectedDeliveryDate.trim() !== '') {
        patientData.expectedDeliveryDate = formData.expectedDeliveryDate;
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

  const handleDeliveryDatePress = () => {
    if (Platform.OS === 'ios') {
      setShowDeliveryDatePicker(!showDeliveryDatePicker);
    } else {
      setShowDeliveryDatePicker(true);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date of Birth *</Text>
        <TouchableWithoutFeedback onPress={handleDateOfBirthPress}>
          <View style={[styles.input, showDatePicker && Platform.OS === 'ios' && styles.inputFocused]}>
            <Text style={formData.dateOfBirth ? styles.inputText : styles.placeholderText}>
              {formData.dateOfBirth || 'Select Date of Birth'}
            </Text>
            {Platform.OS === 'ios' && (
              <Text style={styles.iosPickerIcon}>
                {showDatePicker ? '▲' : '▼'}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
        {showDatePicker && (
          <View style={Platform.OS === 'ios' ? styles.iosDatePickerContainer : undefined}>
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
        <Text style={styles.ageText}>
          Age: {calculateAge(formData.dateOfBirth)} years old
        </Text>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Gender *</Text>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity style={styles.input} onPress={handleGenderSelection}>
            <Text style={formData.gender ? styles.inputText : styles.placeholderText}>
              {formData.gender || 'Select Gender'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.input}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(itemValue: any) => setFormData({ ...formData, gender: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Address *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Contact Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter contact number"
          value={formData.contact}
          onChangeText={(text) => setFormData({ ...formData, contact: text })}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: SIZES.medium }]}>
        Pregnancy Information
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Week of Pregnancy</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter week of pregnancy (1-42)"
          value={formData.weekOfPregnancy}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            setFormData({ ...formData, weekOfPregnancy: numericText });
          }}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Expected Delivery Date</Text>
        <TouchableWithoutFeedback onPress={handleDeliveryDatePress}>
          <View style={[styles.input, showDeliveryDatePicker && Platform.OS === 'ios' && styles.inputFocused]}>
            <Text style={formData.expectedDeliveryDate ? styles.inputText : styles.placeholderText}>
              {formData.expectedDeliveryDate || 'Select Expected Delivery Date'}
            </Text>
            {Platform.OS === 'ios' && (
              <Text style={styles.iosPickerIcon}>
                {showDeliveryDatePicker ? '▲' : '▼'}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
        {showDeliveryDatePicker && (
          <View style={Platform.OS === 'ios' ? styles.iosDatePickerContainer : undefined}>
            <DateTimePicker
              value={formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'compact' : 'default'}
              onChange={handleDeliveryDateChange}
              minimumDate={new Date()}
              style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
            />
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton, loading && styles.disabledButton]}
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
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  inputGroup: {
    marginBottom: SIZES.medium,
  },
  inputLabel: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    fontSize: SIZES.font,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.gray,
    marginLeft: 'auto',
  },
  iosDatePickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginTop: SIZES.small,
    padding: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  submitButtonText: {
    color: COLORS.white,
  },
  placeholderText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  ageText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: -SIZES.small,
    marginBottom: SIZES.medium,
    marginLeft: SIZES.small,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
  },
  inputText: {
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  iosPicker: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginTop: SIZES.small,
  },
});
