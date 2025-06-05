import { Stack } from 'expo-router';
import { COLORS } from '../../../constants/theme';

export default function PatientsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Patients',
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: 'Add Patient',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Patient Details',
        }}
      />
    </Stack>
  );
} 