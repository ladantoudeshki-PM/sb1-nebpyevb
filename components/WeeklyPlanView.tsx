import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Dumbbell, Activity, Heart, Zap, Coffee, Moon } from 'lucide-react-native';
import { DayPlan } from '@/hooks/useWorkoutPlan';

interface WeeklyPlanViewProps {
  weeklyPlan: DayPlan[];
}

const workoutTypeIcons = {
  'upper-body': Dumbbell,
  'lower-body': Activity,
  'cardio': Heart,
  'yoga': Zap,
  'mixed': Coffee,
  'custom': Dumbbell,
};

const workoutTypeColors = {
  'upper-body': '#FF6B35',
  'lower-body': '#F7931E',
  'cardio': '#FF6B35',
  'yoga': '#F7931E',
  'mixed': '#FF6B35',
  'custom': '#6B7280',
};

export function WeeklyPlanView({ weeklyPlan }: WeeklyPlanViewProps) {
  const today = new Date().getDay();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {weeklyPlan.map((day) => {
          const isToday = day.dayOfWeek === today;
          const TypeIcon = day.isRestDay ? Moon : workoutTypeIcons[day.type as keyof typeof workoutTypeIcons] || Dumbbell;
          const color = day.isRestDay ? '#6B7280' : workoutTypeColors[day.type as keyof typeof workoutTypeColors] || '#6B7280';

          return (
            <View 
              key={day.dayOfWeek} 
              style={[
                styles.dayCard,
                isToday && styles.todayCard,
                day.isRestDay && styles.restDayCard
              ]}
            >
              <Text style={[
                styles.dayName,
                isToday && styles.todayText
              ]}>
                {day.dayName.slice(0, 3)}
              </Text>
              
              <View style={[
                styles.iconContainer,
                { backgroundColor: color + '20' }
              ]}>
                <TypeIcon size={20} color={color} />
              </View>
              
              {!day.isRestDay && (
                <>
                  <Text style={[
                    styles.workoutType,
                    isToday && styles.todayText
                  ]}>
                    {day.type === 'custom' ? day.customType || 'Custom' : 
                     day.type?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Workout'}
                  </Text>
                  
                  {day.targetDuration && (
                    <Text style={[
                      styles.duration,
                      isToday && styles.todayText
                    ]}>
                      {day.targetDuration}m
                    </Text>
                  )}
                </>
              )}
              
              {day.isRestDay && (
                <Text style={[
                  styles.restText,
                  isToday && styles.todayText
                ]}>
                  Rest
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollContainer: {
    marginHorizontal: -8,
  },
  dayCard: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  todayCard: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF6B35',
  },
  restDayCard: {
    backgroundColor: '#F3F4F6',
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  todayText: {
    color: '#FF6B35',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutType: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  duration: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  restText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
});