import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <Text>Notifications will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
