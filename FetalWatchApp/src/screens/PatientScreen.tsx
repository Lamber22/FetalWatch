// src/screens/PatientScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getPatients } from '../slices/patientSlice'; // Updated import
import { fetchPregnancies } from '../slices/PregnancySlice'; // Import fetchPregnancies
import { RootState } from '../store/store';

const PatientScreen = () => {
    const dispatch = useDispatch();
    const { patients, loading, error } = useSelector((state: RootState) => state.patients); // Updated selector
    const { pregnancies } = useSelector((state: RootState) => state.pregnancies); // Add pregnancies selector

    useEffect(() => {
        dispatch(getPatients());
        dispatch(fetchPregnancies()); // Fetch pregnancies
    }, [dispatch]);

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>Error: {error}</Text>
            ) : (
                <FlatList
                    data={patients}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text>{item.firstName} {item.lastName}</Text> {/* Updated to match patient data */}
                            <Text>{item.age} years old</Text>
                            {/* Display pregnancies for each patient */}
                            <FlatList
                                data={pregnancies.filter(pregnancy => pregnancy.patientId === item._id)}
                                keyExtractor={(pregnancy) => pregnancy._id}
                                renderItem={({ pregnancy }) => (
                                    <Text>Pregnancy ID: {pregnancy._id}</Text>
                                )}
                            />
                        </View>
                    )}
                />
            )}
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
