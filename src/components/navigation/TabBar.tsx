import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const getTabIcon = (routeName: string, focused: boolean) => {
    const iconColor = focused ? theme.colors.primary : theme.colors.gray[400];
    const size = 24;

    switch (routeName) {
      case 'Home':
        return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={iconColor} />;
      case 'Timeline':
        return <Ionicons name={focused ? 'time' : 'time-outline'} size={size} color={iconColor} />;
      case 'Create':
        return <Ionicons name="add" size={28} color={theme.colors.text.inverse} />;
      case 'Capsules':
        return <Ionicons name={focused ? 'archive' : 'archive-outline'} size={size} color={iconColor} />;
      case 'Settings':
        return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={iconColor} />;
      default:
        return <Ionicons name="home-outline" size={size} color={iconColor} />;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return 'Home';
      case 'Timeline':
        return 'Timeline';
      case 'Create':
        return '';
      case 'Capsules':
        return 'Capsules';
      case 'Settings':
        return 'Settings';
      default:
        return routeName;
    }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = getTabLabel(route.name);
        const isFocused = state.index === index;
        const isCreateTab = route.name === 'Create';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        if (isCreateTab) {
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.createTab}
            >
              <View style={styles.createButton}>
                {getTabIcon(route.name, isFocused)}
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            {getTabIcon(route.name, isFocused)}
            {label && (
              <Text style={[
                styles.label,
                { color: isFocused ? theme.colors.primary : theme.colors.gray[400] }
              ]}>
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingBottom: theme.spacing.lg, // Extra padding for safe area
    height: theme.layout.tabBar.height,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
  
  createTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20, // Elevate the create button
  },
  
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  
  label: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginTop: 2,
  },
});
