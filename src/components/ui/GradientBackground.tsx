import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface GradientBackgroundProps {
  gradientType?: keyof typeof theme.gradients;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  gradientType = 'memoryTheme',
  style,
  children,
}) => {
  const colors = theme.gradients[gradientType];
  
  return (
    <LinearGradient
      colors={colors as any}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
