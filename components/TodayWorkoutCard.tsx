import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, CircleCheck as CheckCircle, Clock, Target, Moon } from 'lucide-react-native';
import { DayPlan } from '@/hooks/useWorkoutPlan';
import { Exercise } from '@/hooks/useWorkoutLog';

interface TodayWorkoutCardProps {
  todayPlan?: DayPlan;
  todayWorkouts: Exercise[];
  onLogExercise: () => void;
}

export function TodayWorkoutCard({ todayPlan, todayWorkouts, onLogExercise }: TodayWorkoutCardProps) {
  const totalDuration = todayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const targetDuration = todayPlan?.targetDuration || 0;
  const progress = targetDuration > 0 ? Math.min(totalDuration / targetDuration, 1) : 0;

  if (!todayPlan) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Workout</Text>
        <View style={styles.noPlanCard}>
          <Text style={styles.noPlanTitle}>No workout planned for today</Text>
          <Text style={styles.noPlanText}>
            Set up your weekly plan or log a spontaneous workout
          </Text>
          <TouchableOpacity style={styles.logButton} onPress={onLogExercise}>
            <Plus size={16} color="#FF6B35" />
            <Text style={styles.logButtonText}>Log Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (todayPlan.isRestDay) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Workout</Text>
        <View style={styles.restDayCard}>
          <Moon size={32} color="#6B7280" />
          <Text style={styles.restDayTitle}>Rest Day</Text>
          <Text style={styles.restDayText}>
            Take time to recover and recharge for tomorrow's workout
          </Text>
          {todayWorkouts.length > 0 && (
            <View style={styles.bonusWorkouts}>
              <Text style={styles.bonusTitle}>Bonus workouts today:</Text>
              {todayWorkouts.map((workout) => (
                <Text key={workout.id} style={styles.bonusWorkout}>
                  • {workout.name} ({workout.duration}m)
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  const isCompleted = progress >= 1;
  const workoutType = todayPlan.type === 'custom' ? todayPlan.customType : todayPlan.type;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Today's Workout</Text>
      <View style={styles.workoutCard}>
        <LinearGradient
          colors={isCompleted ? ['#10B981', '#059669'] : ['#FF6B35', '#F7931E']}
          style={styles.workoutGradient}
        >
          <View style={styles.workoutHeader}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutType}>
                {workoutType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Workout'}
              </Text>
              <Text style={styles.workoutTarget}>
                Target: {targetDuration} minutes
              </Text>
            </View>
            {isCompleted && (
              <CheckCircle size={24} color="#ffffff" />
            )}
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTime}>{totalDuration}m</Text>
              <Text style={styles.progressLabel}>completed</Text>
            </View>
            
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}% of target
            </Text>
          </View>

          {todayWorkouts.length > 0 && (
            <View style={styles.workoutsToday}>
              <Text style={styles.workoutsTodayTitle}>Today's exercises:</Text>
              {todayWorkouts.slice(0, 2).map((workout) => (
                <Text key={workout.id} style={styles.workoutItem}>
                  • {workout.name} ({workout.duration}m)
                </Text>
              ))}
              {todayWorkouts.length > 2 && (
                <Text style={styles.workoutItem}>
                  +{todayWorkouts.length - 2} more
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={onLogExercise}>
            <Plus size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>
              {todayWorkouts.length > 0 ? 'Add Exercise' : 'Start Workout'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  workoutCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  workoutGradient: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutType: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  workoutTarget: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTime: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
  },
  workoutsToday: {
    marginBottom: 16,
  },
  workoutsTodayTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  workoutItem: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  noPlanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  noPlanTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  noPlanText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
    gap: 6,
  },
  logButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  restDayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  restDayTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 8,
  },
  restDayText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  bonusWorkouts: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  bonusTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  bonusWorkout: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
});