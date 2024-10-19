import React, { useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import {
    setLoading,
    connectDevice,
    startScan,
    completeScan,
    resetScan
} from '../slices/fetalWatchSlice';
import { Video, ResizeMode } from 'expo-av';
import { Asset } from 'expo-asset';

const FetalWatchScreen = ({ route, navigation }: { route: any, navigation: any }) => {
    const { isConnected, isLoading, isScanning, fetalData, showVideo, showImage, scanCompleted } = useSelector((state: RootState) => state.fetalWatch);
    const dispatch = useDispatch();
    const { pregnancyId } = route.params;

    useEffect(() => {
        const preloadAssets = async () => {
            try {
                await Asset.loadAsync([
                    require('../assets/fetal-video.mp4'),
                    require('../assets/fetal-img.jpg'),
                ]);
                console.log('Assets preloaded successfully');
            } catch (error) {
                console.error('Asset preloading error:', error);
            }
        };
        preloadAssets();
    }, []);

    const connectToDevice = () => {
        dispatch(setLoading(true));
        setTimeout(() => {
            dispatch(connectDevice());
            Alert.alert('Connected to simulated FetalWatch device!');
        }, 2000);
    };

    const startFetalScan = async () => {
        if (!isConnected) {
            Alert.alert('Not connected to any device');
            return;
        }

        dispatch(startScan());

        setTimeout(() => {
            setTimeout(() => {
                const simulatedFetalData = {
                    fetalHeartbeat: Math.floor(Math.random() * (160 - 120 + 1)) + 120,
                    measurements: {
                        crownRumpLength: parseFloat((Math.random() * (10 - 7) + 7).toFixed(2)),
                        biparietalDiameter: parseFloat((Math.random() * (5 - 2) + 2).toFixed(2)),
                        femurLength: parseFloat((Math.random() * (6 - 3) + 3).toFixed(2)),
                        headCircumference: parseFloat((Math.random() * (25 - 15) + 15).toFixed(2)),
                        abdominalCircumference: parseFloat((Math.random() * (23 - 15) + 15).toFixed(2)),
                    },
                    growthAndDevelopment: 'Normal',
                    position: 'Cephalic',
                };

                dispatch(completeScan(simulatedFetalData));
                Alert.alert('Scan complete!');

            }, 4000);
        }, 4000);
    };

    const navigateToAIScreen = () => {
        if (fetalData) {
            navigation.navigate('AI', { fetalWatchId: pregnancyId });
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.heading}>FetalWatch</Text>

            <TouchableOpacity
                style={styles.connectButton}
                onPress={connectToDevice}
                disabled={isConnected || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>
                        {isConnected ? 'Connected' : 'Connect to FetalWatch Device'}
                    </Text>
                )}
            </TouchableOpacity>

            {isConnected && (
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={startFetalScan}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Start Fetal Scan</Text>
                    )}
                </TouchableOpacity>
            )}

            {showVideo && (
                <View style={styles.videoContainer}>
                    <Text style={styles.scanningText}>Scanning...</Text>
                    <Video
                        source={require('../assets/fetal-video.mp4')}
                        style={styles.video}
                        resizeMode={ResizeMode.COVER}
                        isLooping={false}
                        shouldPlay
                    />
                </View>
            )}

            {fetalData && !isScanning && (
                <View style={styles.fetalDataContainer}>
                    <Text style={styles.sectionTitle}>Fetal Health Data</Text>
                    <Text style={styles.dataText}>Fetal Heartbeat: {fetalData.fetalHeartbeat} BPM</Text>
                    {/* Render other fetalData measurements */}
                </View>
            )}

            {scanCompleted && (
                <TouchableOpacity style={styles.aiButton} onPress={navigateToAIScreen}>
                    <Text style={styles.buttonText}>View AI Analysis</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    heading: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    connectButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginBottom: 20 },
    scanButton: { backgroundColor: '#FF9500', padding: 15, borderRadius: 10, marginBottom: 20 },
    buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
    videoContainer: { alignItems: 'center', marginVertical: 20 },
    scanningText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    video: { width: '100%', height: 200 },
    fetalDataContainer: { marginVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    dataText: { fontSize: 16, marginBottom: 5 },
    aiButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 10, marginTop: 20 },
});

export default FetalWatchScreen;
