import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Bell, Plus, TrendingUp, Droplets, Moon, Footprints } from 'lucide-react-native';
import { StatsCard } from '@/components/StatsCard';
import { FastingWidget } from '@/components/FastingWidget';
import { WorkoutWidget } from '@/components/WorkoutWidget';
import { NutritionWidget } from '@/components/NutritionWidget';
import { WeightWidget } from '@/components/WeightWidget';
import { WaterIntakeModal } from '@/components/WaterIntakeModal';
import { SleepModal } from '@/components/SleepModal';
import { useMoodState } from '@/hooks/useMoodState';

export default function HomeScreen() {
  const [waterModalVisible, setWaterModalVisible] = useState(false);
  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [currentWaterIntake, setCurrentWaterIntake] = useState(6);
  const [currentSleep, setCurrentSleep] = useState({
    hours: 7.5,
    quality: 'good' as 'good' | 'poor' | null
  });
  const [fastingState, setFastingState] = useState({
    isActive: false,
    currentDuration: "0h 0m",
    targetHours: 16,
    progress: 0
  });
  const targetWaterIntake = 8;
  const { currentMood } = useMoodState();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleWaterSave = (amount: number) => {
    setCurrentWaterIntake(amount);
  };

  const handleSleepSave = (sleepData: { hours: number; quality: 'good' | 'poor' }) => {
    setCurrentSleep(sleepData);
  };

  const handleFastingQuickStart = (hours: number) => {
    setFastingState(prev => ({
      ...prev,
      targetHours: hours,
      isActive: true,
      currentDuration: "0h 1m",
      progress: 0
    }));
    
    // Navigate to fasting tab after starting
    setTimeout(() => {
      // router.push('/(tabs)/fasting');
    }, 500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.orangeSection}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good morning, Sarah!</Text>
              <Text style={styles.date}>{currentDate}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.orangeContent}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Overview</Text>
            </View>
            
            <View style={styles.statsGrid}>
              <StatsCard
                icon={<Droplets size={24} color="#FF6B35" />}
                value={currentWaterIntake.toString()}
                unit="glasses"
                label="Water"
                progress={currentWaterIntake / targetWaterIntake}
                color="#FF6B35"
                isWhiteBackground={true}
                onPress={() => setWaterModalVisible(true)}
              />
              <StatsCard
                icon={<Moon size={24} color="#F7931E" />}
                value={currentSleep.hours.toString()}
                unit="hours"
                label="Sleep"
                progress={currentSleep.hours / 10} // Assuming 10 hours is ideal
                color="#F7931E"
                isWhiteBackground={true}
                onPress={() => setSleepModalVisible(true)}
              />
              <StatsCard
                icon={<Footprints size={24} color="#FF6B35" />}
                value="8,432"
                unit="steps"
                label="Steps"
                progress={0.68}
                color="#FF6B35"
                isWhiteBackground={true}
              />
              <StatsCard
                icon={<TrendingUp size={24} color="#F7931E" />}
                value={fastingState.isActive ? fastingState.currentDuration : "Ready"}
                unit={fastingState.isActive ? "elapsed" : ""}
                label="Fasting"
                progress={fastingState.progress}
                color="#F7931E"
                isWhiteBackground={true}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.whiteSection}>
        {/* Scroll Indicator */}
        <View style={styles.scrollIndicator}>
          <View style={styles.scrollDots}>
            <View style={[styles.scrollDot, styles.activeDot]} />
            <View style={styles.scrollDot} />
            <View style={styles.scrollDot} />
          </View>
          <Text style={styles.scrollHint}>Swipe up for more</Text>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <WorkoutWidget />
          <NutritionWidget />
          <FastingWidget
            isActive={fastingState.isActive}
            currentDuration={fastingState.currentDuration}
            targetHours={fastingState.targetHours}
            progress={fastingState.progress}
            onQuickStart={handleFastingQuickStart}
          />
          <WeightWidget />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Insight</Text>
            </View>
            
            <View style={styles.insightCard}>
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.insightGradient}
              >
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2' }}
                  style={styles.insightImage}
                />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Great Progress!</Text>
                  <Text style={styles.insightText}>
                    You're 85% closer to your weekly sleep goal. Keep it up!
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </View>

      <WaterIntakeModal
        visible={waterModalVisible}
        onClose={() => setWaterModalVisible(false)}
        currentIntake={currentWaterIntake}
        targetIntake={targetWaterIntake}
        onSave={handleWaterSave}
      />

      <SleepModal
        visible={sleepModalVisible}
        onClose={() => setSleepModalVisible(false)}
        currentSleep={currentSleep}
        onSave={handleSleepSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeSection: {
    height: '50%',
  },
  safeArea: {
    paddingHorizontal: 16,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  orangeContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 20,
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
    color: '#ffffff',
  },
  sectionTitleWhite: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  addButtonWhite: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  insightCard: {
    borderRadius: 16,
    overflow: 'hidden',
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
  insightImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
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
  scrollIndicator: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scrollDots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  scrollDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    backgroundColor: '#FF6B35',
    width: 20,
  },
  scrollHint: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});