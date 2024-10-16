import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface AIResultProps {
    fetalWatchId: string;
}

// Simulate fetching the AI result from the backend
const fetchAIResult = async (fetalWatchId: string) => {
    // Normally, you would make an API call here
    // const response = await fetch(`API_URL/ai-result/${fetalWatchId}`);
    // const result = await response.json();

    // Mock data simulating the AI result from the backend
    return {
        analysisDate: '2024-09-30',
        details: {
            anomaliesDetected: ['None'],
            fetalMeasurements: {
                headCircumference: 32,
                abdominalCircumference: 28,
                femurLength: 5,
            },
            riskAssessment: {
                riskLevel: 'low',
                riskFactors: [],
            },
            imageAnalysis: {
                placentalLocation: 'Anterior',
                amnioticFluidVolume: 12,
                fetalPosition: 'Cephalic',
            },
            predictiveInsights: {
                estimatedDeliveryDate: '2024-12-15',
                growthRate: 1.5,
                developmentalStage: 'Third Trimester',
            },
            confidenceScores: {
                anomalyDetection: 95,
                measurementsAccuracy: 98,
            },
            recommendations: {
                followUpActions: ['Routine Check-up'],
                nextSteps: 'Continue monitoring every two weeks',
            },
        },
    };
};

const AIScreen: React.FC<AIResultProps> = ({ fetalWatchId }) => {
    const [aiResult, setAiResult] = useState<any>(null);

    useEffect(() => {
        const getData = async () => {
            const result = await fetchAIResult(fetalWatchId);
            setAiResult(result);
        };

        getData();
    }, [fetalWatchId]);

    if (!aiResult) {
        return <Text>Loading...</Text>;
    }

    const { analysisDate, details } = aiResult;
    const {
        anomaliesDetected,
        fetalMeasurements,
        riskAssessment,
        imageAnalysis,
        predictiveInsights,
        confidenceScores,
        recommendations,
    } = details;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>AI Analysis Result</Text>
            <Text style={styles.date}>Analysis Date: {analysisDate}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Anomalies Detected</Text>
                <Text>{anomaliesDetected.length > 0 ? anomaliesDetected.join(', ') : 'None'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fetal Measurements</Text>
                <Text>Head Circumference: {fetalMeasurements.headCircumference} cm</Text>
                <Text>Abdominal Circumference: {fetalMeasurements.abdominalCircumference} cm</Text>
                <Text>Femur Length: {fetalMeasurements.femurLength} cm</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Risk Assessment</Text>
                <Text>Risk Level: {riskAssessment.riskLevel}</Text>
                <Text>Risk Factors: {riskAssessment.riskFactors.length > 0 ? riskAssessment.riskFactors.join(', ') : 'None'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Image Analysis</Text>
                <Text>Placental Location: {imageAnalysis.placentalLocation}</Text>
                <Text>Amniotic Fluid Volume: {imageAnalysis.amnioticFluidVolume} cm³</Text>
                <Text>Fetal Position: {imageAnalysis.fetalPosition}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Predictive Insights</Text>
                <Text>Estimated Delivery Date: {predictiveInsights.estimatedDeliveryDate}</Text>
                <Text>Growth Rate: {predictiveInsights.growthRate} %</Text>
                <Text>Developmental Stage: {predictiveInsights.developmentalStage}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Confidence Scores</Text>
                <Text>Anomaly Detection: {confidenceScores.anomalyDetection}%</Text>
                <Text>Measurements Accuracy: {confidenceScores.measurementsAccuracy}%</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                <Text>Follow-up Actions: {recommendations.followUpActions.join(', ')}</Text>
                <Text>Next Steps: {recommendations.nextSteps}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    date: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
        color: '#777',
    },
    section: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default AIScreen;
