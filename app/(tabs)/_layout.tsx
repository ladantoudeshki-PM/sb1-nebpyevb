import { Tabs } from 'expo-router';
import { Chrome as Home, ChartBar as BarChart3, Target, User, Heart, Clock, Dumbbell, Scale } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 20,
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 88,
          paddingBottom: 20,
          paddingTop: 12,
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={16} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: 'Mood',
          tabBarIcon: ({ size, color }) => (
            <Heart size={16} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fasting"
        options={{
          title: 'Fasting',
          tabBarIcon: ({ size, color }) => (
            <Clock size={16} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ size, color }) => (
            <Dumbbell size={16} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          title: 'Weight',
          tabBarIcon: ({ size, color }) => (
            <Scale size={16} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={16} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ size, color }) => (
            <Target size={16} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={16} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}