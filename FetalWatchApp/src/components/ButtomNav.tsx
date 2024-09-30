import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { NavigationProp } from '@react-navigation/native';

interface BottomNavProps {
    navigation: NavigationProp<any>;
}

const BottomNav: React.FC<BottomNavProps> = ({ navigation }) => {
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Dashboard')}>
                <Ionicons name="apps-outline" size={30} color="#FF1744" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Calendar')}>
                <Ionicons name="calendar-outline" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Health')}>
                <Ionicons name="heart-outline" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-outline" size={30} color="#000" />
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
