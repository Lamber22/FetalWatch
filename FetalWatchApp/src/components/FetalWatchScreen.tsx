import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { Video, ResizeMode } from 'expo-av';
import { Asset } from 'expo-asset'; // Import Asset for preloading of video and image

interface FetalData {
    fetalHeartbeat: number;
    measurements: {
        crownRumpLength: number;
        biparietalDiameter: number;
        femurLength: number;
        headCircumference: number;
        abdominalCircumference: number;
    };
    growthAndDevelopment: string;
    position: string;
}

const FetalWatchScreen = ({ route }: { route: any }) => {
    const { pregnancyId } = route.params;
    const [isConnected, setIsConnected] = useState(false);
    const [fetalData, setFetalData] = useState<FetalData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [showImage, setShowImage] = useState(false); // For displaying scan image

    // Preload assets
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
        setIsLoading(true);
        setTimeout(() => {
            setIsConnected(true);
            setIsLoading(false);
            Alert.alert('Connected to simulated FetalWatch device!');
        }, 2000);
    };

    const startFetalScan = async () => {
        if (!isConnected) {
            Alert.alert('Not connected to any device');
            return;
        }

        setIsLoading(true);
        setIsScanning(true);

        setTimeout(() => {
            setShowVideo(true);

            setTimeout(async () => {
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

                setFetalData(simulatedFetalData);

                try {
                    const response = await axios.post('YOUR_BACKEND_API_URL/fetalwatch', {
                        pregnancyId,
                        fetalData: simulatedFetalData,
                    });
                    setIsLoading(false);
                    setIsScanning(false);
                    setShowVideo(false); // Hide the video after scan completion
                    setShowImage(true); // Show the image after scan completion
                    Alert.alert('Scan complete and data saved successfully!');
                } catch (error) {
                    setIsLoading(false);
                    setIsScanning(false);
                    setShowVideo(false);
                    console.error('Error saving data:', error);
                    Alert.alert('Error saving data');
                }
            }, 4000);
        }, 4000);
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
                    <Text style={styles.dataText}>CRL: {fetalData.measurements.crownRumpLength} mm</Text>
                    <Text style={styles.dataText}>Biparietal Diameter: {fetalData.measurements.biparietalDiameter} mm</Text>
                    <Text style={styles.dataText}>Femur Length: {fetalData.measurements.femurLength} mm</Text>
                    <Text style={styles.dataText}>Head Circumference: {fetalData.measurements.headCircumference} mm</Text>
                    <Text style={styles.dataText}>Abdominal Circumference: {fetalData.measurements.abdominalCircumference} mm</Text>
                    <Text style={styles.dataText}>Growth and Development: {fetalData.growthAndDevelopment}</Text>
                    <Text style={styles.dataText}>Position: {fetalData.position}</Text>

                    <Text style={styles.sectionTitle}>Scan Image</Text>
                    <Image
                        source={require('../assets/fetal-img.png')}
                        style={styles.image}
                        resizeMode="contain"
                        onError={(error) => console.log('Image Load Error: ', error)}
                        onLoad={() => console.log('Image loaded successfully')}
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2A9D8F',
    },
    connectButton: {
        backgroundColor: '#1E90FF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    scanButton: {
        backgroundColor: '#32CD32',
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    videoContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    scanningText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    video: {
        width: 400,
        height: 200,
    },
    fetalDataContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#E76F51',
    },
    dataText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#264653',
    },
    image: {
        width: 350,
        height: 400,
    },
});

export default FetalWatchScreen;
