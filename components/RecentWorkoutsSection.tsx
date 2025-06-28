import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Flame, Dumbbell, Activity, Heart, Zap, Coffee } from 'lucide-react-native';
import { Exercise } from '@/hooks/useWorkoutLog';

interface RecentWorkoutsSectionProps {
  workouts: Exercise[];
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

export function RecentWorkoutsSection({ workouts }: RecentWorkoutsSectionProps) {
  if (workouts.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        <View style={styles.emptyState}>
          <Dumbbell size={48} color="#E5E7EB" />
          <Text style={styles.emptyStateTitle}>No workouts logged yet</Text>
          <Text style={styles.emptyStateText}>
            Start logging your exercises to track your progress
          </Text>
        </View>
      </View>
    );
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = new Date().getTime();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.workoutsContainer}>
        {workouts.map((workout) => {
          const TypeIcon = workoutTypeIcons[workout.type] || Dumbbell;
          const color = workoutTypeColors[workout.type] || '#6B7280';

          return (
            <View key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <View style={styles.workoutHeaderLeft}>
                  <View style={[styles.typeIcon, { backgroundColor: color + '20' }]}>
                    <TypeIcon size={20} color={color} />
                  </View>
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.workoutType}>
                      {workout.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                </View>
                <Text style={styles.relativeTime}>{formatRelativeTime(workout.timestamp)}</Text>
              </View>

              <View style={styles.workoutStats}>
                <View style={styles.statItem}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.statText}>{workout.duration} min</Text>
                </View>
                {workout.caloriesBurned && (
                  <View style={styles.statItem}>
                    <Flame size={16} color="#F7931E" />
                    <Text style={styles.statText}>{workout.caloriesBurned} kcal</Text>
                  </View>
                )}
              </View>

              {workout.notes && (
                <Text style={styles.workoutNotes} numberOfLines={2}>
                  {workout.notes}
                </Text>
              )}

              <View style={styles.workoutFooter}>
                <Text style={styles.workoutTime}>{workout.time}</Text>
                <Text style={styles.workoutDate}>{workout.date}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  workoutsContainer: {
    gap: 12,
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  workoutType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  relativeTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  workoutNotes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  workoutDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});