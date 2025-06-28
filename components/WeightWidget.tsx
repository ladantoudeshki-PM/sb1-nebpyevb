import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Scale, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';

interface WeightWidgetProps {
  currentWeight?: number;
  targetWeight?: number;
  unit?: 'kg' | 'lbs';
}

export function WeightWidget({ 
  currentWeight = 70.5, 
  targetWeight = 65,
  unit = 'kg'
}: WeightWidgetProps) {
  const handlePress = () => {
    router.push('/(tabs)/weight');
  };

  const weightDifference = currentWeight - targetWeight;
  const isAboveTarget = weightDifference > 0;
  const progressPercentage = Math.max(0, Math.min(100, ((targetWeight - Math.min(currentWeight, targetWeight + 10)) / 10) * 100));

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Weight Tracking</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={handlePress}>
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#FF6B35" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.weightCard} onPress={handlePress}>
        <View style={styles.weightContent}>
          <View style={styles.weightHeader}>
            <View style={styles.iconContainer}>
              <Scale size={24} color="#FF6B35" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.currentWeight}>{currentWeight} {unit}</Text>
              <Text style={styles.weightLabel}>Current Weight</Text>
            </View>
            <View style={styles.trendContainer}>
              {isAboveTarget ? (
                <TrendingUp size={20} color="#EF4444" />
              ) : (
                <TrendingDown size={20} color="#10B981" />
              )}
              <Text style={[styles.trendValue, { color: isAboveTarget ? '#EF4444' : '#10B981' }]}>
                {Math.abs(weightDifference).toFixed(1)} {unit}
              </Text>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.targetLabel}>Target: {targetWeight} {unit}</Text>
              <Text style={styles.remainingText}>
                {isAboveTarget ? `${weightDifference.toFixed(1)} ${unit} to lose` : 'Target reached!'}
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${progressPercentage}%`,
                backgroundColor: isAboveTarget ? '#FF6B35' : '#10B981'
              }]} />
            </View>
          </View>
          
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.logButton} onPress={handlePress}>
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logButtonGradient}
              >
                <Scale size={16} color="#ffffff" />
                <Text style={styles.logButtonText}>Log Weight</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginRight: 4,
  },
  weightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  weightContent: {
    padding: 20,
    gap: 16,
  },
  weightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  currentWeight: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  weightLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  progressSection: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  remainingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionSection: {
    marginTop: 4,
  },
  logButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  logButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  logButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});