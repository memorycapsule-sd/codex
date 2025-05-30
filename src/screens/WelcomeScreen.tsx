import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { GradientText } from '../components/ui/GradientText';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Main: undefined;
  CapsuleView: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;



interface Feature {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const features: Feature[] = [
  { icon: 'create-outline', label: 'Guided Prompts' },
  { icon: 'images-outline', label: 'Multi-Media' },
  { icon: 'shield-checkmark-outline', label: 'Private & Secure' },
];

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    navigation.navigate('SignUp');
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // Navigation will be handled by the AuthNavigator based on authentication state
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      Alert.alert('Sign In Failed', error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = () => {
    Alert.alert('Apple Sign In', 'Apple authentication will be implemented soon');
  };

  const handleEmailSignIn = () => {
    navigation.navigate('SignIn');
  };

  const renderFeatures = () => {
    return (
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <LinearGradient
              colors={theme.gradients.purpleTheme as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.featureIconContainer}
            >
              <Ionicons
                name={feature.icon}
                size={24}
                color={theme.colors.white}
              />
            </LinearGradient>
            <Text style={styles.featureLabel}>{feature.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Logo and App Name */}
        <View style={styles.brandingContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="hourglass" size={36} color={theme.colors.white} />
          </View>
          <GradientText text="MemoryCapsule" gradientType="purpleTheme" style={styles.appName} />
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            MemoryCapsule helps you document your life stories through guided prompts and organize them into meaningful collections that you can revisit and share with loved ones.
          </Text>
        </View>

        {/* Features */}
        {renderFeatures()}

        {/* Sign In Options */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            style={styles.socialButtonContainer}
            disabled={isLoading}
          >
            <LinearGradient
              colors={theme.gradients.purpleTheme}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.socialButton]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <Ionicons name="logo-google" size={20} color={theme.colors.white} />
              )}
              <Text style={[styles.socialButtonText, styles.gradientButtonText]}>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAppleSignIn}
            style={styles.socialButtonContainer}
          >
            <LinearGradient
              colors={theme.gradients.purpleTheme}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.socialButton]}
            >
              <Ionicons name="logo-apple" size={20} color={theme.colors.white} />
              <Text style={[styles.socialButtonText, styles.gradientButtonText]}>
                Continue with Apple
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={[styles.socialButton, styles.emailButton]}
            onPress={handleEmailSignIn}
          >
            <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.socialButtonText, styles.emailButtonText]}>
              Continue with Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleGetStarted} style={styles.createAccountButton}>
            <Text style={styles.createAccountText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing['3xl'], // Increased top padding to avoid iPhone camera bar
    paddingBottom: theme.spacing['2xl'],
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.primary,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.gray[500],
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.xl,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.dark,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  pageNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  navButton: {
    padding: theme.spacing.sm,
  },
  actionContainer: {
    marginBottom: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.button.fontSize,
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
  },
  signInText: {
    textAlign: 'center',
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.gray[600],
  },
  signInLink: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  signInTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.dark,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  socialButtonContainer: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  emailButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
  },
  socialButtonText: {
    fontSize: theme.typography.button.fontSize,
    fontWeight: '500',
    marginLeft: theme.spacing.sm,
  },
  gradientButtonText: {
    color: theme.colors.white,
  },
  emailButtonText: {
    color: theme.colors.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray[300],
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.gray[500],
    fontSize: theme.typography.caption.fontSize,
  },
  createAccountButton: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  createAccountText: {
    color: theme.colors.primary,
    fontSize: theme.typography.button.fontSize,
    fontWeight: '500',
  },

});
