import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components/navigation/TabBar';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import TimelineScreen from '../screens/TimelineScreen';
import CreateScreen from '../screens/CreateScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import nested navigators
import { CapsulesNavigator } from './CapsulesNavigator';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Timeline" 
        component={TimelineScreen}
        options={{
          tabBarLabel: 'Timeline',
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen 
        name="Capsules" 
        component={CapsulesNavigator}
        options={{
          tabBarLabel: 'Capsules',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
