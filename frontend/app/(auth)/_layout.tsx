import { Stack } from 'expo-router';
import { COLORS } from '../../components/constants/Theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.white },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AccountScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}