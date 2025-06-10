import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { CapsuleResponse, CapsuleEntry } from '../types/capsule';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

// Define the type for the route params
// TODO: Integrate this with a central navigation types file if available
type CapsuleViewingScreenRouteParams = {
  CapsuleViewingScreen: {
    capsuleResponse: CapsuleResponse;
  };
};

// Define the type for the route prop using the params
type Props = {
  route: RouteProp<CapsuleViewingScreenRouteParams, 'CapsuleViewingScreen'>;
  // navigation prop can be added here if needed for further navigation from this screen
};

const CapsuleViewingScreen: React.FC<Props> = ({ route }) => {
  const { capsuleResponse } = route.params;

  const renderEntryContent = (entry: CapsuleEntry) => {
    switch (entry.type) {
      case 'text':
        return <Text style={styles.entryText}>{entry.textContent}</Text>;
      case 'photo':
        return <Image source={{ uri: entry.mediaUri }} style={styles.entryImage} resizeMode="cover" />;
      case 'video':
        // TODO: Implement video player
        return (
          <View style={styles.mediaPlaceholder}>
            <Ionicons name="videocam-outline" size={48} color={theme.colors.gray[500]} />
            <Text style={styles.mediaPlaceholderText}>Video (id: {entry.id})</Text>
            {entry.metadata?.filename && <Text style={styles.metadataText}>Filename: {entry.metadata.filename}</Text>}
          </View>
        );
      case 'audio':
        // TODO: Implement audio player
        return (
          <View style={styles.mediaPlaceholder}>
            <Ionicons name="mic-outline" size={48} color={theme.colors.gray[500]} />
            <Text style={styles.mediaPlaceholderText}>Audio (id: {entry.id})</Text>
            {entry.metadata?.filename && <Text style={styles.metadataText}>Filename: {entry.metadata.filename}</Text>}
            {entry.metadata?.duration && <Text style={styles.metadataText}>Duration: {Math.floor(entry.metadata.duration / 60)}:{String(Math.floor(entry.metadata.duration % 60)).padStart(2, '0')}</Text>}
          </View>
        );
      default:
        return <Text>Unsupported entry type: {entry.type}</Text>;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{capsuleResponse.capsuleTitle}</Text>
        <Text style={styles.date}>
          Created: {new Date(capsuleResponse.createdAt).toLocaleDateString()} | Last Updated: {new Date(capsuleResponse.updatedAt).toLocaleDateString()}
        </Text>
        <Text style={styles.promptIdText}>Prompt ID: {capsuleResponse.promptId}</Text>
      </View>

      {capsuleResponse.entries.map((entry) => (
        <View key={entry.id} style={styles.entryContainer}>
          <Text style={styles.entryTypeHeader}>Entry Type: {entry.type}</Text>
          {renderEntryContent(entry)}
          <View style={styles.metadataContainer}>
            <Text style={styles.metadataTitle}>Metadata:</Text>
            <Text style={styles.metadataText}>Entry ID: {entry.id}</Text>
            <Text style={styles.metadataText}>Uploaded: {new Date(entry.metadata.uploadedAt).toLocaleString()}</Text>
            {entry.metadata.userDescription && <Text style={styles.metadataText}>Description: {entry.metadata.userDescription}</Text>}
            {entry.metadata.dateTaken && <Text style={styles.metadataText}>Date Taken: {new Date(entry.metadata.dateTaken).toLocaleString()}</Text>}
            {entry.metadata.location && <Text style={styles.metadataText}>Location: {entry.metadata.location.latitude}, {entry.metadata.location.longitude}</Text>}
            {entry.metadata.size && <Text style={styles.metadataText}>Size: {(entry.metadata.size / (1024*1024)).toFixed(2)} MB</Text>}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
  },
  headerContainer: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[300],
    backgroundColor: theme.colors.white,
  },
  title: {
    fontSize: theme.typography.size['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.sm,
  },
  date: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs,
  },
  promptIdText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gray[500],
  },
  entryContainer: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  entryTypeHeader: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    paddingBottom: theme.spacing.sm,
  },
  entryText: {
    fontSize: theme.typography.size.base,
    color: theme.colors.dark,
    lineHeight: theme.typography.lineHeight.relaxed,
    paddingVertical: theme.spacing.sm,
  },
  entryImage: {
    width: '100%',
    height: 200, // Adjust as needed
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  mediaPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    minHeight: 100,
    marginBottom: theme.spacing.md,
  },
  mediaPlaceholderText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.size.sm,
    color: theme.colors.gray[700],
  },
  metadataContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  metadataTitle: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs,
  },
  metadataText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gray[600],
    marginBottom: 2,
  },
});

export default CapsuleViewingScreen;
