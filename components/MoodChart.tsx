import { View, Text, StyleSheet } from 'react-native';

export function MoodChart() {
  const chartData = [
    { day: 'Mon', mood: 4, height: 60 },
    { day: 'Tue', mood: 3, height: 45 },
    { day: 'Wed', mood: 5, height: 80 },
    { day: 'Thu', mood: 4, height: 60 },
    { day: 'Fri', mood: 5, height: 80 },
    { day: 'Sat', mood: 5, height: 80 },
    { day: 'Sun', mood: 4, height: 60 },
  ];

  const getMoodColor = (mood: number) => {
    if (mood >= 4.5) return '#FF6B35';
    if (mood >= 3.5) return '#F7931E';
    if (mood >= 2.5) return '#FFA500';
    return '#FF8C00';
  };

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.chartBar}>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar,
                  { 
                    height: item.height,
                    backgroundColor: getMoodColor(item.mood)
                  }
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF6B35' }]} />
          <Text style={styles.legendText}>Great (4.5+)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#F7931E' }]} />
          <Text style={styles.legendText}>Good (3.5-4.4)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFA500' }]} />
          <Text style={styles.legendText}>Okay (2.5-3.4)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF8C00' }]} />
          <Text style={styles.legendText}>Low (&lt;2.5)</Text>
        </View>
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
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    width: 28,
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 14,
    minHeight: 20,
  },
  barLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});