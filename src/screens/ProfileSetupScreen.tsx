import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import AuthService from '../services/auth';
import { GradientText } from '../components/ui/GradientText';
import { GradientButton } from '../components/ui/GradientButton';

type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  ProfileSetup: undefined;
  Main: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileSetupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, refreshUserProfile } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | null>(null);
  const [privacySetting, setPrivacySetting] = useState<'public' | 'private'>('private');
  const [username, setUsername] = useState('');
  const [usageIntent, setUsageIntent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your display name.');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated. Please sign in again.');
      return;
    }

    try {
      setIsLoading(true);

      // Update user profile with the collected information
      await AuthService.updateUserProfile(user.uid, {
        name: displayName.trim(),
        birthday: birthday.trim() ? new Date(birthday.trim()).getTime() : undefined,
        gender: gender || 'prefer-not-to-say',
        privacySetting: privacySetting,
        username: username.trim(),
        usageIntent: usageIntent.trim(),
      });

      await refreshUserProfile();
      // Navigation to Main will be handled automatically by AuthNavigationWrapper
      // since the profile is now complete
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#3D3A50" />
        </TouchableOpacity>
        <GradientText text="Create Profile" style={styles.title} />
        <View style={styles.spacer} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>Step 2 of 3</Text>
          <Text style={styles.progressLabel}>Personalize Your Experience</Text>
        </View>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={theme.gradients.purpleTheme as any}
            style={styles.progressFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <Text style={styles.sectionDescription}>
            Add a photo to personalize your profile (optional)
          </Text>
          <TouchableOpacity
            style={styles.profilePictureContainer}
            onPress={() => console.log('Select profile picture')}
          >
            <View style={styles.profilePicturePlaceholder}>
              <Ionicons name="camera" size={32} color="#7C67CB" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Basic Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              placeholder="How you'll appear to others"
              placeholderTextColor="#999999"
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birthday (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999999"
              value={birthday}
              onChangeText={setBirthday}
            />
            <Text style={styles.inputHint}>Your age helps us personalize your experience.</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender (Optional)</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={[styles.optionButton, gender === 'male' && styles.optionButtonSelected]}
                onPress={() => setGender('male')}>
                <Text style={[styles.optionButtonText, gender === 'male' && styles.optionButtonTextSelected]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, gender === 'female' && styles.optionButtonSelected]}
                onPress={() => setGender('female')}>
                <Text style={[styles.optionButtonText, gender === 'female' && styles.optionButtonTextSelected]}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, gender === 'non-binary' && styles.optionButtonSelected]}
                onPress={() => setGender('non-binary')}>
                <Text style={[styles.optionButtonText, gender === 'non-binary' && styles.optionButtonTextSelected]}>Non-binary</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  gender === 'prefer-not-to-say' && styles.optionButtonSelected,
                ]}
                onPress={() => setGender('prefer-not-to-say')}>
                <Text
                  style={[
                    styles.optionButtonText,
                    gender === 'prefer-not-to-say' && styles.optionButtonTextSelected,
                  ]}>
                  Prefer not to say
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Default Privacy</Text>
            <View style={styles.optionGroup}>
              <TouchableOpacity
                style={[styles.optionButton, privacySetting === 'private' && styles.optionButtonSelected]}
                onPress={() => setPrivacySetting('private')}>
                <Text style={[styles.optionButtonText, privacySetting === 'private' && styles.optionButtonTextSelected]}>Private</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, privacySetting === 'public' && styles.optionButtonSelected]}
                onPress={() => setPrivacySetting('public')}>
                <Text style={[styles.optionButtonText, privacySetting === 'public' && styles.optionButtonTextSelected]}>Public</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.inputHint}>You can change this for each capsule later.</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a unique username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <Text style={styles.inputHint}>This will be part of your public profile URL. e.g., memorycapsule.app/username</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Goals for Memory Capsule (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="e.g., Preserve stories for my kids, consolidate my memories..."
              value={usageIntent}
              onChangeText={setUsageIntent}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.inputHint}>How do you envision using Memory Capsule?</Text>
          </View>
        </View>
      </ScrollView>

      {/* Complete Button */}
      <View style={styles.buttonContainer}>
        <GradientButton
          title="Complete Setup"
          onPress={handleComplete}
          loading={isLoading}
          style={styles.continueButton}
        />
        <Text style={styles.skipText}>
          You can always update these later in Settings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D3A50',
  },
  spacer: {
    width: 32,
  },
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C67CB',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    width: '66%', // 2 of 3 steps
  },
  content: {
    flex: 1,
  },
  profilePictureSection: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3D3A50',
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  profilePictureContainer: {
    marginTop: theme.spacing.sm,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F9F7FF',
    borderWidth: 1,
    borderColor: '#7C67CB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3D3A50',
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
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: theme.spacing.xs,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: '#7C67CB',
    borderColor: '#7C67CB',
  },
  optionButtonText: {
    color: '#3D3A50',
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  interestsSection: {
    marginBottom: theme.spacing.lg,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  interestCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  interestCardUnselected: {
    borderColor: '#E5E7EB',
  },
  interestCardGradient: {
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  interestIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  interestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D3A50',
    marginBottom: 4,
  },
  interestNameSelected: {
    color: '#FFFFFF',
  },
  interestDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  interestDescriptionSelected: {
    color: '#F9F7FF',
  },
  buttonContainer: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  continueButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C67CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: theme.spacing.sm,
  },
  skipText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    marginTop: theme.spacing.md,
  },
});
