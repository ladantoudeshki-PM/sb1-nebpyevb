import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Timer, Zap, ChevronRight, Play } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';

interface FastingWidgetProps {
  isActive?: boolean;
  startTime?: Date | null;
  targetHours?: number;
}

export function FastingWidget({ 
  isActive = true, 
  startTime = new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago for demo
  targetHours = 16 
}: FastingWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    router.push('/(tabs)/fasting');
  };

  const calculateTimeRemaining = () => {
    if (!isActive || !startTime) return { hours: 0, minutes: 0, progress: 0 };
    
    const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes
    const targetMinutes = targetHours * 60;
    const remaining = Math.max(0, targetMinutes - elapsed);
    
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    const progress = Math.min(elapsed / targetMinutes, 1);
    
    return { hours, minutes, progress };
  };

  const { hours, minutes, progress } = calculateTimeRemaining();
  const isCompleted = progress >= 1;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Intermittent Fasting</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={handlePress}>
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#FF6B35" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.fastingCard} onPress={handlePress}>
        {isActive ? (
          // Active fasting state
          <View style={styles.activeState}>
            <LinearGradient
              colors={isCompleted ? ['#10B981', '#059669'] : ['#FF6B35', '#F7931E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.activeGradient}
            >
              <View style={styles.activeContent}>
                <View style={styles.activeHeader}>
                  <View style={styles.statusIndicator}>
                    {isCompleted ? (
                      <Zap size={16} color="#ffffff" />
                    ) : (
                      <Timer size={16} color="#ffffff" />
                    )}
                    <Text style={styles.statusText}>
                      {isCompleted ? 'Fast Complete!' : 'Fasting Active'}
                    </Text>
                  </View>
                  <Text style={styles.targetText}>{targetHours}h goal</Text>
                </View>
                
                <View style={styles.progressSection}>
                  {isCompleted ? (
                    <>
                      <Text style={styles.currentDuration}>Complete! 🎉</Text>
                      <Text style={styles.elapsedLabel}>Well done!</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.currentDuration}>{hours}h {minutes}m</Text>
                      <Text style={styles.elapsedLabel}>remaining</Text>
                    </>
                  )}
                  
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                  </View>
                  
                  <Text style={styles.progressText}>
                    {Math.round(progress * 100)}% complete
                  </Text>
                </View>
                
                <View style={styles.manageButton}>
                  <Timer size={14} color="#ffffff" />
                  <Text style={styles.manageButtonText}>Manage Fast</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        ) : (
          // Inactive state
          <View style={styles.inactiveState}>
            <View style={styles.inactiveHeader}>
              <View style={styles.iconContainer}>
                <Clock size={24} color="#FF6B35" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.inactiveTitle}>Start Your Fast</Text>
                <Text style={styles.inactiveSubtitle}>Begin your intermittent fasting journey</Text>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.startButton}>
                <LinearGradient
                  colors={['#FF6B35', '#F7931E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startButtonGradient}
                >
                  <Play size={16} color="#ffffff" />
                  <Text style={styles.startButtonText}>Start Fasting</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  fastingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Active state styles
  activeState: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  activeGradient: {
    padding: 20,
  },
  activeContent: {
    gap: 16,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  targetText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
  },
  progressSection: {
    alignItems: 'center',
    gap: 8,
  },
  currentDuration: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  elapsedLabel: {
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
    marginTop: 4,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
  },
  manageButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  
  // Inactive state styles
  inactiveState: {
    padding: 20,
    gap: 20,
  },
  inactiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  inactiveTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  inactiveSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  buttonContainer: {
    gap: 12,
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});