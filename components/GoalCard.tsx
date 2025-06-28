import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Clock, Target, Flame } from 'lucide-react-native';

interface Goal {
  id: number;
  title: string;
  category: string;
  progress: number;
  target: number;
  current: number;
  unit: string;
  color: string;
  streak: number;
  status: 'active' | 'completed';
}

interface GoalCardProps {
  goal: Goal;
  onToggle?: (id: number) => void;
}

export function GoalCard({ goal, onToggle }: GoalCardProps) {
  const progressPercentage = Math.round(goal.progress * 100);
  const isCompleted = goal.status === 'completed';

  return (
    <TouchableOpacity 
      style={[styles.container, isCompleted && styles.completedContainer]}
      onPress={() => onToggle?.(goal.id)}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.categoryDot, { backgroundColor: goal.color }]} />
          <View style={styles.titleText}>
            <Text style={[styles.title, isCompleted && styles.completedTitle]}>
              {goal.title}
            </Text>
            <Text style={styles.category}>{goal.category}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          {isCompleted ? (
            <CheckCircle size={24} color="#FF6B35" />
          ) : (
            <Clock size={24} color="#6B7280" />
          )}
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${progressPercentage}%`,
                backgroundColor: goal.color
              }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage}% ({goal.current} of {goal.target} {goal.unit})
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.streakContainer}>
          <Flame size={16} color="#F7931E" />
          <Text style={styles.streakText}>{goal.streak} day streak</Text>
        </View>
        <View style={styles.targetContainer}>
          <Target size={16} color="#6B7280" />
          <Text style={styles.targetText}>Target: {goal.target} {goal.unit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  completedContainer: {
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  titleText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  category: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statusContainer: {
    marginLeft: 12,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F7931E',
    marginLeft: 4,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
});