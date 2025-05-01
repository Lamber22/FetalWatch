import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Appbar,
  Surface,
  Text,
  useTheme,
  List,
  Avatar,
  Portal,
  Dialog,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getPatients } from '../slices/patientSlice';
import { fetchPregnancies } from '../slices/PregnancySlice';
import BottomNav from '../components/BottomNav';
import { globalStyles } from '../theme';
import { format } from 'date-fns';

interface Appointment {
  patientId: string;
  patientName: string;
  type: 'checkup' | 'delivery' | 'test';
  time: string;
  timeSlot?: string; // For scheduling specific times
  description?: string;
}

const CalendarScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { patients } = useSelector((state: RootState) => state.patients);
  const { pregnancies } = useSelector((state: RootState) => state.pregnancies);
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const healthChecks = {
    12: { type: 'test', description: 'First Trimester Screening' },
    20: { type: 'test', description: 'Morphology Ultrasound' },
    26: { type: 'test', description: 'Glucose Tolerance Test' },
    28: { type: 'test', description: 'Blood Tests' },
    36: { type: 'test', description: 'Group B Strep Test' },
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([
          dispatch(getPatients()).unwrap(),
          dispatch(fetchPregnancies()).unwrap(),
        ]);
      } catch (err) {
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch]);

  const calculateGestationalAge = (startDate: string, currentDate: string) => {
    const start = new Date(startDate);
    const current = new Date(currentDate);
    const diffTime = Math.abs(current.getTime() - start.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const generateCheckupDates = (startDate: string, endDate: string) => {
    const dates: string[] = [];
    let currentDate = new Date(startDate);
    const dueDate = new Date(endDate);

    while (currentDate <= dueDate) {
      dates.push(format(currentDate, 'yyyy-MM-dd'));
      // Add 2 weeks
      currentDate.setDate(currentDate.getDate() + 14);
    }

    return dates;
  };

  useEffect(() => {
    // Generate appointments from pregnancies
    if (pregnancies && patients) {
      const newAppointments: Appointment[] = [];
      pregnancies.forEach(pregnancy => {
        const patient = patients.find(p => p._id === pregnancy.patientId);
        if (patient && pregnancy.dueDate) {
          // Add delivery date
          newAppointments.push({
            patientId: patient._id,
            patientName: `${patient.firstName} ${patient.lastName}`,
            type: 'delivery',
            time: pregnancy.dueDate,
            description: 'Due Date',
          });

          // Add checkup appointments and health checks
          const checkupDates = generateCheckupDates(pregnancy.lastPeriodDate, pregnancy.dueDate);
          checkupDates.forEach(date => {
            const gestationalAge = calculateGestationalAge(pregnancy.lastPeriodDate, date);
            const healthCheck = healthChecks[gestationalAge];
            
            newAppointments.push({
              patientId: patient._id,
              patientName: `${patient.firstName} ${patient.lastName}`,
              type: healthCheck ? 'test' : 'checkup',
              time: date,
              description: healthCheck?.description || 'Regular Check-up',
            });
          });
        }
      });
      setAppointments(newAppointments);
    }
  }, [pregnancies, patients]);


  const getMarkedDates = () => {
    const marked = {};
    appointments.forEach(appointment => {
      if (!marked[appointment.time]) {
        marked[appointment.time] = {
          dots: [],
          marked: true,
        };
      }
      
      // Add a dot for each appointment type, but only once per type
      const existingDotTypes = marked[appointment.time].dots.map(dot => dot.key);
      if (!existingDotTypes.includes(appointment.type)) {
        marked[appointment.time].dots.push({
          key: appointment.type,
          color: appointment.type === 'delivery' ? theme.colors.error :
                 appointment.type === 'test' ? theme.colors.warning :
                 theme.colors.primary,
        });
      }
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: theme.colors.primary,
      };
    }
    return marked;
  };
  const getDayAppointments = (date: string) => {
    return appointments.filter(appointment => appointment.time === date);
  };

  const sortAppointments = (appointments: Appointment[]) => {
    const timeSlotOrder = {
      'morning': 0,
      'afternoon': 1,
      'evening': 2,
    };

    return [...appointments].sort((a, b) => {
      // First sort by appointment type priority (delivery > test > checkup)
      const typePriority = { delivery: 0, test: 1, checkup: 2 };
      if (typePriority[a.type] !== typePriority[b.type]) {
        return typePriority[a.type] - typePriority[b.type];
      }

      // Then sort by time slot if available
      if (a.timeSlot && b.timeSlot) {
        // First try to sort by specific time if available
        const timeA = a.timeSlot.match(/\d{1,2}:\d{2}/);
        const timeB = b.timeSlot.match(/\d{1,2}:\d{2}/);
        
        if (timeA && timeB) {
          return timeA[0].localeCompare(timeB[0]);
        }

        // If no specific time, sort by period
        const periodA = a.timeSlot.toLowerCase().match(/(morning|afternoon|evening)/);
        const periodB = b.timeSlot.toLowerCase().match(/(morning|afternoon|evening)/);
        
        if (periodA && periodB) {
          return timeSlotOrder[periodA[0]] - timeSlotOrder[periodB[0]];
        }
      }
      
      return 0;
    });
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      await Promise.all([
        dispatch(getPatients()).unwrap(),
        dispatch(fetchPregnancies()).unwrap(),
      ]);
    } catch (err) {
      setError('Failed to refresh appointments. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Appbar.Header>
        <Appbar.Content title="Calendar" subtitle="Appointments & Due Dates" />
        <Appbar.Action icon="plus" onPress={() => setShowDialog(true)} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates()}
            markingType={'multi-dot'}
            theme={{
              todayTextColor: theme.colors.primary,
              selectedDayBackgroundColor: theme.colors.primary,
              dotColor: theme.colors.primary,
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.primary,
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
              dotStyle: {
                width: 6,
                height: 6,
                borderRadius: 3,
                marginHorizontal: 1,
              },
            }}
          />
        </Surface>

        <Surface style={styles.appointmentsContainer}>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Text variant="bodyLarge" style={styles.errorText}>{error}</Text>
              <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
                Retry
              </Button>
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.colors.primary]}
                />
              }
            >
              <Text variant="titleMedium" style={styles.appointmentsTitle}>
                Appointments for {format(new Date(selectedDate), 'MMMM d, yyyy')}
              </Text>
              
              {sortAppointments(getDayAppointments(selectedDate)).map((appointment, index) => (
                <List.Item
                  key={`${appointment.patientId}-${index}`}
                  title={appointment.patientName}
                  description={
                    <View>
                      <Text variant="bodyMedium">{appointment.description}</Text>
                      {appointment.timeSlot && (
                        <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                          Scheduled for: {appointment.timeSlot}
                        </Text>
                      )}
                    </View>
                  }
                  left={props => (
                    <Avatar.Icon
                      {...props}
                      icon={
                        appointment.type === 'delivery' ? 'baby' :
                        appointment.type === 'test' ? 'test-tube' : 'stethoscope'
                      }
                      color={
                        appointment.type === 'delivery' ? theme.colors.error :
                        appointment.type === 'test' ? theme.colors.warning : theme.colors.primary
                      }
                      style={{ backgroundColor: 'transparent' }}
                    />
                  )}
                  right={props => (
                    <Avatar.Icon
                      {...props}
                      icon="chevron-right"
                      size={24}
                      color={theme.colors.primary}
                      style={{ backgroundColor: 'transparent' }}
                    />
                  )}
                  onPress={() => navigation.navigate('PatientDetail', { id: appointment.patientId })}
                  style={[
                    styles.appointmentItem,
                    { borderLeftWidth: 4, borderLeftColor: 
                      appointment.type === 'delivery' ? theme.colors.error :
                      appointment.type === 'test' ? theme.colors.warning :
                      theme.colors.primary 
                    }
                  ]}
                />
              ))}

              {getDayAppointments(selectedDate).length === 0 && (
                <Text variant="bodyMedium" style={styles.noAppointments}>
                  No appointments scheduled for this day
                </Text>
              )}
            </ScrollView>
          )}
        </Surface>
      </View>

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Add Appointment</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              To add an appointment, please select a patient and schedule their next visit.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={() => {
                setShowDialog(false);
                navigation.navigate('PatientScreen');
              }}
            >
              Select Patient
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  calendarContainer: {
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  appointmentsContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  appointmentsTitle: {
    marginBottom: 16,
  },
  appointmentItem: {
    paddingVertical: 10,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: '#fff',
    // Adding active state styling for Android and iOS
    android_ripple: { color: 'rgba(0, 0, 0, 0.12)' },
    // Adding subtle border styling
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    // Improved padding for better touch targets
    paddingHorizontal: 4,
  },
  noAppointments: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#d32f2f',
  },
  retryButton: {
    marginTop: 8,
  },
});

export default CalendarScreen;
