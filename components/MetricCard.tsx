import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface Metric {
  id: number;
  title: string;
  value: string;
  unit: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp size={16} color="#FF6B35" />;
      case 'down':
        return <TrendingDown size={16} color="#EF4444" />;
      case 'stable':
        return <Minus size={16} color="#6B7280" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return '#FF6B35';
      case 'down':
        return '#EF4444';
      case 'stable':
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: metric.color + '20' }]}>
          <View style={[styles.iconDot, { backgroundColor: metric.color }]} />
        </View>
        <View style={styles.trendContainer}>
          {getTrendIcon()}
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {metric.change}
          </Text>
        </View>
      </View>
      
      <View style={styles.stats}>
        <Text style={styles.value}>{metric.value}</Text>
        <Text style={styles.unit}>{metric.unit}</Text>
      </View>
      
      <Text style={styles.title}>{metric.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
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
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});