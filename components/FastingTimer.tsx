import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import Svg, { Circle } from 'react-native-svg';

interface FastingTimerProps {
  isActive: boolean;
  startTime: Date | null;
  targetHours: number;
}

export function FastingTimer({ isActive, startTime, targetHours }: FastingTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const targetSeconds = targetHours * 3600;
        const currentProgress = Math.min(elapsed / targetSeconds, 1);

        setElapsedTime(elapsed);
        setProgress(currentProgress);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, startTime, targetHours]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeRemaining = () => {
    const targetSeconds = targetHours * 3600;
    const remaining = Math.max(targetSeconds - elapsedTime, 0);
    return remaining;
  };

  const size = 320;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress * circumference);

  const isCompleted = progress >= 1;
  const timeRemaining = getTimeRemaining();

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isCompleted ? '#FF6B35' : '#F7931E'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        <View style={styles.timerContent}>
          {isActive ? (
            <>
              <Text style={styles.elapsedTime}>{formatTime(elapsedTime)}</Text>
              <Text style={styles.timerLabel}>Elapsed</Text>
              {!isCompleted && (
                <>
                  <Text style={styles.remainingTime}>{formatTime(timeRemaining)}</Text>
                  <Text style={styles.remainingLabel}>Remaining</Text>
                </>
              )}
              {isCompleted && (
                <Text style={styles.completedText}>Fast Complete! 🎉</Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.targetTime}>{targetHours}h</Text>
              <Text style={styles.timerLabel}>Target Fast</Text>
              <Text style={styles.readyText}>Ready to start</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.progressStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(progress * 100)}%</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{targetHours}h</Text>
          <Text style={styles.statLabel}>Target</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.floor(elapsedTime / 3600)}h</Text>
          <Text style={styles.statLabel}>Elapsed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center',
    maxWidth: 400,
  },
  timerContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
  },
  timerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  elapsedTime: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  remainingTime: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#F7931E',
    marginBottom: 6,
  },
  remainingLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  targetTime: {
    fontSize: 56,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
    marginBottom: 12,
  },
  readyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  completedText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});