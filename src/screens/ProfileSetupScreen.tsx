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
import { AuthService } from '../services/auth';
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

type InterestCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export default function ProfileSetupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const interestCategories: InterestCategory[] = [
    {
      id: 'childhood',
      name: 'Childhood',
      icon: 'happy',
      description: 'Early memories and experiences',
    },
    {
      id: 'education',
      name: 'Education',
      icon: 'school',
      description: 'School, college, and learning',
    },
    {
      id: 'career',
      name: 'Career',
      icon: 'briefcase',
      description: 'Work and professional life',
    },
    {
      id: 'family',
      name: 'Family',
      icon: 'people',
      description: 'Relationships and loved ones',
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: 'airplane',
      description: 'Adventures and explorations',
    },
    {
      id: 'hobbies',
      name: 'Hobbies',
      icon: 'heart',
      description: 'Passions and interests',
    },
  ];

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleComplete = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your display name');
      return;
    }

    if (selectedInterests.length === 0) {
      Alert.alert('Error', 'Please select at least one interest');
      return;
    }

    try {
      setIsLoading(true);

      // Update user profile with the collected information
      await AuthService.updateUserProfile({
        displayName: displayName.trim(),
        birthYear: birthYear.trim() || undefined,
        interests: selectedInterests,
      });

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
            <Text style={styles.label}>Display Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="How should we call you?"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birth Year (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1985"
              value={birthYear}
              onChangeText={setBirthYear}
              keyboardType="number-pad"
              maxLength={4}
            />
            <Text style={styles.inputHint}>
              This helps us provide age-appropriate memory prompts
            </Text>
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.interestsSection}>
          <Text style={styles.sectionTitle}>Select Your Interests *</Text>
          <Text style={styles.sectionDescription}>
            Choose categories that matter to you. We'll use these to personalize your memory prompts.
          </Text>

          <View style={styles.interestsGrid}>
            {interestCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.interestCard,
                  !selectedInterests.includes(category.id) && styles.interestCardUnselected,
                ]}
                onPress={() => toggleInterest(category.id)}
              >
                {selectedInterests.includes(category.id) ? (
                  <LinearGradient
                    colors={theme.gradients.purpleTheme as any}
                    style={styles.interestCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.interestIconContainer}>
                      <Ionicons
                        name={category.icon as any}
                        size={24}
                        color="#FFFFFF"
                      />
                    </View>
                    <Text style={[styles.interestName, styles.interestNameSelected]}>
                      {category.name}
                    </Text>
                    <Text style={[styles.interestDescription, styles.interestDescriptionSelected]}>
                      {category.description}
                    </Text>
                  </LinearGradient>
                ) : (
                  <>
                    <View style={styles.interestIconContainer}>
                      <Ionicons
                        name={category.icon as any}
                        size={24}
                        color="#7C67CB"
                      />
                    </View>
                    <Text style={styles.interestName}>
                      {category.name}
                    </Text>
                    <Text style={styles.interestDescription}>
                      {category.description}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
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
