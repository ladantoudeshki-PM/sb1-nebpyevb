import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, X, Plus } from 'lucide-react-native';

export function HabitsWidget() {
  const habits = [
    { id: 1, name: 'Morning Meditation', completed: true, streak: 5 },
    { id: 2, name: 'Drink Water', completed: true, streak: 12 },
    { id: 3, name: 'Read 30 minutes', completed: false, streak: 3 },
    { id: 4, name: 'Take Vitamins', completed: true, streak: 8 },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daily Habits</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.habitsContainer}>
        {habits.map((habit) => (
          <View key={habit.id} style={styles.habitItem}>
            <TouchableOpacity
              style={[
                styles.habitCheckbox,
                { backgroundColor: habit.completed ? '#FF6B35' : '#F3F4F6' }
              ]}
            >
              {habit.completed ? (
                <Check size={16} color="#ffffff" />
              ) : (
                <X size={16} color="#9CA3AF" />
              )}
            </TouchableOpacity>
            <View style={styles.habitContent}>
              <Text style={[
                styles.habitName,
                { color: habit.completed ? '#1F2937' : '#6B7280' }
              ]}>
                {habit.name}
              </Text>
              <Text style={styles.habitStreak}>
                {habit.streak} day streak
              </Text>
            </View>
          </View>
        ))}
      </View>
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
  addButton: {
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
  habitsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  habitCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  habitStreak: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});