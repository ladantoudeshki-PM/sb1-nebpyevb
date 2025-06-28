import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { WeeklyChart } from '@/components/WeeklyChart';
import { MetricCard } from '@/components/MetricCard';

export default function AnalyticsScreen() {
  const [scrollY, setScrollY] = useState(0);

  const metrics = [
    {
      id: 1,
      title: 'Average Mood',
      value: '4.2',
      unit: '/5',
      change: '+0.3',
      trend: 'up',
      color: '#FF6B35',
    },
    {
      id: 2,
      title: 'Sleep Quality',
      value: '7.8',
      unit: 'hrs',
      change: '+0.5',
      trend: 'up',
      color: '#F7931E',
    },
    {
      id: 3,
      title: 'Water Intake',
      value: '6.2',
      unit: 'glasses',
      change: '-0.8',
      trend: 'down',
      color: '#FF6B35',
    },
    {
      id: 4,
      title: 'Steps',
      value: '8.2k',
      unit: 'daily',
      change: '0',
      trend: 'stable',
      color: '#F7931E',
    },
  ];

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
          <Text style={styles.headerTitle}>Analytics</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.metricsGrid}>
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mood Trends</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <WeeklyChart />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Correlations</Text>
          <View style={styles.correlationCard}>
            <View style={styles.correlationHeader}>
              <Text style={styles.correlationTitle}>Sleep & Mood</Text>
              <View style={styles.correlationBadge}>
                <Text style={styles.correlationBadgeText}>Strong</Text>
              </View>
            </View>
            <Text style={styles.correlationDescription}>
              Your mood improves by 0.8 points for every extra hour of sleep
            </Text>
            <View style={styles.correlationChart}>
              <View style={styles.correlationBar} />
              <Text style={styles.correlationValue}>85% correlation</Text>
            </View>
          </View>

          <View style={styles.correlationCard}>
            <View style={styles.correlationHeader}>
              <Text style={styles.correlationTitle}>Exercise & Energy</Text>
              <View style={[styles.correlationBadge, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.correlationBadgeText, { color: '#F7931E' }]}>Moderate</Text>
              </View>
            </View>
            <Text style={styles.correlationDescription}>
              Higher step counts are linked to better energy levels
            </Text>
            <View style={styles.correlationChart}>
              <View style={[styles.correlationBar, { width: '65%', backgroundColor: '#F7931E' }]} />
              <Text style={styles.correlationValue}>65% correlation</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights & Recommendations</Text>
          <View style={styles.insightCard}>
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightGradient}
            >
              <TrendingUp size={32} color="#ffffff" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Mood Improvement</Text>
                <Text style={styles.insightText}>
                  Your mood has improved by 15% over the past month. Keep up the great work!
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.insightCard}>
            <LinearGradient
              colors={['#F7931E', '#FF6B35']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightGradient}
            >
              <BarChart3 size={32} color="#ffffff" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Sleep Pattern</Text>
                <Text style={styles.insightText}>
                  Try going to bed 30 minutes earlier for better sleep quality.
                </Text>
              </View>
            </LinearGradient>
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
  viewAllButton: {
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
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  correlationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  correlationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  correlationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  correlationBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  correlationBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  correlationDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  correlationChart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  correlationBar: {
    height: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
    width: '85%',
    marginRight: 12,
  },
  correlationValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  insightCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  insightGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  insightContent: {
    flex: 1,
    marginLeft: 16,
  },
  insightTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
  },
});