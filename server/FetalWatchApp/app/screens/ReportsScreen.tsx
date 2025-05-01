import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FaClipboardList, 
  FaChartBar, 
  FaFileDownload, 
  FaFilePdf 
} from 'react-icons/fa';

export default function ReportsScreen() {
  const router = useRouter();
  const [selectedReportType, setSelectedReportType] = useState(null);

  const reportTypes = [
    {
      id: 'patient-summary',
      title: 'Patient Summary Report',
      description: 'Comprehensive overview of patient health metrics',
      icon: <FaClipboardList size={24} color="#3498db" />
    },
    {
      id: 'risk-analysis',
      title: 'Risk Assessment Report',
      description: 'Detailed analysis of potential health risks',
      icon: <FaChartBar size={24} color="#e74c3c" />
    }
  ];

  const generateReport = (reportType: string) => {
    // Placeholder for report generation logic
    console.log(`Generating report: ${reportType}`);
    // In a real app, this would trigger backend report generation
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Health Reports</Text>
          <Text style={styles.headerSubtitle}>Generate and download patient reports</Text>
        </View>

        <View style={styles.reportTypesContainer}>
          {reportTypes.map((report) => (
            <TouchableOpacity 
              key={report.id}
              style={styles.reportTypeButton}
              onPress={() => {
                setSelectedReportType(report.id);
                generateReport(report.id);
              }}
            >
              <View style={styles.reportTypeIconContainer}>
                {report.icon}
              </View>
              <View style={styles.reportTypeTextContainer}>
                <Text style={styles.reportTypeTitle}>{report.title}</Text>
                <Text style={styles.reportTypeDescription}>{report.description}</Text>
              </View>
              <View style={styles.reportTypeActionContainer}>
                <TouchableOpacity 
                  style={styles.downloadButton}
                  onPress={() => generateReport(report.id)}
                >
                  <FaFileDownload size={20} color="#2ecc71" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#3498db',
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  reportTypesContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  reportTypeButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportTypeIconContainer: {
    marginRight: 15,
  },
  reportTypeTextContainer: {
    flex: 1,
  },
  reportTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  reportTypeDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  reportTypeActionContainer: {
    marginLeft: 10,
  },
  downloadButton: {
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
  },
});
