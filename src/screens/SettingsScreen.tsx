import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface SettingItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'navigation' | 'toggle' | 'button';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const SettingsScreen: React.FC = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [promptReminders, setPromptReminders] = useState(false);
  const [facebookConnected, setFacebookConnected] = useState(true);
  const [instagramConnected, setInstagramConnected] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => Alert.alert('Logged out') },
      ]
    );
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile Information',
          icon: 'person',
          type: 'navigation',
          onPress: () => Alert.alert('Profile', 'Edit profile information'),
        },
        {
          id: 'subscription',
          title: 'Premium Subscription',
          icon: 'star',
          type: 'navigation',
          onPress: () => Alert.alert('Subscription', 'Manage subscription'),
        },
        {
          id: 'password',
          title: 'Change Password',
          icon: 'lock-closed',
          type: 'navigation',
          onPress: () => Alert.alert('Password', 'Change password'),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push',
          title: 'Push Notifications',
          icon: 'notifications',
          type: 'toggle',
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          id: 'email',
          title: 'Email Notifications',
          icon: 'mail',
          type: 'toggle',
          value: emailNotifications,
          onToggle: setEmailNotifications,
        },
        {
          id: 'reminders',
          title: 'Daily Prompt Reminders',
          icon: 'time',
          type: 'toggle',
          value: promptReminders,
          onToggle: setPromptReminders,
        },
      ],
    },
    {
      title: 'Connected Services',
      items: [
        {
          id: 'facebook',
          title: 'Facebook',
          icon: 'logo-facebook',
          type: 'toggle',
          value: facebookConnected,
          onToggle: setFacebookConnected,
        },
        {
          id: 'instagram',
          title: 'Instagram',
          icon: 'logo-instagram',
          type: 'toggle',
          value: instagramConnected,
          onToggle: setInstagramConnected,
        },
        {
          id: 'google-photos',
          title: 'Google Photos',
          icon: 'images',
          type: 'button',
          onPress: () => Alert.alert('Google Photos', 'Connect to Google Photos'),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'data-privacy',
          title: 'Data Privacy',
          icon: 'shield-checkmark',
          type: 'navigation',
          onPress: () => Alert.alert('Privacy', 'Data privacy settings'),
        },
        {
          id: 'sharing',
          title: 'Default Sharing Settings',
          icon: 'share',
          type: 'navigation',
          onPress: () => Alert.alert('Sharing', 'Default sharing settings'),
        },
        {
          id: 'two-factor',
          title: 'Two-Factor Authentication',
          icon: 'key',
          type: 'toggle',
          value: twoFactorAuth,
          onToggle: setTwoFactorAuth,
        },
      ],
    },
    {
      title: 'Help & Support',
      items: [
        {
          id: 'faq',
          title: 'FAQ',
          icon: 'help-circle',
          type: 'navigation',
          onPress: () => Alert.alert('FAQ', 'Frequently asked questions'),
        },
        {
          id: 'support',
          title: 'Contact Support',
          icon: 'headset',
          type: 'navigation',
          onPress: () => Alert.alert('Support', 'Contact our support team'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          icon: 'chatbubble-ellipses',
          type: 'navigation',
          onPress: () => Alert.alert('Feedback', 'Send us your feedback'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem, isLast: boolean) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, !isLast && styles.settingItemBorder]}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingItemLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon} size={16} color={theme.colors.primary} />
          </View>
          <Text style={styles.settingItemTitle}>{item.title}</Text>
        </View>
        
        <View style={styles.settingItemRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          )}
          {item.type === 'navigation' && (
            <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
          )}
          {item.type === 'button' && item.id === 'google-photos' && (
            <TouchableOpacity style={styles.connectButton} onPress={item.onPress}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => Alert.alert('Back', 'Navigate back')}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg' }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section with Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingCard}>
            {/* Profile Info */}
            <TouchableOpacity style={[styles.profileInfo, styles.settingItemBorder]}>
              <View style={styles.profileInfoLeft}>
                <Image
                  source={{ uri: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg' }}
                  style={styles.profileInfoImage}
                />
                <View>
                  <Text style={styles.profileName}>Emma Johnson</Text>
                  <Text style={styles.profileEmail}>emma.johnson@example.com</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {/* Other Account Settings */}
            {settingSections[0].items.map((item, index) => 
              renderSettingItem(item, index === settingSections[0].items.length - 1)
            )}
          </View>
        </View>

        {/* Other Sections */}
        {settingSections.slice(1).map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingCard}>
              {section.items.map((item, index) => 
                renderSettingItem(item, index === section.items.length - 1)
              )}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>MemoryCapsule v1.2.3</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutButton}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.dark,
    marginLeft: theme.spacing.sm,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.dark,
    marginBottom: theme.spacing.sm,
  },
  settingCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    ...theme.shadows.sm,
    overflow: 'hidden',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  profileInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfoImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: theme.spacing.sm,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  profileEmail: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  settingItemTitle: {
    fontSize: 16,
    color: theme.colors.dark,
  },
  settingItemRight: {
    alignItems: 'center',
  },
  connectButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 16,
  },
  connectButtonText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  appVersion: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  logoutButton: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
    marginTop: theme.spacing.sm,
  },
});

export default SettingsScreen;
