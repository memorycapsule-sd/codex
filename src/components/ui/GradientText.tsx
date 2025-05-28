import React from 'react';
import { Text, StyleSheet, TextStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { theme } from '../../theme';

interface GradientTextProps {
  text: string;
  gradientType?: keyof typeof theme.gradients;
  style?: TextStyle;
}

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  gradientType = 'purpleTheme',
  style,
}) => {
  const colors = theme.gradients[gradientType] as any;
  
  // On web, we can't use MaskedView, so we fall back to regular text
  if (Platform.OS === 'web') {
    return (
      <Text style={[styles.text, { color: colors[0] }, style]}>
        {text}
      </Text>
    );
  }

  return (
    <MaskedView
      maskElement={
        <Text style={[styles.text, style]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.text, style, { opacity: 0 }]}>
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
