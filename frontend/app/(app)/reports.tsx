import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../components/constants/Theme';

export default function ReportsScreen() {
  // Mock data - replace with actual API calls
  const stats = {
    totalPatients: 156,
    highRiskCases: 12,
    totalDeliveries: 45,
    upcomingVisits: 8,
    monthlyVisits: [
      { month: 'Jan', count: 45 },
      { month: 'Feb', count: 52 },
      { month: 'Mar', count: 48 },
      { month: 'Apr', count: 55 },
    ],
    riskDistribution: {
      high: 12,
      medium: 35,
      low: 109,
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* Summary Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalPatients}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.highRiskCases}</Text>
            <Text style={styles.statLabel}>High Risk Cases</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalDeliveries}</Text>
            <Text style={styles.statLabel}>Total Deliveries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.upcomingVisits}</Text>
            <Text style={styles.statLabel}>Upcoming Visits</Text>
          </View>
        </View>
      </View>

      {/* Monthly Visits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Visits</Text>
        <View style={styles.card}>
          {stats.monthlyVisits.map((item, index) => (
            <View key={index} style={styles.monthlyItem}>
              <Text style={styles.monthText}>{item.month}</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${(item.count / 60) * 100}%`,
                      backgroundColor: COLORS.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.countText}>{item.count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Risk Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Distribution</Text>
        <View style={styles.card}>
          <View style={styles.riskItem}>
            <Text style={styles.riskLabel}>High Risk</Text>
            <View style={styles.riskBarContainer}>
              <View
                style={[
                  styles.riskBar,
                  {
                    width: `${(stats.riskDistribution.high / stats.totalPatients) * 100}%`,
                    backgroundColor: COLORS.error,
                  },
                ]}
              />
            </View>
            <Text style={styles.riskCount}>{stats.riskDistribution.high}</Text>
          </View>
          <View style={styles.riskItem}>
            <Text style={styles.riskLabel}>Medium Risk</Text>
            <View style={styles.riskBarContainer}>
              <View
                style={[
                  styles.riskBar,
                  {
                    width: `${(stats.riskDistribution.medium / stats.totalPatients) * 100}%`,
                    backgroundColor: COLORS.warning,
                  },
                ]}
              />
            </View>
            <Text style={styles.riskCount}>{stats.riskDistribution.medium}</Text>
          </View>
          <View style={styles.riskItem}>
            <Text style={styles.riskLabel}>Low Risk</Text>
            <View style={styles.riskBarContainer}>
              <View
                style={[
                  styles.riskBar,
                  {
                    width: `${(stats.riskDistribution.low / stats.totalPatients) * 100}%`,
                    backgroundColor: COLORS.success,
                  },
                ]}
              />
            </View>
            <Text style={styles.riskCount}>{stats.riskDistribution.low}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    padding: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -SIZES.base,
  },
  statCard: {
    width: '50%',
    padding: SIZES.base,
  },
  statNumber: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    ...SHADOWS.light,
  },
  monthlyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  monthText: {
    width: 40,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  barContainer: {
    flex: 1,
    height: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.base,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: SIZES.base,
  },
  countText: {
    width: 30,
    fontSize: SIZES.font,
    color: COLORS.text,
    textAlign: 'right',
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  riskLabel: {
    width: 100,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  riskBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.base,
    overflow: 'hidden',
  },
  riskBar: {
    height: '100%',
    borderRadius: SIZES.base,
  },
  riskCount: {
    width: 30,
    fontSize: SIZES.font,
    color: COLORS.text,
    textAlign: 'right',
  },
}); 