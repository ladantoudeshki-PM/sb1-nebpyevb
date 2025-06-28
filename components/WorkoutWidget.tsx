import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell, Flame, Target } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { FastingWidget } from './FastingWidget';
import { MoodWidget } from './MoodWidget';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming 
} from 'react-native-reanimated';

export function WorkoutWidget() {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const iconScale = useSharedValue(1);

  const workoutStats = {
    caloriesBurned: 245,
    workoutsThisWeek: 4,
    targetWorkouts: 5,
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: iconScale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  const handleLogWorkout = () => {
    // Trigger animation
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 8, stiffness: 100 })
    );
    
    iconScale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withSpring(1, { damping: 6, stiffness: 120 })
    );
    
    rotation.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
    
    router.push('/(tabs)/workout');
  };

  const handlePressIn = () => {
    setIsPressed(true);
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    setIsPressed(false);
    scale.value = withSpring(1, { damping: 8, stiffness: 100 });
  };

  return (
    <>
      <View style={styles.container}>
        {/* Mood Widget */}
        <MoodWidget />

        {/* Workout Widget - Column Layout */}
        <View style={styles.workoutSection}>
          <View style={styles.workoutCard}>
            {/* Log Workout Button */}
            <Animated.View style={[styles.logWorkoutSection, animatedButtonStyle]}>
              <TouchableOpacity 
                style={[styles.logButton, isPressed && styles.logButtonPressed]} 
                onPress={handleLogWorkout}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
              >
                <View style={styles.logButtonContent}>
                  <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                    <Dumbbell size={16} color="#FF6B35" />
                    <View style={styles.pulseRing} />
                  </Animated.View>
                  <Text style={styles.logButtonText}>Log Workout</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Calories Burned */}
            <View style={styles.statSectionRow}>
              <View style={styles.statIcon}>
                <Flame size={18} color="#FF6B35" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{workoutStats.caloriesBurned}</Text>
                <Text style={styles.statLabel}>Calories Burned</Text>
              </View>
              
              {/* This Week - positioned on the right */}
              <View style={styles.statIconRight}>
                <Target size={18} color="#F7931E" />
              </View>
              <View style={styles.statContentRight}>
                <Text style={styles.statValue}>
                  {workoutStats.workoutsThisWeek}/{workoutStats.targetWorkouts}
                </Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
    height: 120, // Fixed height to match mood widget
  },
  workoutSection: {
    flex: 1,
    marginLeft: 8, // Move slightly to the right to center with fasting widget
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFE4D6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    height: 120,
    justifyContent: 'space-between',
    padding: 12,
  },
  logWorkoutSection: {
    alignItems: 'center',
  },
  logButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF8F5',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFE4D6',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logButtonPressed: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF6B35',
    shadowOpacity: 0.2,
  },
  logButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  pulseRing: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    opacity: 0.3,
  },
  logButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  statSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statIconRight: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  statContent: {
    flex: 1,
  },
  statContentRight: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});