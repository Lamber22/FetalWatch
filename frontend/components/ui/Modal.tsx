import React, { useEffect, useRef } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, lightTheme, darkTheme } from '../constants/Theme';
import { useColorScheme } from '../../hooks/useColorScheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = 'scale',
}: ModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show modal with animation
      if (animationType === 'slide') {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 65,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (animationType === 'fade') {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Scale animation (default)
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      // Hide modal with animation
      if (animationType === 'slide') {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: screenHeight,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (animationType === 'fade') {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Scale animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.3,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [visible, animationType]);

  const getModalStyle = () => {
    const baseStyle = {
      backgroundColor: theme.white,
      borderRadius: size === 'fullscreen' ? 0 : SIZES.radius * 2,
      ...SHADOWS.dark,
    };

    switch (size) {
      case 'small':
        return {
          ...baseStyle,
          width: Math.min(screenWidth * 0.8, 300),
          maxHeight: screenHeight * 0.6,
        };
      case 'medium':
        return {
          ...baseStyle,
          width: Math.min(screenWidth * 0.9, 400),
          maxHeight: screenHeight * 0.8,
        };
      case 'large':
        return {
          ...baseStyle,
          width: Math.min(screenWidth * 0.95, 500),
          maxHeight: screenHeight * 0.9,
        };
      case 'fullscreen':
        return {
          ...baseStyle,
          width: screenWidth,
          height: screenHeight,
          margin: 0,
          borderRadius: 0,
        };
      default:
        return {
          ...baseStyle,
          width: Math.min(screenWidth * 0.9, 400),
          maxHeight: screenHeight * 0.8,
        };
    }
  };

  const getModalTransform = () => {
    if (animationType === 'slide') {
      return [{ translateY: slideAnim }];
    } else if (animationType === 'fade') {
      return [];
    } else {
      return [{ scale: scaleAnim }];
    }
  };

  const getModalOpacity = () => {
    if (animationType === 'fade') {
      return opacityAnim;
    }
    return 1;
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[
          styles.overlay, 
          { 
            opacity: fadeAnim, 
            backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)' 
          }
        ]}> 
          <StatusBar
            backgroundColor={isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)'}
            barStyle={isDark ? 'light-content' : 'dark-content'}
            translucent
          />
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                getModalStyle(),
                {
                  transform: getModalTransform(),
                  opacity: getModalOpacity(),
                },
              ]}
            >
              {/* Header */}
              <View style={[
                styles.header, 
                { 
                  backgroundColor: theme.white, 
                  borderBottomColor: theme.border 
                }
              ]}> 
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                  {title}
                </Text>
                {showCloseButton && (
                  <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: theme.lightGray }]}
                    onPress={onClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color={theme.gray} />
                  </TouchableOpacity>
                )}
              </View>
              {/* Content */}
              <View style={[styles.content, { backgroundColor: theme.white }]}> 
                {typeof children === 'string' ? (
                  <Text style={{ color: theme.text }}>{children}</Text>
                ) : children}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  modalContainer: {
    boxShadow: '0px 10px 20px rgba(0,0,0,0.25)',
  ...SHADOWS.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    flex: 1,
    marginRight: SIZES.base,
  },
  closeButton: {
    padding: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  content: {
    borderBottomLeftRadius: SIZES.radius * 2,
    borderBottomRightRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    maxHeight: '80%',
  },
});
