import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Apple, Plus, ChevronRight, Utensils, Flame } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { AddMealModal } from './AddMealModal';

interface NutritionWidgetProps {
  dailyCalories?: number;
  targetCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export function NutritionWidget({ 
  dailyCalories = 1420,
  targetCalories = 2000,
  protein = 85,
  carbs = 180,
  fat = 45
}: NutritionWidgetProps) {
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);

  const handlePress = () => {
    router.push('/(tabs)/nutrition');
  };

  const handleAddMeal = (meal: any) => {
    setMeals(prev => [...prev, meal]);
    setShowAddMealModal(false);
  };

  const caloriesProgress = Math.min(dailyCalories / targetCalories, 1);
  const remainingCalories = Math.max(targetCalories - dailyCalories, 0);

  const macros = [
    { name: 'Protein', value: protein, unit: 'g', color: '#FF6B35', target: 120 },
    { name: 'Carbs', value: carbs, unit: 'g', color: '#F7931E', target: 250 },
    { name: 'Fat', value: fat, unit: 'g', color: '#FFA500', target: 65 }
  ];

  const recentMeals = [
    {
      name: 'Breakfast',
      calories: 420,
      time: '8:30 AM',
      items: ['Oatmeal', 'Berries', 'Almonds'],
    },
    {
      name: 'Lunch',
      calories: 650,
      time: '12:45 PM',
      items: ['Grilled Chicken', 'Quinoa', 'Vegetables'],
    },
    {
      name: 'Snack',
      calories: 180,
      time: '3:20 PM',
      items: ['Greek Yogurt', 'Honey'],
    },
  ];

  return (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nutrition Tracker</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={handlePress}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color="#FF6B35" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.nutritionCard}>
          {/* Calories Overview - Smaller and Orange */}
          <View style={styles.caloriesSection}>
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.caloriesGradient}
            >
              <View style={styles.caloriesContent}>
                <View style={styles.caloriesHeader}>
                  <Apple size={20} color="#ffffff" />
                  <Text style={styles.caloriesTitle}>Daily Calories</Text>
                </View>
                <View style={styles.caloriesStats}>
                  <Text style={styles.caloriesConsumed}>{dailyCalories}</Text>
                  <Text style={styles.caloriesTarget}>/ {targetCalories} kcal</Text>
                </View>
                <View style={styles.caloriesProgress}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${caloriesProgress * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {Math.round(caloriesProgress * 100)}% of daily goal
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Macros Breakdown */}
          <View style={styles.macrosSection}>
            <Text style={styles.macrosTitle}>Macronutrients</Text>
            <View style={styles.macrosGrid}>
              {macros.map((macro, index) => {
                const progress = Math.min(macro.value / macro.target, 1);
                return (
                  <View key={index} style={styles.macroItem}>
                    <View style={styles.macroHeader}>
                      <Text style={styles.macroName}>{macro.name}</Text>
                      <Text style={styles.macroValue}>
                        {macro.value}/{macro.target}{macro.unit}
                      </Text>
                    </View>
                    <View style={styles.macroProgressBar}>
                      <View 
                        style={[
                          styles.macroProgressFill,
                          { 
                            width: `${progress * 100}%`,
                            backgroundColor: macro.color
                          }
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Recent Meals */}
          <View style={styles.mealsSection}>
            <View style={styles.mealsHeader}>
              <Text style={styles.mealsTitle}>Today's Meals</Text>
              <TouchableOpacity 
                style={styles.addMealButton}
                onPress={() => setShowAddMealModal(true)}
              >
                <Plus size={16} color="#FF6B35" />
                <Text style={styles.addMealText}>Add Meal</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealsScroll}>
              {recentMeals.map((meal, index) => (
                <TouchableOpacity key={index} style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <Utensils size={16} color="#FF6B35" />
                    <Text style={styles.mealName}>{meal.name}</Text>
                  </View>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                  <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                  <View style={styles.mealItems}>
                    {meal.items.slice(0, 2).map((item, itemIndex) => (
                      <Text key={itemIndex} style={styles.mealItem}>
                        • {item}
                      </Text>
                    ))}
                    {meal.items.length > 2 && (
                      <Text style={styles.mealMore}>
                        +{meal.items.length - 2} more
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <AddMealModal
        visible={showAddMealModal}
        onClose={() => setShowAddMealModal(false)}
        onAddMeal={handleAddMeal}
      />
    </>
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
  nutritionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  caloriesSection: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 8,
    marginBottom: 4,
  },
  caloriesGradient: {
    padding: 12,
  },
  caloriesContent: {
    gap: 6,
  },
  caloriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  caloriesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  caloriesStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  caloriesConsumed: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  caloriesTarget: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
  },
  caloriesProgress: {
    gap: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
  },
  macrosSection: {
    padding: 8,
  },
  macrosTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  macrosGrid: {
    gap: 8,
  },
  macroItem: {
    gap: 4,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroName: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  macroValue: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  macroProgressBar: {
    height: 3,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  mealsSection: {
    padding: 8,
    paddingTop: 0,
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealsTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  addMealText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  mealsScroll: {
    marginLeft: -8,
    paddingLeft: 8,
  },
  mealCard: {
    width: 120,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  mealName: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  mealTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 3,
  },
  mealCalories: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
    marginBottom: 6,
  },
  mealItems: {
    gap: 1,
  },
  mealItem: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  mealMore: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});