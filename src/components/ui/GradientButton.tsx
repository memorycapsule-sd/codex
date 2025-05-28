import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  gradientType?: keyof typeof theme.gradients;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  gradientType = 'buttonTheme',
  style,
  textStyle,
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
}) => {
  const colors = disabled 
    ? ['#D1D5DB', '#9CA3AF'] 
    : theme.gradients[gradientType];
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      style={[styles.button, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons 
                name={icon} 
                size={16} 
                color="#FFFFFF" 
                style={styles.iconLeft} 
              />
            )}
            <Text style={[styles.text, textStyle]}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <Ionicons 
                name={icon} 
                size={16} 
                color="#FFFFFF" 
                style={styles.iconRight} 
              />
            )}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.primary,
  },
  gradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing.sm,
  },
  iconRight: {
    marginLeft: theme.spacing.sm,
  },
});
