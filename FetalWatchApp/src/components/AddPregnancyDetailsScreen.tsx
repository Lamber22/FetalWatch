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
  Switch,
  List,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { addPregnancyDetails } from '../slices/PregnancySlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { globalStyles } from '../theme';

type AddPregnancyDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPregnancyDetails'>;

interface Props {
  navigation: AddPregnancyDetailsScreenNavigationProp;
  route: {
    params: {
      patientId: string;
    };
  };
}

interface FormErrors {
  gestationalAge?: string;
  lastPeriodDate?: string;
  dueDate?: string;
  bloodPressure?: string;
  weight?: string;
  hemoglobinLevel?: string;
}

const AddPregnancyDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { patientId } = route.params;

  const [formData, setFormData] = useState({
    gestationalAge: '',
    lastPeriodDate: '',
    dueDate: '',
    bloodPressure: '',
    weight: '',
    hemoglobinLevel: '',
    isHighRisk: false,
    notes: '',
  });
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [showLastPeriodPicker, setShowLastPeriodPicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.gestationalAge.trim()) {
      newErrors.gestationalAge = 'Gestational age is required';
    } else if (isNaN(Number(formData.gestationalAge)) || Number(formData.gestationalAge) < 0) {
      newErrors.gestationalAge = 'Please enter a valid gestational age';
    }

    if (!formData.lastPeriodDate) {
      newErrors.lastPeriodDate = 'Last period date is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (formData.lastPeriodDate) {
      // Validate that due date is after last period
      const lastPeriod = new Date(formData.lastPeriodDate);
      const dueDate = new Date(formData.dueDate);
      
      if (dueDate <= lastPeriod) {
        newErrors.dueDate = 'Due date must be after last period date';
      } else {
        // Validate due date is within reasonable range (37-42 weeks after last period)
        const daysDiff = Math.floor((dueDate.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
        const weeksDiff = daysDiff / 7;
        
        if (weeksDiff < 37) {
          newErrors.dueDate = 'Due date appears too early (less than 37 weeks from last period)';
        } else if (weeksDiff > 42) {
          newErrors.dueDate = 'Due date appears too late (more than 42 weeks from last period)';
        }
      }
    }

    if (!formData.bloodPressure.trim()) {
      newErrors.bloodPressure = 'Blood pressure is required';
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(formData.bloodPressure.trim())) {
      newErrors.bloodPressure = 'Please enter a valid blood pressure (e.g., 120/80)';
    }

    if (!formData.weight.trim()) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    if (!formData.hemoglobinLevel.trim()) {
      newErrors.hemoglobinLevel = 'Hemoglobin level is required';
    } else if (isNaN(Number(formData.hemoglobinLevel)) || Number(formData.hemoglobinLevel) <= 0) {
      newErrors.hemoglobinLevel = 'Please enter a valid hemoglobin level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const assessRiskLevel = () => {
    let isHighRisk = false;
    let riskFactors: string[] = [];

    // Check blood pressure
    if (formData.bloodPressure) {
      const [systolic, diastolic] = formData.bloodPressure.split('/').map(Number);
      if (systolic >= 140 || diastolic >= 90) {
        isHighRisk = true;
        riskFactors.push('High blood pressure');
      }
    }

    // Check hemoglobin level
    if (formData.hemoglobinLevel && Number(formData.hemoglobinLevel) < 11) {
      isHighRisk = true;
      riskFactors.push('Low hemoglobin');
    } else if (formData.hemoglobinLevel && Number(formData.hemoglobinLevel) < 9) {
      isHighRisk = true;
      riskFactors.push('Severe anemia');
    }

    // Check gestational age
    if (formData.gestationalAge && Number(formData.gestationalAge) > 40) {
      isHighRisk = true;
      riskFactors.push('Post-term pregnancy');
    } else if (formData.gestationalAge && Number(formData.gestationalAge) < 12) {
      // Early pregnancy may need additional monitoring
      isHighRisk = true;
      riskFactors.push('Early pregnancy - requires close monitoring');
    }
    
    // Check weight - this could be enhanced with BMI calculation if height is available
    if (formData.weight && Number(formData.weight) < 45) {
      isHighRisk = true;
      riskFactors.push('Low maternal weight');
    }

    return { isHighRisk, riskFactors };
  };

  const handleDateChange = (fieldName: 'lastPeriodDate' | 'dueDate') => (event: any, selectedDate?: Date) => {
    if (fieldName === 'lastPeriodDate') {
      setShowLastPeriodPicker(Platform.OS === 'ios');
    } else {
      setShowDueDatePicker(Platform.OS === 'ios');
    }

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const newFormData = {
        ...formData,
        [fieldName]: formattedDate,
      };
      
      // Validate date relationships
      const newErrors = { ...errors };
      
      if (fieldName === 'dueDate' && formData.lastPeriodDate) {
        const lastPeriod = new Date(formData.lastPeriodDate);
        const dueDate = new Date(formattedDate);
        
        // Check if due date is before last period
        if (dueDate <= lastPeriod) {
          newErrors.dueDate = 'Due date must be after last period date';
        } else {
          // Check if due date is within reasonable range (37-42 weeks)
          const daysDiff = Math.floor((dueDate.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
          const weeksDiff = daysDiff / 7;
          
          if (weeksDiff < 37) {
            newErrors.dueDate = 'Due date appears too early (less than 37 weeks from last period)';
          } else if (weeksDiff > 42) {
            newErrors.dueDate = 'Due date appears too late (more than 42 weeks from last period)';
          } else {
            delete newErrors.dueDate;
          }
        }
      } else if (fieldName === 'lastPeriodDate' && formData.dueDate) {
        const lastPeriod = new Date(formattedDate);
        const dueDate = new Date(formData.dueDate);
        
        // Check if due date is before last period
        if (dueDate <= lastPeriod) {
          newErrors.dueDate = 'Due date must be after last period date';
        } else {
          // Check if due date is within reasonable range (37-42 weeks)
          const daysDiff = Math.floor((dueDate.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
          const weeksDiff = daysDiff / 7;
          
          if (weeksDiff < 37) {
            newErrors.dueDate = 'Due date appears too early (less than 37 weeks from last period)';
          } else if (weeksDiff > 42) {
            newErrors.dueDate = 'Due date appears too late (more than 42 weeks from last period)';
          } else {
            delete newErrors.dueDate;
          }
        }
      }
      
      setFormData(newFormData);
      setErrors(newErrors);
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Only assess risk for relevant fields
    if (['bloodPressure', 'hemoglobinLevel', 'gestationalAge'].includes(field)) {
      const { isHighRisk, riskFactors } = assessRiskLevel();
      setRiskFactors(riskFactors);
      if (isHighRisk !== formData.isHighRisk) {
        setFormData({ ...newFormData, isHighRisk });
      }
    }
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
      const pregnancyData = {
        ...formData,
        patientId,
        gestationalAge: Number(formData.gestationalAge),
        weight: Number(formData.weight),
        hemoglobinLevel: Number(formData.hemoglobinLevel),
      };
      
      await dispatch(addPregnancyDetails(pregnancyData)).unwrap();
      setSnackbarMessage('Pregnancy details added successfully');
      setSnackbarVisible(true);
      setTimeout(() => {
        navigation.navigate('PatientDetail', { id: patientId });
      }, 1000);
    } catch (error) {
      setSnackbarMessage('Failed to add pregnancy details. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Pregnancy Details" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Surface style={styles.formContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Pregnancy Information</Text>

          <TextInput
            label="Gestational Age (weeks)"
            value={formData.gestationalAge}
            onChangeText={(text) => updateFormData('gestationalAge', text)}
            error={!!errors.gestationalAge}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
          <HelperText type="error" visible={!!errors.gestationalAge}>
            {errors.gestationalAge}
          </HelperText>

          <TextInput
            label="Last Period Date"
            value={formData.lastPeriodDate}
            error={!!errors.lastPeriodDate}
            style={styles.input}
            mode="outlined"
            right={<TextInput.Icon icon="calendar" onPress={() => setShowLastPeriodPicker(true)} />}
            showSoftInputOnFocus={false}
            onPressIn={() => setShowLastPeriodPicker(true)}
          />
          <HelperText type="error" visible={!!errors.lastPeriodDate}>
            {errors.lastPeriodDate}
          </HelperText>

          {showLastPeriodPicker && (
            <DateTimePicker
              value={formData.lastPeriodDate ? new Date(formData.lastPeriodDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange('lastPeriodDate')}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            label="Expected Due Date"
            value={formData.dueDate}
            error={!!errors.dueDate}
            style={styles.input}
            mode="outlined"
            right={<TextInput.Icon icon="calendar" onPress={() => setShowDueDatePicker(true)} />}
            showSoftInputOnFocus={false}
            onPressIn={() => setShowDueDatePicker(true)}
          />
          <HelperText type="error" visible={!!errors.dueDate}>
            {errors.dueDate}
          </HelperText>

          {showDueDatePicker && (
            <DateTimePicker
              value={formData.dueDate ? new Date(formData.dueDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange('dueDate')}
              minimumDate={new Date()}
            />
          )}

          <Divider style={styles.divider} />
          <Text variant="titleMedium" style={styles.sectionTitle}>Health Metrics</Text>

          <TextInput
            label="Blood Pressure (e.g., 120/80)"
            value={formData.bloodPressure}
            onChangeText={(text) => updateFormData('bloodPressure', text)}
            error={!!errors.bloodPressure}
            style={styles.input}
            mode="outlined"
          />
          <HelperText type="error" visible={!!errors.bloodPressure}>
            {errors.bloodPressure}
          </HelperText>

          <TextInput
            label="Weight (kg)"
            value={formData.weight}
            onChangeText={(text) => updateFormData('weight', text)}
            error={!!errors.weight}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
          <HelperText type="error" visible={!!errors.weight}>
            {errors.weight}
          </HelperText>

          <TextInput
            label="Hemoglobin Level (g/dL)"
            value={formData.hemoglobinLevel}
            onChangeText={(text) => updateFormData('hemoglobinLevel', text)}
            error={!!errors.hemoglobinLevel}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
          <HelperText type="error" visible={!!errors.hemoglobinLevel}>
            {errors.hemoglobinLevel}
          </HelperText>

          <List.Item
            title="High Risk Pregnancy"
            description={formData.isHighRisk 
              ? "This pregnancy requires special monitoring and care"
              : "Toggle on if this pregnancy needs additional monitoring"}
            descriptionStyle={{ 
              color: formData.isHighRisk ? theme.colors.error : theme.colors.secondary,
              fontSize: 12
            }}
            right={() => (
              <Switch
                value={formData.isHighRisk}
                onValueChange={(value) => updateFormData('isHighRisk', value)}
              />
            )}
          />

          {formData.isHighRisk && (
            <View style={[styles.riskFactorsContainer, { backgroundColor: theme.colors.errorContainer }]}>
              <Text variant="titleSmall" style={{ marginBottom: 8, color: theme.colors.error, fontWeight: 'bold' }}>
                {riskFactors.length > 0 ? 'Risk Factors Detected:' : 'High Risk Status'}
              </Text>
              {riskFactors.length > 0 ? (
                riskFactors.map((factor, index) => (
                  <List.Item
                    key={index}
                    title={factor}
                    left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />}
                    titleStyle={[styles.riskFactors, { color: theme.colors.error }]}
                    style={{ paddingVertical: 0 }}
                    description={index === 0 ? "Requires immediate attention" : undefined}
                  />
                ))
              ) : (
                <Text style={[styles.riskFactors, { color: theme.colors.error, marginLeft: 16 }]}>
                  This pregnancy has been manually marked as high risk.
                </Text>
              )}
            </View>
          )}

          <Divider style={styles.divider} />
          <Text variant="titleMedium" style={styles.sectionTitle}>Additional Information</Text>

          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={(text) => updateFormData('notes', text)}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Enter any additional observations, symptoms, or concerns..."
          />
          <HelperText type="info">
            Include any symptoms, previous complications, or other relevant health information.
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
          Add Pregnancy Details
        </Button>
      </Surface>

      <Portal>
        <Dialog visible={confirmDialogVisible} onDismiss={() => setConfirmDialogVisible(false)}>
          <Dialog.Title>Confirm Pregnancy Details</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to add these pregnancy details?</Text>
            <Text variant="bodyMedium" style={styles.summaryText}>
              {`Gestational Age: ${formData.gestationalAge} weeks\n`}
              {`Last Period: ${formData.lastPeriodDate}\n`}
              {`Due Date: ${formData.dueDate}\n`}
              {`Blood Pressure: ${formData.bloodPressure}\n`}
              {`Weight: ${formData.weight} kg\n`}
              {`Hemoglobin: ${formData.hemoglobinLevel} g/dL\n`}
              {`High Risk: ${formData.isHighRisk ? 'Yes' : 'No'}`}
              {formData.isHighRisk && riskFactors.length > 0 ? `\n\nRisk Factors: ${riskFactors.join(', ')}` : ''}
            </Text>
            {formData.isHighRisk && (
              <Text variant="bodyMedium" style={[styles.summaryText, { color: theme.colors.error, marginTop: 8 }]}>
                This patient will be flagged for priority monitoring.
              </Text>
            )}
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
  riskFactorsContainer: {
    borderRadius: 12,
    marginVertical: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderColor: 'rgba(186, 26, 26, 0.7)',
    elevation: 3,
    shadowColor: 'rgba(186, 26, 26, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    marginHorizontal: 8,
  },
  riskFactors: {
    fontSize: 14,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
});

export default AddPregnancyDetailsScreen;
