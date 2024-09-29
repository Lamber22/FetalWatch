// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import PatientScreen from '../screens/PatientScreen';
import AddPatientScreen from '../components/AddPatientScreen';
import PatientDataScreen from '../screens/PatientDataScreen';
import AddPregnancyDetailsScreen from '../components/AddPregnancyDetailsScreen';
import FetalWatchScreen from '../components/FetalWatchScreen';

export type RootStackParamList = {
    Login: undefined;
    Registration: undefined;
    Home: undefined;
    Patient: { id: string };
    AddPatient: { onSubmit: (newPatient: any) => void };
    PatientDetails: { patient: any; pregnancy: any }; // Adjust the type as needed
    AddPregnancyDetails: { patientId: string };
    FetalWatch: { patientId: string }; // Added FetalWatch to the types
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Patient" component={PatientScreen} />
                <Stack.Screen
                    name="AddPatient"
                    component={AddPatientScreen}
                    options={{ title: 'Add New Patient' }}
                />
                <Stack.Screen
                    name="PatientDetails"
                    component={PatientDataScreen}
                    options={{ title: 'Patient Details' }}
                />
                <Stack.Screen
                    name="AddPregnancyDetails"
                    component={AddPregnancyDetailsScreen}
                    options={{ title: 'Add Pregnancy Details' }}
                />
                <Stack.Screen
                    name="FetalWatch"
                    component={FetalWatchScreen}
                    options={{ title: 'Fetal Watch' }} // Optional: set a title
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
