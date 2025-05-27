import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
  },
  
  // Variants
  default: {
    backgroundColor: theme.colors.background,
  },
  
  elevated: {
    backgroundColor: theme.colors.background,
    ...theme.shadows.md,
  },
  
  outlined: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  
  paddingSm: {
    padding: theme.spacing.sm,
  },
  
  paddingMd: {
    padding: theme.spacing.md,
  },
  
  paddingLg: {
    padding: theme.spacing.lg,
  },
});
