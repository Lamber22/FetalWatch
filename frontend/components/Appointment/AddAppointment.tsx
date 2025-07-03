import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { usePatients } from '../../contexts/PatientsContext';
import { useAppointmentContext } from '../../contexts/AppointmentContext';

interface AddAppointmentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  appointment?: any; // For editing existing appointment
  isEditing?: boolean;
}

export default function AddAppointmentScreen({ onSuccess, onCancel, appointment, isEditing }: AddAppointmentProps) {
  const { patients, fetchPatients, loading } = usePatients();
  const { state: appointmentState, actions: appointmentActions } = useAppointmentContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showAppointmentTypeDropdown, setShowAppointmentTypeDropdown] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    appointmentType: '',
    notes: '',
    doctor: '',
  });

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Pre-populate form when editing
  useEffect(() => {
    if (isEditing && appointment) {
      setFormData({
        patientId: appointment.patientId || appointment.patient?._id || '',
        patientName: appointment.patientName || appointment.patient?.name || '',
        date: appointment.date || '',
        time: appointment.time || '',
        appointmentType: appointment.appointmentType || '',
        notes: appointment.notes || '',
        doctor: appointment.doctor || '',
      });
      
      // Set patient search and selected patient for editing
      const patientName = appointment.patientName || appointment.patient?.name || '';
      setPatientSearch(patientName);
      
      // Find and set the selected patient if available
      if (appointment.patientId || appointment.patient?._id) {
        const patient = patients.find(p => 
          p._id === (appointment.patientId || appointment.patient?._id)
        );
        if (patient) {
          setSelectedPatient(patient);
        }
      }
    }
  }, [isEditing, appointment, patients]);

  // Appointment types matching the database enum
  const appointmentTypes = [
    'Routine Checkup',
    'Ultrasound',
    'Blood Test',
    'Consultation',
    'Follow-up',
    'Emergency',
    'Prenatal Care',
    'Postnatal Care',
    'Vaccination',
    'Other'
  ];

  const filteredPatients = patients
    .filter(patient => patient.name && patient.name.toLowerCase().includes(patientSearch.toLowerCase()))
    .sort((a, b) => {
      // Sort by creation date (newest first) - assuming _id contains timestamp or use a createdAt field
      if (a._id && b._id) {
        return b._id.localeCompare(a._id);
      }
      return 0;
    });

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setFormData({ 
      ...formData, 
      patientId: patient._id,
      patientName: patient.name 
    });
    setPatientSearch(patient.name);
    setShowPatientDropdown(false);
  };

  const handlePatientSearchChange = (text: string) => {
    setPatientSearch(text);
    setShowPatientDropdown(true); // Always show dropdown when typing
    if (text === '') {
      setSelectedPatient(null);
      setFormData({ ...formData, patientId: '', patientName: '' });
    }
  };

  const handlePatientInputFocus = () => {
    setShowPatientDropdown(true);
    if (patientSearch === '') {
      // Show all patients when focused with empty search
    }
  };

  const handleAppointmentTypeSelect = (type: string) => {
    setFormData({ ...formData, appointmentType: type });
    setShowAppointmentTypeDropdown(false);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().split(' ')[0].substring(0, 5);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      setFormData({ ...formData, date: formattedDate });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = formatTime(selectedTime);
      setFormData({ ...formData, time: formattedTime });
    }
  };

  const handleDatePress = () => {
    if (Platform.OS === 'web') {
      // Web platform doesn't need to show/hide picker, HTML input handles it
      return;
    } else if (Platform.OS === 'ios') {
      setShowDatePicker(!showDatePicker);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleTimePress = () => {
    if (Platform.OS === 'web') {
      // Web platform doesn't need to show/hide picker, HTML input handles it
      return;
    } else if (Platform.OS === 'ios') {
      setShowTimePicker(!showTimePicker);
    } else {
      setShowTimePicker(true);
    }
  };

  const handleWebDateChange = (event: any) => {
    const selectedDate = event.target.value;
    setFormData({ ...formData, date: selectedDate });
  };

  const handleWebTimeChange = (event: any) => {
    const selectedTime = event.target.value;
    setFormData({ ...formData, time: selectedTime });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.patientId || !formData.patientName || !formData.date || !formData.time || !formData.appointmentType || !formData.doctor) {
        Alert.alert('Missing Information', 'Please fill in all required fields');
        return;
      }

      const appointmentData = {
        patientName: formData.patientName,
        patientId: formData.patientId,
        date: formData.date,
        time: formData.time,
        appointmentType: formData.appointmentType as any,
        doctor: formData.doctor,
        notes: formData.notes,
        status: isEditing ? appointment?.status || 'Scheduled' : 'Scheduled' as const,
        duration: 30,
      };

      if (isEditing && appointment?._id) {
        await appointmentActions.updateAppointment(appointment._id, appointmentData);
        if (!appointmentState.error) {
          Alert.alert('Success', 'Appointment updated successfully');
          onSuccess?.();
        } else {
          Alert.alert('Error', appointmentState.error);
        }
      } else {
        await appointmentActions.createAppointment(appointmentData);
        if (!appointmentState.error) {
          Alert.alert('Success', 'Appointment scheduled successfully');
          onSuccess?.();
        } else {
          Alert.alert('Error', appointmentState.error);
        }
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'create'} appointment. Please try again.`);
    }
  };

  const renderPatientItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handlePatientSelect(item)}
    >
      <Text style={styles.dropdownItemText}>{item.name || 'Unnamed Patient'}</Text>
      {item.weekOfPregnancy && (
        <Text style={styles.dropdownItemSubtext}>
          Week {item.weekOfPregnancy} of pregnancy
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderAppointmentTypeItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleAppointmentTypeSelect(item)}
    >
      <Text style={styles.dropdownItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Appointment Details</Text>
        
        <Text style={styles.label}>Patient</Text>
        <View style={styles.patientInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search and select patient"
            placeholderTextColor={COLORS.gray}
            value={patientSearch}
            onChangeText={handlePatientSearchChange}
            onFocus={handlePatientInputFocus}
          />
          {showPatientDropdown && (
            <View style={styles.dropdown}>
              {filteredPatients.length > 0 ? (
                <FlatList
                  data={filteredPatients}
                  keyExtractor={(item) => item._id || ''}
                  renderItem={renderPatientItem}
                  style={styles.dropdownList}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                />
              ) : (
                <Text style={styles.noResultsText}>
                  {patientSearch.length > 0 ? 'No patients found' : 'No patients available'}
                </Text>
              )}
            </View>
          )}
        </View>
        
        <Text style={styles.label}>Date</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={styles.input}
            placeholder="Select Date"
            placeholderTextColor={COLORS.gray}
            value={formData.date}
            onChange={handleWebDateChange}
            // @ts-ignore - Web-specific prop
            type="date"
            min={new Date().toISOString().split('T')[0]}
          />
        ) : (
          <>
            <TouchableWithoutFeedback onPress={handleDatePress}>
              <View style={[styles.input, showDatePicker && Platform.OS === 'ios' && styles.inputFocused]}>
                <Text style={formData.date ? styles.inputText : styles.placeholderText}>
                  {formData.date || 'Select Date'}
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
                  value={formData.date ? new Date(formData.date) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
                />
              </View>
            )}
          </>
        )}
        
        <Text style={styles.label}>Time</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={styles.input}
            placeholder="Select Time"
            placeholderTextColor={COLORS.gray}
            value={formData.time}
            onChange={handleWebTimeChange}
            // @ts-ignore - Web-specific prop
            type="time"
          />
        ) : (
          <>
            <TouchableWithoutFeedback onPress={handleTimePress}>
              <View style={[styles.input, showTimePicker && Platform.OS === 'ios' && styles.inputFocused]}>
                <Text style={formData.time ? styles.inputText : styles.placeholderText}>
                  {formData.time || 'Select Time'}
                </Text>
                {Platform.OS === 'ios' && (
                  <Text style={styles.iosPickerIcon}>
                    {showTimePicker ? '▲' : '▼'}
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>

            {showTimePicker && (
              <View style={Platform.OS === 'ios' ? styles.iosDatePickerContainer : undefined}>
                <DateTimePicker
                  value={formData.time ? new Date(`2000-01-01T${formData.time}:00`) : new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={handleTimeChange}
                  style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
                />
              </View>
            )}
          </>
        )}
        
        <Text style={styles.label}>Appointment Type</Text>
        <View style={styles.appointmentTypeContainer}>
          <TouchableWithoutFeedback onPress={() => setShowAppointmentTypeDropdown(!showAppointmentTypeDropdown)}>
            <View style={styles.input}>
              <Text style={formData.appointmentType ? styles.inputText : styles.placeholderText}>
                {formData.appointmentType || 'Select Appointment Type'}
              </Text>
              <Text style={styles.iosPickerIcon}>
                {showAppointmentTypeDropdown ? '▲' : '▼'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {showAppointmentTypeDropdown && (
            <View style={styles.dropdown}>
              <FlatList
                data={appointmentTypes}
                keyExtractor={(item) => item}
                renderItem={renderAppointmentTypeItem}
                style={styles.dropdownList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              />
            </View>
          )}
        </View>

        <Text style={styles.label}>Doctor</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter doctor name"
          placeholderTextColor={COLORS.gray}
          value={formData.doctor}
          onChangeText={(text) => setFormData({ ...formData, doctor: text })}
        />

        <Text style={[styles.sectionTitle, { marginTop: SIZES.medium }]}>
          Additional Notes
        </Text>
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter any additional notes or special instructions"
          placeholderTextColor={COLORS.gray}
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          multiline
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={[styles.buttonText, styles.submitButtonText]}>
              {isEditing ? 'Update' : 'Schedule'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 400,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: SIZES.medium,
    paddingBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    fontSize: SIZES.font,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    color: COLORS.text,
    ...SHADOWS.light,
    ...(Platform.OS === 'web' && {
      // Web-specific styles for date/time inputs
      justifyContent: 'flex-start',
      flexDirection: 'column',
      alignItems: 'stretch',
    }),
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
    marginTop: -SIZES.medium,
    marginBottom: SIZES.medium,
    padding: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  iosDatePicker: {
    height: 120,
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.medium,
    marginTop: SIZES.medium,
    paddingBottom: SIZES.padding,
  },
  button: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.base,
    alignItems: 'center',
    minWidth: 140,
    ...SHADOWS.light,
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
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
  inputText: {
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  inputGroup: {
    marginBottom: SIZES.medium,
  },
  iosPicker: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    marginTop: SIZES.small,
  },
  patientInputContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  appointmentTypeContainer: {
    position: 'relative',
    zIndex: 999,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 200,
    zIndex: 1000,
    ...SHADOWS.medium,
    elevation: 5,
  },
  dropdownList: {
    maxHeight: 180,
  },
  dropdownItem: {
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dropdownItemText: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '600',
  },
  dropdownItemSubtext: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  noResultsText: {
    padding: SIZES.medium,
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
  },
});