import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/auth';
import { GradientText } from '../components/ui/GradientText';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Main: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignInScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signIn, signInWithGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsSigningIn(true);
      await signIn(email.trim(), password);
      // Navigation will be handled automatically by AuthNavigationWrapper
    } catch (error: any) {
      const errorMessage = AuthService.getAuthErrorMessage(error);
      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    if (provider === 'Google') {
      try {
        setIsSigningIn(true);
        await signInWithGoogle();
        Alert.alert('Success', 'Successfully signed in with Google!');
      } catch (error: any) {
        console.error('Google sign-in error:', error);
        Alert.alert('Error', error.message || 'Failed to sign in with Google');
      } finally {
        setIsSigningIn(false);
      }
    } else {
      Alert.alert('Coming Soon', `${provider} sign-in will be available soon!`);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality will be available soon!');
  };

  const handleCreateAccount = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <GradientText text="Welcome Back" gradientType="purpleTheme" style={styles.title} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#999999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignIn}
            style={styles.signInButtonContainer}
            disabled={isSigningIn}
          >
            <LinearGradient
              colors={theme.gradients.purpleTheme as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signInButton}
            >
              {isSigningIn ? (
                <Text style={styles.signInButtonText}>Signing In...</Text>
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialButtons}>
          <TouchableOpacity
            onPress={() => handleSocialSignIn('Google')}
            style={styles.socialButtonContainer}
          >
            <LinearGradient
              colors={theme.gradients.purpleTheme as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.socialButton}
            >
              <Ionicons name="logo-google" size={20} color={theme.colors.white} />
              <Text style={styles.gradientButtonText}>Google</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocialSignIn('Apple')}
            style={styles.socialButtonContainer}
          >
            <LinearGradient
              colors={theme.gradients.purpleTheme as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.socialButton}
            >
              <Ionicons name="logo-apple" size={20} color={theme.colors.white} />
              <Text style={styles.gradientButtonText}>Apple</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Create Account */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.createAccountText} onPress={handleCreateAccount}>
              Create Account
            </Text>
          </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing['3xl'], // Increased top padding to avoid iPhone camera bar
    paddingBottom: theme.spacing['2xl'],
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.dark,
    marginBottom: theme.spacing.md,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.sm,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  signInButtonContainer: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  signInButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.button.fontSize,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    fontSize: 14,
    color: theme.colors.gray[500],
    paddingHorizontal: theme.spacing.sm,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButtonContainer: {
    flex: 0.48,
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
  gradientButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
  },
  footer: {
    marginTop: theme.spacing.xl,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.gray[600],
  },
  createAccountText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
