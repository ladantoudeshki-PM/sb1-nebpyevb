import { View, Text, StyleSheet } from 'react-native';

export function WeeklyChart() {
  const data = [
    { category: 'Mood', value: 85, color: '#FF6B35' },
    { category: 'Sleep', value: 78, color: '#F7931E' },
    { category: 'Water', value: 65, color: '#FF6B35' },
    { category: 'Exercise', value: 72, color: '#F7931E' },
    { category: 'Nutrition', value: 68, color: '#FF6B35' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Progress</Text>
      <View style={styles.chart}>
        {data.map((item, index) => (
          <View key={index} style={styles.chartRow}>
            <Text style={styles.categoryLabel}>{item.category}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${item.value}%`,
                    backgroundColor: item.color
                  }
                ]}
              />
            </View>
            <Text style={styles.percentageLabel}>{item.value}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    gap: 16,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    width: 80,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    width: 40,
    textAlign: 'right',
  },
});