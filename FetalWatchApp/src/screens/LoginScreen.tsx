import React from 'react';
import { View, ImageBackground, StyleSheet, ScrollView, Image } from 'react-native';
import { Button, Text, Surface, useTheme, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setEmail, setPassword, handleLogin } from '../slices/loginSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { globalStyles } from '../theme';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { email, password, errorMessage, loading } = useSelector((state: RootState) => state.login);

    // Handle login press
    const handleLoginPress = async () => {
        dispatch(handleLogin({ email, password }));
    };

    // Bypass login and go directly to home
    const handleQuickAccess = () => {
        navigation.replace('Home');
    };

    return (
        <ImageBackground
            source={require('../assets/fetal-img.png')}
            style={styles.background}
            resizeMode="cover"
            fallback={<View style={[styles.background, { backgroundColor: theme.colors.background }]} />}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        {/* Logo Section */}
                        <View style={styles.logoContainer}>
                            <Image source={require('../assets/fetalwatch-logo.png')} style={styles.logo} />
                            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                                FetalWatch
                            </Text>
                            <Text variant="bodyLarge" style={styles.subtitle}>
                                Comprehensive Maternal Health Monitoring
                            </Text>
                        </View>

                        {/* Form */}
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={(text) => dispatch(setEmail(text))}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={(text) => dispatch(setPassword(text))}
                            style={styles.input}
                            mode="outlined"
                            secureTextEntry
                        />
                        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

                        <View style={styles.buttonContainer}>
                            {/* Login Button */}
                            <Button
                                mode="contained"
                                onPress={handleLoginPress}
                                loading={loading}
                                style={styles.button}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                            
                            {/* Quick Access Button */}
                            <Button
                                mode="contained"
                                onPress={handleQuickAccess}
                                style={styles.button}
                                icon="rocket-launch"
                            >
                                Quick Access
                            </Button>
                            
                            {/* Registration Button */}
                            <Button
                                mode="outlined"
                                onPress={() => navigation.navigate('Registration')}
                                style={styles.button}
                            >
                                Create Account
                            </Button>

                            <View style={styles.separator}>
                                <Text variant="bodySmall" style={styles.separatorText}>or access features directly</Text>
                            </View>

                            <View style={styles.quickAccessGrid}>
                                <Button
                                    mode="contained-tonal"
                                    onPress={() => navigation.navigate('Calendar')}
                                    style={styles.gridButton}
                                    icon="calendar"
                                >
                                    Calendar
                                </Button>
                                <Button
                                    mode="contained-tonal"
                                    onPress={() => navigation.navigate('Patient')}
                                    style={styles.gridButton}
                                    icon="account-multiple"
                                >
                                    Patients
                                </Button>
                                <Button
                                    mode="contained-tonal"
                                    onPress={() => navigation.navigate('FetalWatch', { patientId: '' })}
                                    style={styles.gridButton}
                                    icon="heart-pulse"
                                >
                                    Monitor
                                </Button>
                                <Button
                                    mode="contained-tonal"
                                    onPress={() => navigation.navigate('AI', { fetalWatchId: '' })}
                                    style={styles.gridButton}
                                    icon="brain"
                                >
                                    AI Analysis
                                </Button>
                            </View>
                        </View>
                    </Surface>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    card: {
        padding: 20,
        borderRadius: 12,
        elevation: 4,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 16,
        opacity: 0.7,
    },
    input: {
        marginBottom: 12,
    },
    buttonContainer: {
        marginTop: 8,
    },
    button: {
        marginVertical: 6,
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    separatorText: {
        flex: 1,
        textAlign: 'center',
        opacity: 0.5,
    },
    quickAccessGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridButton: {
        width: '48%',
        marginBottom: 8,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
});

export default LoginScreen;
