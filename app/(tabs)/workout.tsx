import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, Clock, Target, Dumbbell, Activity, Heart, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { WeeklyPlanModal } from '../../components/WeeklyPlanModal';
import { LogExerciseModal } from '../../components/LogExerciseModal';
import { useWorkoutPlan } from '@/hooks/useWorkoutPlan';
import { useWorkoutLog } from '@/hooks/useWorkoutLog';
import { WeeklyPlanView } from '../../components/WeeklyPlanView';
import { TodayWorkoutCard } from '../../components/TodayWorkoutCard';
import { WorkoutStatsCards } from '../../components/WorkoutStatsCards';
import { RecentWorkoutsSection } from '../../components/RecentWorkoutsSection';

export default function WorkoutScreen() {
  const [scrollY, setScrollY] = useState(0);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const { weeklyPlan, updateWeeklyPlan } = useWorkoutPlan();
  const { workouts, addWorkout, getTodayWorkouts, getWeekStats } = useWorkoutLog();

  const todayWorkouts = getTodayWorkouts();
  const weekStats = getWeekStats();
  const todayPlan = weeklyPlan.find(day => day.dayOfWeek === new Date().getDay());

  const handleLogExercise = (exercise: any) => {
    addWorkout(exercise);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollIndicatorContainer}>
        <View style={styles.scrollIndicator}>
          <View style={[styles.scrollThumb, { 
            transform: [{ translateY: Math.min(scrollY * 0.5, 100) }] 
          }]} />
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Planner</Text>
        </View>

        {/* Prominent Plan Week Button */}
        <View style={styles.planWeekSection}>
          <TouchableOpacity 
            style={styles.planWeekButton}
            onPress={() => setShowPlanModal(true)}
          >
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.planWeekGradient}
            >
              <Calendar size={24} color="#ffffff" />
              <View style={styles.planWeekContent}>
                <Text style={styles.planWeekTitle}>Plan Your Week</Text>
                <Text style={styles.planWeekSubtitle}>Set your workout schedule and goals</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Weekly Stats */}
        <WorkoutStatsCards stats={weekStats} />

        {/* Today's Workout Plan */}
        <TodayWorkoutCard 
          todayPlan={todayPlan}
          todayWorkouts={todayWorkouts}
          onLogExercise={() => setShowLogModal(true)}
        />

        {/* Weekly Plan Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week's Plan</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowPlanModal(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <WeeklyPlanView weeklyPlan={weeklyPlan} />
        </View>

        {/* Recent Workouts */}
        <RecentWorkoutsSection workouts={workouts.slice(0, 5)} />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => setShowLogModal(true)}
            >
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                style={styles.quickActionGradient}
              >
                <Plus size={24} color="#ffffff" />
                <Text style={styles.quickActionText}>Log Exercise</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => setShowPlanModal(true)}
            >
              <LinearGradient
                colors={['#F7931E', '#FF6B35']}
                style={styles.quickActionGradient}
              >
                <Calendar size={24} color="#ffffff" />
                <Text style={styles.quickActionText}>Update Plan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Target size={24} color="#FF6B35" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Stay Consistent</Text>
                <Text style={styles.tipDescription}>
                  Consistency beats intensity. Aim for regular workouts rather than sporadic intense sessions.
                </Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Heart size={24} color="#F7931E" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Listen to Your Body</Text>
                <Text style={styles.tipDescription}>
                  Rest when you need it. Recovery is just as important as the workout itself.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <WeeklyPlanModal
        visible={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentPlan={weeklyPlan}
        onSavePlan={updateWeeklyPlan}
      />

      <LogExerciseModal
        visible={showLogModal}
        onClose={() => setShowLogModal(false)}
        onLogExercise={handleLogExercise}
        suggestedType={todayPlan?.type}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollIndicatorContainer: {
    position: 'absolute',
    right: 4,
    top: 60,
    bottom: 60,
    width: 4,
    zIndex: 1000,
  },
  scrollIndicator: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    position: 'relative',
  },
  scrollThumb: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  planWeekSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  planWeekButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  planWeekGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  planWeekContent: {
    flex: 1,
    marginLeft: 16,
  },
  planWeekTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  planWeekSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
  },
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
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tipContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});