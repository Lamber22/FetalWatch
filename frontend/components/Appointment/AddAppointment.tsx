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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SIZES, SHADOWS } from '../constants/Theme';
import { usePatients } from '../../contexts/PatientsContext';

interface AddAppointmentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddAppointmentScreen({ onSuccess, onCancel }: AddAppointmentProps) {
  const { patients, fetchPatients, loading } = usePatients();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    type: '',
    notes: '',
  });

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

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
    if (Platform.OS === 'ios') {
      setShowDatePicker(!showDatePicker);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleTimePress = () => {
    if (Platform.OS === 'ios') {
      setShowTimePicker(!showTimePicker);
    } else {
      setShowTimePicker(true);
    }
  };

  const handleSubmit = () => {
    // TODO: Implement appointment scheduling logic
    console.log('Appointment Data:', formData);
    onSuccess?.();
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
        
        <Text style={styles.label}>Time</Text>
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
        
        <Text style={styles.label}>Appointment Type</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Regular Checkup, Ultrasound"
          placeholderTextColor={COLORS.gray}
          value={formData.type}
          onChangeText={(text) => setFormData({ ...formData, type: text })}
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
              Schedule
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
    ...SHADOWS.light,
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