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
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SIZES, SHADOWS, lightTheme, darkTheme } from '../constants/Theme';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useRecords } from '../../contexts/RecordContext';
import { MedicalRecord } from '../../services/RecordService';

interface AddRecordProps {
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddRecord({ patientId, onSuccess, onCancel }: AddRecordProps) {
  const { createRecord, loading, error } = useRecords();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLMPPicker, setShowLMPPicker] = useState(false);
  const [showEDDPicker, setShowEDDPicker] = useState(false);
  const [showNextVisitPicker, setShowNextVisitPicker] = useState(false);
  
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    patient: patientId,
    date: new Date().toISOString().split('T')[0], // Set to today's date
    timeIn: '',
    timeOut: '',
    gravida: 0,
    para: 0,
    abortion: 0,
    delivery: 0,
    lastMenstrualPeriod: '',
    expectedDueDate: '',
    ageAtMenarche: 0,
    antenatalVisitNumber: 1,
    nvd: false,
    nvdNumber: 0,
    complications: [],
    cesareanSection: false,
    cesareanCount: 0,
    cesareanIndication: '',
    cesareanComplication: '',
    chiefComplaint: '',
    historyPresentIllness: '',
    medicalHistory: {
      hypertension: false,
      diabetes: false,
      asthma: false,
      epilepsy: false,
      heartDisease: false,
      spotting: false,
      tuberculosis: false,
    },
    familyPlanning: {
      uses: false,
      method: '',
    },
    immunizations: [],
    physicalExam: {
      generalAppearance: [],
      weight: 0,
      height: 0,
      bloodPressure: '',
      pulse: 0,
      respiratoryRate: 0,
      temperature: 0,
      edemaLevel: '',
      anasarca: false,
    },
    sheet: {
      fundusHeight: 0,
      anyScars: '',
      fetalHeartTone: '',
      lie: '',
      presentingPart: '',
      shotNote: '',
    },
    labs: [],
    medication: {
      prenatal: [],
      antibiotic: '',
      analgesics: '',
      others: '',
    },
    followUp: {
      nextVisitDate: '',
      screenerName: '',
      qualification: '',
      signedBy: '',
    },
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (event: any, selectedDate?: Date, field?: string) => {
    setShowDatePicker(false);
    setShowLMPPicker(false);
    setShowEDDPicker(false);
    setShowNextVisitPicker(false);
    
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      if (field === 'lmp') {
        setFormData({ ...formData, lastMenstrualPeriod: formattedDate });
      } else if (field === 'edd') {
        setFormData({ ...formData, expectedDueDate: formattedDate });
      } else if (field === 'nextVisit') {
        setFormData({ 
          ...formData, 
          followUp: { ...formData.followUp, nextVisitDate: formattedDate }
        });
      } else {
        setFormData({ ...formData, date: formattedDate });
      }
    }
  };

  const validateForm = () => {
    if (!formData.date) {
      Alert.alert('Validation Error', 'Please select visit date');
      return false;
    }
    if (!formData.chiefComplaint?.trim()) {
      Alert.alert('Validation Error', 'Please enter chief complaint');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Clean up the data before sending
      const recordData: Omit<MedicalRecord, 'id'> = {
        patient: patientId,
        date: formData.date!,
        timeIn: formData.timeIn || '',
        timeOut: formData.timeOut || '',
        gravida: formData.gravida || 0,
        para: formData.para || 0,
        abortion: formData.abortion || 0,
        delivery: formData.delivery || 0,
        lastMenstrualPeriod: formData.lastMenstrualPeriod || '',
        expectedDueDate: formData.expectedDueDate || '',
        ageAtMenarche: formData.ageAtMenarche || 0,
        antenatalVisitNumber: formData.antenatalVisitNumber || 1,
        nvd: formData.nvd || false,
        nvdNumber: formData.nvdNumber || 0,
        complications: formData.complications || [],
        cesareanSection: formData.cesareanSection || false,
        cesareanCount: formData.cesareanCount || 0,
        cesareanIndication: formData.cesareanIndication || '',
        cesareanComplication: formData.cesareanComplication || '',
        chiefComplaint: formData.chiefComplaint?.trim() || '',
        historyPresentIllness: formData.historyPresentIllness?.trim() || '',
        medicalHistory: formData.medicalHistory || {},
        familyPlanning: formData.familyPlanning || {},
        immunizations: formData.immunizations || [],
        physicalExam: formData.physicalExam || {},
        sheet: formData.sheet || {},
        labs: formData.labs || [],
        medication: formData.medication || {},
        followUp: formData.followUp || {},
      };

      await createRecord(recordData);
      Alert.alert('Success', 'Medical record added successfully');
      onSuccess?.();
    } catch (err: any) {
      console.error('Error creating record:', err);
      let errorMessage = 'Failed to add medical record';
      if (err?.message) {
        errorMessage = err.message;
      } else if (error) {
        errorMessage = error;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const handleDatePress = (field: string) => {
    // For web, we'll use HTML input types, so no need to show native pickers
    if (Platform.OS === 'web') {
      return; // Let the HTML input handle date selection
    }
    
    if (Platform.OS === 'ios') {
      switch (field) {
        case 'date':
          setShowDatePicker(!showDatePicker);
          break;
        case 'lmp':
          setShowLMPPicker(!showLMPPicker);
          break;
        case 'edd':
          setShowEDDPicker(!showEDDPicker);
          break;
        case 'nextVisit':
          setShowNextVisitPicker(!showNextVisitPicker);
          break;
      }
    } else {
      switch (field) {
        case 'date':
          setShowDatePicker(true);
          break;
        case 'lmp':
          setShowLMPPicker(true);
          break;
        case 'edd':
          setShowEDDPicker(true);
          break;
        case 'nextVisit':
          setShowNextVisitPicker(true);
          break;
      }
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      {/* Basic Information */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Visit Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Visit Date *</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.gray}
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
            // @ts-ignore - web-specific props
            type="date"
            max={new Date().toISOString().split('T')[0]}
          />
        ) : (
          <>
            <TouchableWithoutFeedback onPress={() => handleDatePress('date')}>
              <View style={[
                styles.input, 
                { backgroundColor: theme.white, borderColor: theme.border },
                showDatePicker && Platform.OS === 'ios' && styles.inputFocused
              ]}>
                <Text style={formData.date ? [styles.inputText, { color: theme.text }] : [styles.placeholderText, { color: theme.gray }]}>
                  {formData.date || 'Select Visit Date'}
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
                  value={formData.date ? new Date(formData.date) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={(event, date) => handleDateChange(event, date, 'date')}
                  maximumDate={new Date()}
                  style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
                />
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Time In</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder={Platform.OS === 'web' ? 'HH:MM' : '09:00 AM'}
            placeholderTextColor={theme.gray}
            value={formData.timeIn}
            onChangeText={(text) => setFormData({ ...formData, timeIn: text })}
            // @ts-ignore - web-specific props
            type={Platform.OS === 'web' ? 'time' : undefined}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Time Out</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder={Platform.OS === 'web' ? 'HH:MM' : '10:00 AM'}
            placeholderTextColor={theme.gray}
            value={formData.timeOut}
            onChangeText={(text) => setFormData({ ...formData, timeOut: text })}
            // @ts-ignore - web-specific props
            type={Platform.OS === 'web' ? 'time' : undefined}
          />
        </View>
      </View>

      {/* Obstetric History */}
      <Text style={[styles.sectionTitle, { marginTop: SIZES.medium, color: theme.text }]}>
        Obstetric History
      </Text>

      <View style={styles.row}>
        <View style={styles.quarterInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Gravida</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="0"
            placeholderTextColor={theme.gray}
            value={formData.gravida?.toString()}
            onChangeText={(text) => setFormData({ ...formData, gravida: parseInt(text) || 0 })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.quarterInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Para</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="0"
            placeholderTextColor={theme.gray}
            value={formData.para?.toString()}
            onChangeText={(text) => setFormData({ ...formData, para: parseInt(text) || 0 })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.quarterInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Abortion</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="0"
            placeholderTextColor={theme.gray}
            value={formData.abortion?.toString()}
            onChangeText={(text) => setFormData({ ...formData, abortion: parseInt(text) || 0 })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.quarterInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Delivery</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="0"
            placeholderTextColor={theme.gray}
            value={formData.delivery?.toString()}
            onChangeText={(text) => setFormData({ ...formData, delivery: parseInt(text) || 0 })}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Last Menstrual Period</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.gray}
            value={formData.lastMenstrualPeriod}
            onChangeText={(text) => setFormData({ ...formData, lastMenstrualPeriod: text })}
            // @ts-ignore - web-specific props
            type="date"
            max={new Date().toISOString().split('T')[0]}
          />
        ) : (
          <>
            <TouchableWithoutFeedback onPress={() => handleDatePress('lmp')}>
              <View style={[
                styles.input, 
                { backgroundColor: theme.white, borderColor: theme.border },
                showLMPPicker && Platform.OS === 'ios' && styles.inputFocused
              ]}>
                <Text style={formData.lastMenstrualPeriod ? [styles.inputText, { color: theme.text }] : [styles.placeholderText, { color: theme.gray }]}>
                  {formData.lastMenstrualPeriod || 'Select LMP Date'}
                </Text>
                {Platform.OS === 'ios' && (
                  <Text style={[styles.iosPickerIcon, { color: theme.gray }]}>
                    {showLMPPicker ? '▲' : '▼'}
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>
            {showLMPPicker && (
              <View style={[
                Platform.OS === 'ios' ? styles.iosDatePickerContainer : undefined,
                { backgroundColor: theme.white, borderColor: theme.border }
              ]}>
                <DateTimePicker
                  value={formData.lastMenstrualPeriod ? new Date(formData.lastMenstrualPeriod) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={(event, date) => handleDateChange(event, date, 'lmp')}
                  maximumDate={new Date()}
                  style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
                />
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Expected Due Date</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.gray}
            value={formData.expectedDueDate}
            onChangeText={(text) => setFormData({ ...formData, expectedDueDate: text })}
            // @ts-ignore - web-specific props
            type="date"
            min={new Date().toISOString().split('T')[0]}
          />
        ) : (
          <>
            <TouchableWithoutFeedback onPress={() => handleDatePress('edd')}>
              <View style={[
                styles.input, 
                { backgroundColor: theme.white, borderColor: theme.border },
                showEDDPicker && Platform.OS === 'ios' && styles.inputFocused
              ]}>
                <Text style={formData.expectedDueDate ? [styles.inputText, { color: theme.text }] : [styles.placeholderText, { color: theme.gray }]}>
                  {formData.expectedDueDate || 'Select Expected Due Date'}
                </Text>
                {Platform.OS === 'ios' && (
                  <Text style={[styles.iosPickerIcon, { color: theme.gray }]}>
                    {showEDDPicker ? '▲' : '▼'}
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>
            {showEDDPicker && (
              <View style={[
                Platform.OS === 'ios' ? styles.iosDatePickerContainer : undefined,
                { backgroundColor: theme.white, borderColor: theme.border }
              ]}>
                <DateTimePicker
                  value={formData.expectedDueDate ? new Date(formData.expectedDueDate) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={(event, date) => handleDateChange(event, date, 'edd')}
                  minimumDate={new Date()}
                  style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
                />
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Age at Menarche</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="12"
            placeholderTextColor={theme.gray}
            value={formData.ageAtMenarche?.toString()}
            onChangeText={(text) => setFormData({ ...formData, ageAtMenarche: parseInt(text) || 0 })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Antenatal Visit Number</Text>
          <View style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border }]}>
            <Picker
              selectedValue={formData.antenatalVisitNumber}
              onValueChange={(itemValue: any) => setFormData({ ...formData, antenatalVisitNumber: itemValue })}
              style={[styles.picker, { color: theme.text, backgroundColor: theme.white }]}
              dropdownIconColor={theme.gray}
              mode="dropdown"
            >
              <Picker.Item label="1st Visit" value={1} color={theme.text} />
              <Picker.Item label="2nd Visit" value={2} color={theme.text} />
              <Picker.Item label="3rd Visit" value={3} color={theme.text} />
            </Picker>
          </View>
        </View>
      </View>

      {/* Clinical Information */}
      <Text style={[styles.sectionTitle, { marginTop: SIZES.medium, color: theme.text }]}>
        Clinical Information
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Chief Complaint *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
          placeholder="Enter chief complaint"
          placeholderTextColor={theme.gray}
          value={formData.chiefComplaint}
          onChangeText={(text) => setFormData({ ...formData, chiefComplaint: text })}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>History of Present Illness</Text>
        <TextInput
          style={[styles.input, styles.multilineInput, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
          placeholder="Enter history of present illness"
          placeholderTextColor={theme.gray}
          value={formData.historyPresentIllness}
          onChangeText={(text) => setFormData({ ...formData, historyPresentIllness: text })}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Medical History */}
      <Text style={[styles.sectionTitle, { marginTop: SIZES.medium, color: theme.text }]}>
        Medical History
      </Text>

      <View style={styles.checkboxContainer}>
        {Object.entries(formData.medicalHistory || {}).map(([key, value]) => (
          <View key={key} style={[styles.checkboxRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.checkboxLabel, { color: theme.text }]}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <Switch
              value={value}
              onValueChange={(newValue) => 
                setFormData({
                  ...formData,
                  medicalHistory: {
                    ...formData.medicalHistory,
                    [key]: newValue
                  }
                })
              }
              trackColor={{ false: theme.gray, true: theme.primary }}
              thumbColor={value ? COLORS.white : COLORS.white}
            />
          </View>
        ))}
      </View>

      {/* Physical Examination */}
      <Text style={[styles.sectionTitle, { marginTop: SIZES.medium, color: theme.text }]}>
        Physical Examination
      </Text>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Weight (kg)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="65"
            placeholderTextColor={theme.gray}
            value={formData.physicalExam?.weight?.toString()}
            onChangeText={(text) => setFormData({ 
              ...formData, 
              physicalExam: { 
                ...formData.physicalExam, 
                weight: parseFloat(text) || 0 
              }
            })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Height (cm)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="160"
            placeholderTextColor={theme.gray}
            value={formData.physicalExam?.height?.toString()}
            onChangeText={(text) => setFormData({ 
              ...formData, 
              physicalExam: { 
                ...formData.physicalExam, 
                height: parseFloat(text) || 0 
              }
            })}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Blood Pressure</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="120/80"
            placeholderTextColor={theme.gray}
            value={formData.physicalExam?.bloodPressure}
            onChangeText={(text) => setFormData({ 
              ...formData, 
              physicalExam: { 
                ...formData.physicalExam, 
                bloodPressure: text 
              }
            })}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Pulse</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="72"
            placeholderTextColor={theme.gray}
            value={formData.physicalExam?.pulse?.toString()}
            onChangeText={(text) => setFormData({ 
              ...formData, 
              physicalExam: { 
                ...formData.physicalExam, 
                pulse: parseInt(text) || 0 
              }
            })}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Follow Up */}
      <Text style={[styles.sectionTitle, { marginTop: SIZES.medium, color: theme.text }]}>
        Follow Up
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Next Visit Date</Text>
        {Platform.OS === 'web' ? (
          <TextInput
            style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.gray}
            value={formData.followUp?.nextVisitDate || ''}
            onChangeText={(text) => setFormData({ 
              ...formData, 
              followUp: { ...formData.followUp, nextVisitDate: text }
            })}
            // @ts-ignore - web-specific props
            type="date"
            min={new Date().toISOString().split('T')[0]}
          />
        ) : (
          <>
            <TouchableWithoutFeedback onPress={() => handleDatePress('nextVisit')}>
              <View style={[
                styles.input, 
                { backgroundColor: theme.white, borderColor: theme.border },
                showNextVisitPicker && Platform.OS === 'ios' && styles.inputFocused
              ]}>
                <Text style={formData.followUp?.nextVisitDate ? [styles.inputText, { color: theme.text }] : [styles.placeholderText, { color: theme.gray }]}>
                  {formData.followUp?.nextVisitDate || 'Select Next Visit Date'}
                </Text>
                {Platform.OS === 'ios' && (
                  <Text style={[styles.iosPickerIcon, { color: theme.gray }]}>
                    {showNextVisitPicker ? '▲' : '▼'}
                  </Text>
                )}
              </View>
            </TouchableWithoutFeedback>
            {showNextVisitPicker && (
              <View style={[
                Platform.OS === 'ios' ? styles.iosDatePickerContainer : undefined,
                { backgroundColor: theme.white, borderColor: theme.border }
              ]}>
                <DateTimePicker
                  value={formData.followUp?.nextVisitDate ? new Date(formData.followUp.nextVisitDate) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={(event, date) => handleDateChange(event, date, 'nextVisit')}
                  minimumDate={new Date()}
                  style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
                />
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Screener Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.white, borderColor: theme.border, color: theme.text }]}
          placeholder="Enter screener name"
          placeholderTextColor={theme.gray}
          value={formData.followUp?.screenerName}
          onChangeText={(text) => setFormData({ 
            ...formData, 
            followUp: { 
              ...formData.followUp, 
              screenerName: text 
            }
          })}
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
            {loading ? 'Adding...' : 'Add Record'}
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
    marginTop: SIZES.medium,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  halfInput: {
    flex: 0.48,
  },
  quarterInput: {
    flex: 0.23,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    marginBottom: SIZES.medium,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
  },
  checkboxLabel: {
    fontSize: SIZES.font,
    flex: 1,
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
  inputText: {
    fontSize: SIZES.font,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: -8, // Adjust for better alignment
  },
  disabledButton: {
    opacity: 0.6,
  },
});
