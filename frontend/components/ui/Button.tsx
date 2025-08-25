import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { SHADOWS } from '../../components/constants/Theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style, textStyle, disabled }) => {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  // Responsive sizing: minWidth and height scale with screen width
  const minWidth = Math.max(90, Math.min(130, screenWidth * 0.35));
  const height = Math.max(32, Math.min(40, screenWidth * 0.11));
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.white, borderColor: colors.primary, minWidth, height },
        disabled && { opacity: 0.6 },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: colors.primary }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderRadius: 6,
    // minWidth and height are now set dynamically
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(10,126,164,0.12)',
  ...SHADOWS.light,
    marginLeft: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

export default Button;
