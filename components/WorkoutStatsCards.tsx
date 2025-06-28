import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, Clock, Target, Calendar } from 'lucide-react-native';
import { WeekStats } from '@/hooks/useWorkoutLog';

interface WorkoutStatsCardsProps {
  stats: WeekStats;
}

export function WorkoutStatsCards({ stats }: WorkoutStatsCardsProps) {
  const statsData = [
    {
      icon: Calendar,
      value: stats.workoutDays.toString(),
      unit: `/${stats.targetDays}`,
      label: 'Workout Days',
      color: '#FF6B35',
      progress: stats.workoutDays / stats.targetDays,
    },
    {
      icon: Clock,
      value: Math.floor(stats.totalDuration / 60) > 0 ? 
        `${Math.floor(stats.totalDuration / 60)}h ${stats.totalDuration % 60}m` : 
        `${stats.totalDuration}m`,
      unit: '',
      label: 'Total Time',
      color: '#F7931E',
      progress: Math.min(stats.totalDuration / 300, 1), // 5 hours target
    },
    {
      icon: Flame,
      value: stats.totalCalories.toString(),
      unit: 'kcal',
      label: 'Calories Burned',
      color: '#FF6B35',
      progress: Math.min(stats.totalCalories / 2000, 1), // 2000 cal target
    },
    {
      icon: Target,
      value: stats.averageDuration.toString(),
      unit: 'min',
      label: 'Avg Duration',
      color: '#F7931E',
      progress: Math.min(stats.averageDuration / 60, 1), // 60 min target
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>This Week's Progress</Text>
      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => {
          const StatIcon = stat.icon;
          
          return (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                  <StatIcon size={20} color={stat.color} />
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${Math.min(stat.progress * 100, 100)}%`,
                          backgroundColor: stat.color
                        }
                      ]}
                    />
                  </View>
                </View>
              </View>
              
              <View style={styles.statContent}>
                <View style={styles.statValue}>
                  <Text style={styles.value}>{stat.value}</Text>
                  <Text style={styles.unit}>{stat.unit}</Text>
                </View>
                <Text style={styles.label}>{stat.label}</Text>
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
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  unit: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});