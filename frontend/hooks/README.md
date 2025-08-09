# usePatientReports Hook

A reusable React hook for managing patient report data including Risk Assessment, Vital Signs, and Complications.

## Features

- **Centralized Data Management**: Single hook for all patient report data
- **Caching**: Automatically caches patient reports to avoid redundant API calls
- **Loading States**: Provides loading states for each patient individually
- **Error Handling**: Built-in error handling with logging
- **Utility Functions**: Helper functions for common operations (color coding, formatting, etc.)

## Usage

```typescript
import { usePatientReports, PatientReportUtils } from '../hooks/usePatientReports';

function PatientComponent() {
  const { 
    patientReports, 
    loadPatientReports, 
    isLoading, 
    hasData 
  } = usePatientReports();
  
  const { colors } = useTheme();

  const handleLoadPatient = async (patientId: string) => {
    const data = await loadPatientReports(patientId);
    if (data) {
      console.log('Patient reports loaded:', data);
    }
  };

  const patientData = patientReports[patientId];
  
  return (
    <View>
      {isLoading(patientId) ? (
        <ActivityIndicator />
      ) : patientData ? (
        <View>
          {/* Risk Assessment */}
          <View style={[
            styles.riskBadge,
            { backgroundColor: PatientReportUtils.getRiskLevelColor(
                patientData.riskAssessment?.riskLevel, 
                colors
              ) 
            }
          ]}>
            <Text>{patientData.riskAssessment?.riskLevel}</Text>
          </View>

          {/* Vital Signs */}
          {patientData.vitalTrends?.map((vital, index) => (
            <Text key={index}>
              BP: {PatientReportUtils.formatBloodPressure(vital.bloodPressure)}
            </Text>
          ))}

          {/* Complications */}
          {patientData.complications?.map((complication, index) => (
            <View key={index} style={[
              styles.badge,
              { backgroundColor: PatientReportUtils.getProbabilityColor(
                  complication.probability, 
                  colors
                ) 
              }
            ]}>
              <Text>{complication.name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}
```

## API Reference

### Hook Return Values

#### `patientReports: Record<string, PatientReportData>`
Object containing cached patient report data indexed by patient ID.

#### `loadingReports: Record<string, boolean>`
Object containing loading states indexed by patient ID.

#### `loadPatientReports(patientId: string): Promise<PatientReportData | null>`
Loads patient reports for the given patient ID. Returns cached data if available.

#### `clearPatientReport(patientId: string): void`
Clears cached data for a specific patient.

#### `clearAllReports(): void`
Clears all cached patient reports.

#### `isLoading(patientId: string): boolean`
Returns true if reports are currently being loaded for the given patient.

#### `hasData(patientId: string): boolean`
Returns true if cached data exists for the given patient.

### PatientReportData Interface

```typescript
interface PatientReportData {
  riskAssessment: RiskAssessment | null;
  vitalTrends: VitalTrend[] | null;
  complications: Complication[] | null;
  loadedAt: string;
}
```

### Utility Functions

#### `PatientReportUtils.getRiskLevelColor(level: string, colors: any): string`
Returns appropriate color for risk level (high, moderate, low).

#### `PatientReportUtils.getPriorityColor(priority: string, colors: any): string`
Returns appropriate color for recommendation priority.

#### `PatientReportUtils.getProbabilityColor(probability: string, colors: any): string`
Returns appropriate color for complication probability.

#### `PatientReportUtils.formatBloodPressure(bp: string | object): string`
Formats blood pressure values consistently.

#### `PatientReportUtils.calculateAge(dateOfBirth: string): number | string`
Calculates age from date of birth.

#### `PatientReportUtils.getRiskLevel(weekOfPregnancy: number): string`
Determines risk level based on week of pregnancy.

## Benefits

1. **Code Reusability**: Same hook used in multiple components (PatientsListTab, Reports)
2. **Reduced Duplication**: No need to repeat data fetching logic
3. **Consistent Error Handling**: Centralized error management
4. **Performance**: Built-in caching prevents unnecessary API calls
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Maintainability**: Single source of truth for patient report logic

## Components Using This Hook

- `PatientsListTab.tsx` - Main patient list with expandable details
- `Reports.tsx` - Reports screen with patient view toggle
- Any other component that needs patient report data

## Migration Benefits

**Before**: Each component had ~50 lines of duplicate code for:
- State management (`patientReports`, `loadingReports`)
- Data fetching logic (`loadPatientReports` function)
- Utility functions (`getRiskLevelColor`, `formatBloodPressure`, etc.)

**After**: Components now use:
- Single hook import: `usePatientReports`
- Utility import: `PatientReportUtils`
- Clean, maintainable code with no duplication
