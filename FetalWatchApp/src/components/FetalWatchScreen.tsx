import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Alert, Platform, PermissionsAndroid, Linking, Modal, TouchableOpacity } from 'react-native';
import BleManager from 'react-native-ble-manager';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

BleManager.start({ showAlert: false });

const FetalWatchScreen = () => {
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
    const [isLocationEnabled, setIsLocationEnabled] = useState(false);
    const [scanButtonEnabled, setScanButtonEnabled] = useState(false);

    useEffect(() => {
        checkBluetoothAndLocation();
    }, []);

    const checkBluetoothAndLocation = async () => {
        if (Platform.OS === 'android') {
            // Check Bluetooth status
            BluetoothStateManager.getState().then((bluetoothState) => {
                if (bluetoothState === 'PoweredOn') {
                    setIsBluetoothEnabled(true);
                } else {
                    setIsBluetoothEnabled(false);
                    showBluetoothPrompt();
                }
            });

            // Check Location status
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location to use Bluetooth.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            ).then(granted => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    LocationServicesDialogBox.checkLocationServicesIsEnabled({
                        message: "Use Location? This app requires location services to function properly.",
                        ok: "YES",
                        cancel: "NO"
                    }).then((success) => {
                        if (success.enabled) {
                            setIsLocationEnabled(true);
                        } else {
                            setIsLocationEnabled(false);
                            showLocationPrompt();
                        }
                    }).catch((error) => {
                        setIsLocationEnabled(false);
                        showLocationPrompt();
                    });
                } else {
                    setIsLocationEnabled(false);
                    showLocationPrompt();
                }
            });
        }

        // Enable Scan button if both are enabled
        if (isBluetoothEnabled && isLocationEnabled) {
            setScanButtonEnabled(true);
        } else {
            setScanButtonEnabled(false);
        }
    };

    const showBluetoothPrompt = () => {
        Alert.alert(
            "Enable Bluetooth",
            "Bluetooth is required to scan for devices. Please enable Bluetooth.",
            [{ text: "Open Settings", onPress: () => Linking.openSettings() }],
            { cancelable: false }
        );
    };

    const showLocationPrompt = () => {
        Alert.alert(
            "Enable Location",
            "Location services are required to use Bluetooth. Please enable location services.",
            [{ text: "Open Settings", onPress: () => Linking.openSettings() }],
            { cancelable: false }
        );
    };

    const scan = () => {
        BleManager.scan([], 3, true).then(() => {
            console.log('Scanning...');
        });
    };

    return (
        <View style={styles.container}>
            {scanButtonEnabled ? (
                <Button title="Scan" onPress={scan} />
            ) : (
                <Text>Please enable Bluetooth and Location to start scanning.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FetalWatchScreen;