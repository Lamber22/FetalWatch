import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Surface,
  HelperText,
  useTheme,
  Snackbar,
  Portal,
  Dialog,
  Divider,
  Text,
  RadioButton,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { createPatient } from '../slices/patientSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { globalStyles } from '../theme';

type AddPatientScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPatient'>;

interface Props {
  navigation: AddPatientScreenNavigationProp;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
}

const AddPatientScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    phoneNumber: '',
    address: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData({
        ...formData,
        dateOfBirth: formattedDate,
        age: calculateAge(formattedDate),
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setConfirmDialogVisible(true);
    } else {
      setSnackbarMessage('Please fix the errors in the form');
      setSnackbarVisible(true);
    }
  };

  const confirmSubmit = async () => {
    setConfirmDialogVisible(false);
    setLoading(true);

    try {
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
      };
      const result = await dispatch(createPatient(patientData)).unwrap();
      setSnackbarMessage('Patient added successfully');
      setSnackbarVisible(true);
      setTimeout(() => {
        navigation.navigate('PatientDetail', { id: result._id });
      }, 1000);
    } catch (error) {
      setSnackbarMessage('Failed to add patient. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add New Patient" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Surface style={styles.formContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Personal Information</Text>

          <TextInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            error={!!errors.firstName}
            style={styles.input}
            mode="outlined"
          />
          <HelperText type="error" visible={!!errors.firstName}>
            {errors.firstName}
          </HelperText>

          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            error={!!errors.lastName}
            style={styles.input}
            mode="outlined"
          />
          <HelperText type="error" visible={!!errors.lastName}>
            {errors.lastName}
          </HelperText>

          <TextInput
            label="Date of Birth"
            value={formData.dateOfBirth}
            error={!!errors.dateOfBirth}
            style={styles.input}
            mode="outlined"
            right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
            showSoftInputOnFocus={false}
            onPressIn={() => setShowDatePicker(true)}
          />
          <HelperText type="error" visible={!!errors.dateOfBirth}>
            {errors.dateOfBirth}
          </HelperText>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            label="Age"
            value={formData.age}
            editable={false}
            style={styles.input}
            mode="outlined"
          />

          <Text variant="bodyMedium" style={styles.radioLabel}>Gender</Text>
          <RadioButton.Group
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
          >
            <View style={styles.radioRow}>
              <View style={styles.radioItem}>
                <RadioButton value="female" />
                <Text>Female</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="male" />
                <Text>Male</Text>
              </View>
              {/*<View style={styles.radioItem}>
                <RadioButton value="other" />
                <Text>Other</Text>
              </View>*/}
            </View>
          </RadioButton.Group>
          <HelperText type="error" visible={!!errors.gender}>
            {errors.gender}
          </HelperText>

          <Divider style={styles.divider} />
          <Text variant="titleMedium" style={styles.sectionTitle}>Contact Information</Text>

          <TextInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            error={!!errors.phoneNumber}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          <HelperText type="error" visible={!!errors.phoneNumber}>
            {errors.phoneNumber}
          </HelperText>

          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            error={!!errors.address}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
          <HelperText type="error" visible={!!errors.address}>
            {errors.address}
          </HelperText>
        </Surface>
      </ScrollView>

      <Surface style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          Add Patient
        </Button>
      </Surface>

      <Portal>
        <Dialog visible={confirmDialogVisible} onDismiss={() => setConfirmDialogVisible(false)}>
          <Dialog.Title>
            Confirm New Patient
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to add this patient?</Text>
            <Text variant="bodyMedium" style={styles.summaryText}>
              {`Name: ${formData.firstName} ${formData.lastName}\n`}
              {`Date of Birth: ${formData.dateOfBirth}\n`}
              {`Age: ${formData.age}\n`}
              {`Gender: ${formData.gender}\n`}
              {`Phone: ${formData.phoneNumber}`}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmSubmit} mode="contained">Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  radioLabel: {
    marginTop: 8,
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  divider: {
    marginVertical: 16,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  submitButton: {
    marginTop: 8,
  },
  summaryText: {
    marginTop: 16,
    lineHeight: 20,
  },
});

export default AddPatientScreen;

