import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import BottomNav from '../components/ButtomNav';
import { NavigationProp } from '@react-navigation/native';

interface CalendarScreenProps {
    navigation: NavigationProp<any>;
}

const CalendarScreen = ({ navigation }: CalendarScreenProps) => {
    const [appointments, setAppointments] = useState([
        {
            id: '1',
            date: '2024-02-20',
            patient: 'Faith Dolo',
            description: 'Routine Checkup',
        },
        {
            id: '2',
            date: '2024-03-15',
            patient: 'Mary Kollie',
            description: 'Ultrasound',
        },
    ]);

    // Define health check reminders
    const healthChecks: { [key: string]: string } = {
        '2024-01-15': 'Initial check-up',
        '2024-02-15': 'Blood tests',
        '2024-03-20': '20-week ultrasound',
        '2024-04-15': 'Glucose tolerance test',
        '2024-05-01': 'Regular check-up',
        '2024-06-01': 'Group B strep test',
        '2024-07-15': 'Final check-up before delivery',
    };

    const handleDateSelect = (day: { dateString: string }) => {
        const selectedAppointments = appointments.filter(appointment => appointment.date === day.dateString);
        const reminder = healthChecks[day.dateString] || null;

        navigation.navigate('AppointmentList', { appointments: selectedAppointments, reminder });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calendar</Text>
            <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                    '2024-02-20': { marked: true, dotColor: 'red' },
                    '2024-03-15': { marked: true, dotColor: 'red' },
                }}
            />

            <Text style={styles.subTitle}>Upcoming Appointments</Text>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.appointmentItem}
                        onPress={() => navigation.navigate('AppointmentDetails', { id: item.id })}
                    >
                        <Text style={styles.appointmentText}>{item.patient} - {item.description}</Text>
                        <Text style={styles.appointmentDate}>{item.date}</Text>
                    </TouchableOpacity>
                )}
            />
            {/* Add BottomNav here */}
            <BottomNav navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    appointmentItem: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 10,
    },
    appointmentText: {
        fontSize: 16,
    },
    appointmentDate: {
        fontSize: 14,
        color: '#888',
    },
});

export default CalendarScreen;
