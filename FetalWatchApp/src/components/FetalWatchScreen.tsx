import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Button, Alert, Platform, PermissionsAndroid, Linking, Modal, TouchableOpacity } from 'react-native';
import BleManager from 'react-native-ble-manager';

BleManager.start({ showAlert: false });

const FetalWatchScreen = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState(null);
  const [characteristics, setCharacteristics] = useState([]);
  const [value, setValue] = useState('');
  const [bluetoothModalVisible, setBluetoothModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const deviceRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to use Bluetooth.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      });
    }
  }, []);

  const showBluetoothPrompt = () => {
    setBluetoothModalVisible(true);
  };

  const showLocationPrompt = () => {
    setLocationModalVisible(true);
  };

  const handleBluetoothSettings = () => {
    Linking.openSettings();
    setBluetoothModalVisible(false);
  };

  const handleLocationSettings = () => {
    Linking.openSettings();
    setLocationModalVisible(false);
  };

  const scan = () => {
    BleManager.scan([], 3, true).then(() => {
      console.log('Scanning...');
    });
  };

  const connect = () => {
    BleManager.connect(device.id).then(() => {
      console.log('Connected!');
      setIsConnected(true);
      BleManager.discoverAllServicesAndCharacteristicsForDevice(device.id).then((characteristics) => {
        setCharacteristics(characteristics.characteristics);
        console.log('Characteristics discovered: ', characteristics);
      });
    }).catch((error) => {
      console.log('Failed to connect: ', error);
    });
  };

  const disconnect = () => {
    BleManager.disconnect(device.id).then(() => {
      console.log('Disconnected!');
      setIsConnected(false);
    });
  };

  const writeValue = (characteristic) => {
    const valueToWrite = 'Hello from React Native!'; // Replace with your desired value
    BleManager.write(device.id, characteristic.service, characteristic.characteristic, valueToWrite, 'utf-8')
      .then(() => {
        console.log('Value written successfully!');
      })
      .catch((error) => {
        console.log('Failed to write value: ', error);
      });
  };

  const readValue = (characteristic) => {
    BleManager.read(device.id, characteristic.service, characteristic.characteristic)
      .then((data) => {
        const value = data.value.toString('utf-8'); // Decode the data as UTF-8
        setValue(value);
        console.log('Value read: ', value);
      })
      .catch((error) => {
        console.log('Failed to read value: ', error);
      });
  };

  const handleDevicePress = (device) => {
    setDevice(device);
    connect();
  };

  return (
    <View style={styles.container}>
      <Button title="Check Bluetooth & Location" onPress={() => {
        showBluetoothPrompt();
        showLocationPrompt();
      }} />

      {/* Bluetooth Prompt Modal */}
      <Modal
        transparent={true}
        visible={bluetoothModalVisible}
        onRequestClose={() => setBluetoothModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enable Bluetooth</Text>
            <Text style={styles.modalText}>Please turn on Bluetooth in your system settings.</Text>
            <TouchableOpacity style={styles.button} onPress={handleBluetoothSettings}>
              <Text style={styles.buttonText}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setBluetoothModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Prompt Modal */}
      <Modal
        transparent={true}
        visible={locationModalVisible}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enable Location</Text>
            <Text style={styles.modalText}>Please enable location services in your system settings.</Text>
            <TouchableOpacity style={styles.button} onPress={handleLocationSettings}>
              <Text style={styles.buttonText}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setLocationModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Button title="Scan" onPress={scan} />
      {device && (
        <View>
          <Text style={styles.title}>Device: {device.name}</Text>
          <Text style={styles.title}>ID: {device.id}</Text>
          {isConnected ? (
            <Button title="Disconnect" onPress={disconnect} />
          ) : (
            <Button title="Connect" onPress={connect} />
          )}
          {characteristics.length > 0 && (
            <View>
              <Text style={styles.title}>Characteristics:</Text>
              {characteristics.map((characteristic, index) => (
                <View key={index} style={styles.characteristic}>
                  <Text style={styles.characteristicText}>
                    {characteristic.characteristic}
                  </Text>
                  <Button title="Write" onPress={() => writeValue(characteristic)} />
                  <Button title="Read" onPress={() => readValue(characteristic)} />
                </View>
              ))}
              {value !== '' && (
                <Text style={styles.value}>Value: {value}</Text>
              )}
            </View>
          )}
        </View>
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
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  characteristic: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  characteristicText: {
    marginRight: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FetalWatchScreen;
