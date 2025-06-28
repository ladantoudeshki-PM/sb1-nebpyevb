import { View, Text, StyleSheet } from 'react-native';
import { Flame, Target, Trophy, Calendar } from 'lucide-react-native';

interface FastingStatsProps {
  currentStreak: number;
  totalFasts: number;
  averageWindow: number;
}

export function FastingStats({ currentStreak, totalFasts, averageWindow }: FastingStatsProps) {
  const stats = [
    {
      icon: Flame,
      value: currentStreak.toString(),
      label: 'Day Streak',
      color: '#FF6B35',
    },
    {
      icon: Trophy,
      value: totalFasts.toString(),
      label: 'Total Fasts',
      color: '#F7931E',
    },
    {
      icon: Target,
      value: `${averageWindow}h`,
      label: 'Avg Window',
      color: '#FF6B35',
    },
    {
      icon: Calendar,
      value: '85%',
      label: 'Success Rate',
      color: '#F7931E',
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Progress</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
              <stat.icon size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
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
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});