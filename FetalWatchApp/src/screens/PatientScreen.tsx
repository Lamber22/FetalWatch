// src/screens/PatientScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// Dummy data for testing purposes
const dummyPatients = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 29 },
    { id: 3, name: 'Michael Johnson', age: 40 },
];

const PatientScreen = () => {
    const [patients, setPatients] = useState(dummyPatients); // Use dummy data directly
    const [error, setError] = useState('');

    useEffect(() => {
        // Comment out the API call to use dummy data
        // const fetchPatients = async () => {
        //     try {
        //         const response = await api.get('/patients');
        //         setPatients(response.data);
        //     } catch (err) {
        //         setError('Network error: Failed to load patients');
        //     }
        // };

        // fetchPatients();
    }, []);

    return (
        <View style={styles.container}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <FlatList
                data={patients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.name}</Text>
                        <Text>{item.age} years old</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default PatientScreen;
