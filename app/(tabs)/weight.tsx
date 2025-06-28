import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Scale, Target, TrendingUp, TrendingDown, Plus, Calendar, Award } from 'lucide-react-native';
import { WeightModal } from '@/components/WeightModal';
import { WeightGoalModal } from '@/components/WeightGoalModal';

export default function WeightScreen() {
  const [scrollY, setScrollY] = useState(0);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(70.5);
  const [targetWeight, setTargetWeight] = useState(65);
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 3 months from now
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  // Sample weight data for the chart (last 6 months)
  const weightData = [
    { month: 'Jul', weight: 75.2, x: 0 },
    { month: 'Aug', weight: 74.1, x: 16.67 },
    { month: 'Sep', weight: 72.8, x: 33.33 },
    { month: 'Oct', weight: 71.5, x: 50 },
    { month: 'Nov', weight: 70.9, x: 66.67 },
    { month: 'Dec', weight: 70.5, x: 83.33 },
  ];

  const handleWeightSave = (weight: number) => {
    setCurrentWeight(weight);
  };

  const handleGoalSave = (weight: number, date: Date) => {
    setTargetWeight(weight);
    setTargetDate(date);
  };

  const weightDifference = currentWeight - targetWeight;
  const isAboveTarget = weightDifference > 0;
  const progressPercentage = Math.max(0, Math.min(100, ((targetWeight - Math.min(currentWeight, targetWeight + 10)) / 10) * 100));

  // Calculate chart dimensions and positions
  const chartWidth = 300;
  const chartHeight = 100;
  const minWeight = Math.min(...weightData.map(d => d.weight)) - 1;
  const maxWeight = Math.max(...weightData.map(d => d.weight)) + 1;
  const weightRange = maxWeight - minWeight;

  const getYPosition = (weight: number) => {
    return chartHeight - ((weight - minWeight) / weightRange) * chartHeight;
  };

  const renderLineChart = () => {
    const points = weightData.map(d => ({
      x: (d.x / 100) * chartWidth,
      y: getYPosition(d.weight),
      weight: d.weight
    }));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weight Trend (Last 6 Months)</Text>
        
        <View style={styles.lineChart}>
          {/* Grid lines */}
          <View style={styles.chartGrid}>
            {[0, 25, 50, 75, 100].map((percent) => (
              <View
                key={percent}
                style={[styles.gridLine, { top: `${percent}%` }]}
              />
            ))}
          </View>

          {/* Chart content */}
          <View style={styles.chartContent}>
            {/* Draw lines between points */}
            {points.slice(0, -1).map((point, index) => {
              const nextPoint = points[index + 1];
              const deltaX = nextPoint.x - point.x;
              const deltaY = nextPoint.y - point.y;
              const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

              return (
                <View
                  key={index}
                  style={[
                    styles.chartLine,
                    {
                      left: point.x,
                      top: point.y,
                      width: length,
                      transform: [{ rotate: `${angle}deg` }],
                    }
                  ]}
                />
              );
            })}

            {/* Draw points and labels */}
            <View style={styles.chartPointContainer}>
              {points.map((point, index) => (
                <View key={index}>
                  <View
                    style={[
                      styles.chartPoint,
                      {
                        left: point.x - 4,
                        top: point.y - 4,
                        borderColor: index === points.length - 1 ? '#FF6B35' : '#F7931E',
                      }
                    ]}
                  />
                  <Text
                    style={[
                      styles.pointLabel,
                      {
                        left: point.x - 15,
                        top: point.y - 25,
                      }
                    ]}
                  >
                    {point.weight.toFixed(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Month labels */}
          <View style={styles.monthLabels}>
            {weightData.map((data, index) => (
              <Text
                key={index}
                style={[
                  styles.monthLabel,
                  {
                    left: (data.x / 100) * chartWidth - 15,
                  }
                ]}
              >
                {data.month}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
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
          <Text style={styles.headerTitle}>Weight Tracking</Text>
        </View>

        {/* Current Weight Card */}
        <View style={styles.section}>
          <View style={styles.currentWeightCard}>
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.weightGradient}
            >
              <View style={styles.weightContent}>
                <View style={styles.weightHeader}>
                  <Scale size={32} color="#ffffff" />
                  <View style={styles.weightInfo}>
                    <Text style={styles.currentWeightLabel}>Current Weight</Text>
                    <Text style={styles.currentWeightValue}>{currentWeight} {unit}</Text>
                  </View>
                  <View style={styles.trendContainer}>
                    {isAboveTarget ? (
                      <TrendingUp size={20} color="#ffffff" />
                    ) : (
                      <TrendingDown size={20} color="#ffffff" />
                    )}
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
                      backgroundColor: '#ffffff'
                    }]} />
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.logButton} 
                  onPress={() => setShowWeightModal(true)}
                >
                  <Plus size={16} color="#ffffff" />
                  <Text style={styles.logButtonText}>Log Weight</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Weight Chart */}
        <View style={styles.section}>
          {renderLineChart()}
        </View>

        {/* Goal Setting */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weight Goal</Text>
            <TouchableOpacity 
              style={styles.editGoalButton}
              onPress={() => setShowGoalModal(true)}
            >
              <Text style={styles.editGoalText}>Edit Goal</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Target size={24} color="#FF6B35" />
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Target Weight</Text>
                <Text style={styles.goalValue}>{targetWeight} {unit}</Text>
              </View>
              <View style={styles.goalDate}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.goalDateText}>
                  {targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            </View>
            
            <View style={styles.goalProgress}>
              <Text style={styles.goalProgressText}>
                {isAboveTarget 
                  ? `${weightDifference.toFixed(1)} ${unit} to go` 
                  : 'Goal achieved! 🎉'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <TrendingDown size={24} color="#10B981" />
              <Text style={styles.statValue}>2.7 {unit}</Text>
              <Text style={styles.statLabel}>Lost This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Award size={24} color="#F7931E" />
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Days Tracked</Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Success</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Scale size={24} color="#FF6B35" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Weigh Consistently</Text>
                <Text style={styles.tipDescription}>
                  Weigh yourself at the same time each day for accurate tracking
                </Text>
              </View>
            </View>
            <View style={styles.tipCard}>
              <Target size={24} color="#F7931E" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Set Realistic Goals</Text>
                <Text style={styles.tipDescription}>
                  Aim for 0.5-1kg per week for sustainable weight loss
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <WeightModal
        visible={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        currentWeight={currentWeight}
        targetWeight={targetWeight}
        unit={unit}
        onSave={handleWeightSave}
      />

      <WeightGoalModal
        visible={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        currentWeight={currentWeight}
        targetWeight={targetWeight}
        targetDate={targetDate}
        unit={unit}
        onSave={handleGoalSave}
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
  editGoalButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  editGoalText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  currentWeightCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  weightGradient: {
    padding: 20,
  },
  weightContent: {
    gap: 16,
  },
  weightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weightInfo: {
    flex: 1,
    marginLeft: 16,
  },
  currentWeightLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  currentWeightValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  trendContainer: {
    padding: 8,
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
    color: '#ffffff',
    opacity: 0.8,
  },
  remainingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  logButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  lineChart: {
    height: 140,
    position: 'relative',
  },
  chartGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  chartContent: {
    position: 'relative',
    height: 100,
    marginBottom: 20,
  },
  chartLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#FF6B35',
    transformOrigin: 'left center',
  },
  chartPointContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  chartPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointLabel: {
    position: 'absolute',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    width: 30,
  },
  monthLabels: {
    position: 'relative',
    height: 20,
  },
  monthLabel: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    width: 30,
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
    marginLeft: 16,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  goalDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goalDateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  goalProgress: {
    alignItems: 'center',
  },
  goalProgressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
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