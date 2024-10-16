import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigationState } from '@react-navigation/native';

interface BottomNavProps {
    navigation: NavigationProp<any>;
}

const BottomNav: React.FC<BottomNavProps> = ({ navigation }) => {
    // Get the current route name from the navigation state
    const currentRoute = useNavigationState(state => state.routes[state.index].name);

    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
                <Ionicons
                    name="apps-outline"
                    size={30}
                    color={currentRoute === 'Home' ? '#FF1744' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Calendar')}>
                <Ionicons
                    name="calendar-outline"
                    size={30}
                    color={currentRoute === 'Calendar' ? '#FF1744' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('AI')}>
                <Ionicons
                    name="heart-outline"
                    size={30}
                    color={currentRoute === 'Health' ? '#FF1744' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
                <Ionicons
                    name="person-outline"
                    size={30}
                    color={currentRoute === 'Profile' ? '#FF1744' : '#000'}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    navButton: {
        alignItems: 'center',
    },
});

export default BottomNav;
