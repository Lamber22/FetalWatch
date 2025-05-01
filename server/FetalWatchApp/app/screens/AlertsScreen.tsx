import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FaBell, 
  FaExclamationTriangle, 
  FaHeartbeat, 
  FaWeight, 
  FaUserMd 
} from 'react-icons/fa';

// Mock Alerts Data
const initialAlerts = [
  {
    id: '1',
    patient: 'Maria Silva',
    type: 'Blood Pressure',
    severity: 'High',
    description: 'Blood pressure consistently above 140/90',
    date: '2025-05-01',
    resolved: false
  },
  {
    id: '2',
    patient: 'Ana Santos',
    type: 'Fetal Movement',
    severity: 'Medium',
    description: 'Reduced fetal movement detected',
    date: '2025-04-28',
    resolved: false
  },
  {
    id: '3',
    patient: 'Lucia Oliveira',
    type: 'Hemoglobin',
    severity: 'Low',
    description: 'Hemoglobin levels below recommended range',
    date: '2025-04-25',
    resolved: true
  }
];

export default function AlertsScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [showResolvedAlerts, setShowResolvedAlerts] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'High': return '#e74c3c';
      case 'Medium': return '#f39c12';
      case 'Low': return '#3498db';
      default: return '#7f8c8d';
    }
  };

  const toggleAlertResolution = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: !alert.resolved } 
          : alert
      )
    );
  };

  const filteredAlerts = alerts.filter(alert => 
    showResolvedAlerts || !alert.resolved
  );

  const renderAlertIcon = (type: string) => {
    switch(type) {
      case 'Blood Pressure': return <FaHeartbeat size={24} />;
      case 'Fetal Movement': return <FaWeight size={24} />;
      case 'Hemoglobin': return <FaUserMd size={24} />;
      default: return <FaExclamationTriangle size={24} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerContainer}>
          <FaBell size={50} color="#e74c3c" />
          <Text style={styles.headerTitle}>Alerts & Notifications</Text>
        </View>

        {/* Resolved Alerts Toggle */}
        <View style={styles.resolvedToggleContainer}>
          <Text style={styles.resolvedToggleLabel}>
            Show Resolved Alerts
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={showResolvedAlerts ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={setShowResolvedAlerts}
            value={showResolvedAlerts}
          />
        </View>

        {/* Alerts List */}
        <View style={styles.alertsContainer}>
          {filteredAlerts.length === 0 ? (
            <View style={styles.noAlertsContainer}>
              <Text style={styles.noAlertsText}>
                No {showResolvedAlerts ? 'resolved' : 'active'} alerts
              </Text>
            </View>
          ) : (
            filteredAlerts.map(alert => (
              <TouchableOpacity 
                key={alert.id} 
                style={[
                  styles.alertCard,
                  { 
                    backgroundColor: alert.resolved ? '#f1f2f6' : 'white',
                    borderLeftColor: getSeverityColor(alert.severity)
                  }
                ]}
                onPress={() => router.push(`/screens/PatientDetailScreen?id=${alert.id}`)}
              >
                <View style={styles.alertCardHeader}>
                  {renderAlertIcon(alert.type)}
                  <Text style={styles.alertType}>{alert.type}</Text>
                  <View 
                    style={[
                      styles.severityBadge, 
                      { backgroundColor: getSeverityColor(alert.severity) }
                    ]}
                  >
                    <Text style={styles.severityText}>{alert.severity}</Text>
                  </View>
                </View>
                <View style={styles.alertCardBody}>
                  <Text style={styles.patientName}>{alert.patient}</Text>
                  <Text style={styles.alertDescription}>{alert.description}</Text>
                  <Text style={styles.alertDate}>{alert.date}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.resolveButton}
                  onPress={() => toggleAlertResolution(alert.id)}
                >
                  <Text style={styles.resolveButtonText}>
                    {alert.resolved ? 'Unresolve' : 'Resolve'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/screens/RiskAssessmentScreen')}
          >
            <Text style={styles.actionButtonText}>Risk Assessment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    backgroundColor: '#e74c3c',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  resolvedToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  resolvedToggleLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
  alertsContainer: {
    paddingHorizontal: 15,
  },
  noAlertsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  noAlertsText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertType: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertCardBody: {
    marginBottom: 10,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  alertDescription: {
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 5,
  },
  alertDate: {
    color: '#7f8c8d',
    fontSize: 12,
    textAlign: 'right',
  },
  resolveButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  resolveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionContainer: {
    padding: 15,
  },
  actionButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
