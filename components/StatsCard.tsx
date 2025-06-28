import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface StatsCardProps {
  icon: React.ReactNode;
  value: string;
  unit: string;
  label: string;
  progress: number;
  color: string;
  isWhiteBackground?: boolean;
  onPress?: () => void;
}

export function StatsCard({ icon, value, unit, label, progress, color, isWhiteBackground = false, onPress }: StatsCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.content, isWhiteBackground && styles.whiteContent]}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            {icon}
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress * 100}%`, backgroundColor: color }
                ]} 
              />
            </View>
          </View>
        </View>
        <View style={styles.stats}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 16,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  whiteContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
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
  progressBg: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  stats: {
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});