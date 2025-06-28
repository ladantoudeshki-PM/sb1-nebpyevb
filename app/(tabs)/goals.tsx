import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Plus, Trophy, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';
import { GoalCard } from '@/components/GoalCard';
import { ProgressRing } from '@/components/ProgressRing';

export default function GoalsScreen() {
  const [scrollY, setScrollY] = useState(0);

  const goals = [
    {
      id: 1,
      title: 'Maintain 7+ Hours Sleep',
      category: 'Sleep',
      progress: 0.85,
      target: 7,
      current: 6.8,
      unit: 'hours',
      color: '#FF6B35',
      streak: 12,
      status: 'active',
    },
    {
      id: 2,
      title: 'Drink 8 Glasses of Water',
      category: 'Hydration',
      progress: 0.75,
      target: 8,
      current: 6,
      unit: 'glasses',
      color: '#F7931E',
      streak: 8,
      status: 'active',
    },
    {
      id: 3,
      title: 'Walk 10,000 Steps',
      category: 'Exercise',
      progress: 0.68,
      target: 10000,
      current: 6800,
      unit: 'steps',
      color: '#FF6B35',
      streak: 5,
      status: 'active',
    },
    {
      id: 4,
      title: 'Meditate Daily',
      category: 'Mindfulness',
      progress: 1.0,
      target: 1,
      current: 1,
      unit: 'session',
      color: '#F7931E',
      streak: 21,
      status: 'completed',
    },
  ];

  const weeklyProgress = 0.78;
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;

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
          <Text style={styles.headerTitle}>Goals</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.progressOverview}>
            <View style={styles.progressRingContainer}>
              <ProgressRing
                progress={weeklyProgress}
                size={120}
                strokeWidth={12}
                color="#FF6B35"
              />
              <View style={styles.progressRingCenter}>
                <Text style={styles.progressPercentage}>78%</Text>
                <Text style={styles.progressLabel}>Complete</Text>
              </View>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{completedGoals}</Text>
                <Text style={styles.progressStatLabel}>Goals Achieved</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>21</Text>
                <Text style={styles.progressStatLabel}>Day Streak</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>156</Text>
                <Text style={styles.progressStatLabel}>Total Points</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Goals</Text>
            <TouchableOpacity style={styles.addGoalButton}>
              <Plus size={20} color="#FF6B35" />
              <Text style={styles.addGoalText}>Add Goal</Text>
            </TouchableOpacity>
          </View>
          
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementCard}>
              <LinearGradient
                colors={['#F7931E', '#FF6B35']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.achievementGradient}
              >
                <Trophy size={32} color="#ffffff" />
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>Hydration Hero</Text>
                  <Text style={styles.achievementDescription}>
                    Drank 8 glasses of water for 7 days straight
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.achievementCard}>
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.achievementGradient}
              >
                <CheckCircle size={32} color="#ffffff" />
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>Sleep Champion</Text>
                  <Text style={styles.achievementDescription}>
                    Maintained 7+ hours of sleep for 2 weeks
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.achievementCard}>
              <LinearGradient
                colors={['#F7931E', '#FF6B35']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.achievementGradient}
              >
                <Target size={32} color="#ffffff" />
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>Mindful Master</Text>
                  <Text style={styles.achievementDescription}>
                    21-day meditation streak achieved
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 12,
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addGoalText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginLeft: 4,
  },
  progressOverview: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  progressRingContainer: {
    position: 'relative',
    marginRight: 32,
  },
  progressRingCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  progressStats: {
    flex: 1,
  },
  progressStat: {
    marginBottom: 16,
  },
  progressStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  progressStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  achievementsContainer: {
    gap: 16,
  },
  achievementCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  achievementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  achievementContent: {
    flex: 1,
    marginLeft: 16,
  },
  achievementTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
  },
});