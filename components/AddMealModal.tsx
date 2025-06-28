import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Search, Camera, Plus, Utensils, Flame, Target } from 'lucide-react-native';

interface AddMealModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMeal: (meal: any) => void;
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}

// Mock food database
const mockFoodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    serving: '100g'
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    serving: '100g'
  },
  {
    id: '3',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    serving: '100g'
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    serving: '100g'
  },
  {
    id: '5',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    serving: '100g'
  },
  {
    id: '6',
    name: 'Salmon Fillet',
    calories: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    serving: '100g'
  },
  {
    id: '7',
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 22,
    fat: 1.9,
    serving: '100g'
  },
  {
    id: '8',
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    serving: '100g'
  },
  {
    id: '9',
    name: 'Almonds',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    serving: '100g'
  },
  {
    id: '10',
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    serving: '100g'
  }
];

const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { id: 'lunch', label: 'Lunch', icon: '☀️' },
  { id: 'dinner', label: 'Dinner', icon: '🌙' },
  { id: 'snack', label: 'Snack', icon: '🍎' },
];

export function AddMealModal({ visible, onClose, onAddMeal }: AddMealModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<{food: FoodItem, quantity: number}[]>([]);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const filteredFoods = mockFoodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFood = (food: FoodItem) => {
    const existingFood = selectedFoods.find(item => item.food.id === food.id);
    if (existingFood) {
      setSelectedFoods(prev => 
        prev.map(item => 
          item.food.id === food.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedFoods(prev => [...prev, { food, quantity: 1 }]);
    }
  };

  const handleRemoveFood = (foodId: string) => {
    setSelectedFoods(prev => prev.filter(item => item.food.id !== foodId));
  };

  const handleQuantityChange = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFood(foodId);
      return;
    }
    setSelectedFoods(prev => 
      prev.map(item => 
        item.food.id === foodId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const calculateTotals = () => {
    return selectedFoods.reduce((totals, item) => {
      const multiplier = item.quantity;
      return {
        calories: totals.calories + (item.food.calories * multiplier),
        protein: totals.protein + (item.food.protein * multiplier),
        carbs: totals.carbs + (item.food.carbs * multiplier),
        fat: totals.fat + (item.food.fat * multiplier),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleSaveMeal = () => {
    if (selectedFoods.length === 0) {
      Alert.alert('No foods selected', 'Please add at least one food item to your meal.');
      return;
    }

    const totals = calculateTotals();
    const meal = {
      id: Date.now().toString(),
      type: selectedMealType,
      foods: selectedFoods,
      totals,
      timestamp: new Date(),
    };

    onAddMeal(meal);
    
    // Reset form
    setSearchQuery('');
    setSelectedFoods([]);
    setSelectedMealType('breakfast');
  };

  const handleBarcodePress = () => {
    // For web platform, show alert since camera isn't available
    if (Platform.OS === 'web') {
      Alert.alert(
        'Barcode Scanner',
        'Barcode scanning is not available on web. Please use the search function to find foods.',
        [{ text: 'OK' }]
      );
    } else {
      setShowBarcodeScanner(true);
    }
  };

  const totals = calculateTotals();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Utensils size={24} color="#FF6B35" />
              <Text style={styles.title}>Add Meal</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Meal Type Selection */}
          <View style={styles.mealTypeSection}>
            <Text style={styles.sectionTitle}>Meal Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealTypesScroll}>
              {mealTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.mealTypeButton,
                    selectedMealType === type.id && styles.selectedMealType
                  ]}
                  onPress={() => setSelectedMealType(type.id)}
                >
                  <Text style={styles.mealTypeEmoji}>{type.icon}</Text>
                  <Text style={[
                    styles.mealTypeText,
                    selectedMealType === type.id && styles.selectedMealTypeText
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Search Foods</Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for foods..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.barcodeButton} onPress={handleBarcodePress}>
                <Camera size={20} color="#FF6B35" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Selected Foods Summary */}
          {selectedFoods.length > 0 && (
            <View style={styles.selectedFoodsSection}>
              <Text style={styles.sectionTitle}>Selected Foods ({selectedFoods.length})</Text>
              <View style={styles.nutritionSummary}>
                <View style={styles.nutritionItem}>
                  <Flame size={16} color="#FF6B35" />
                  <Text style={styles.nutritionValue}>{Math.round(totals.calories)}</Text>
                  <Text style={styles.nutritionLabel}>kcal</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(totals.protein)}g</Text>
                  <Text style={styles.nutritionLabel}>protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(totals.carbs)}g</Text>
                  <Text style={styles.nutritionLabel}>carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{Math.round(totals.fat)}g</Text>
                  <Text style={styles.nutritionLabel}>fat</Text>
                </View>
              </View>
            </View>
          )}

          <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Selected Foods List */}
            {selectedFoods.length > 0 && (
              <View style={styles.selectedFoodsList}>
                {selectedFoods.map((item) => (
                  <View key={item.food.id} style={styles.selectedFoodItem}>
                    <View style={styles.selectedFoodInfo}>
                      <Text style={styles.selectedFoodName}>{item.food.name}</Text>
                      <Text style={styles.selectedFoodCalories}>
                        {Math.round(item.food.calories * item.quantity)} kcal
                      </Text>
                    </View>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.food.id, item.quantity - 1)}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.food.id, item.quantity + 1)}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Food Search Results */}
            <View style={styles.foodsList}>
              {filteredFoods.map((food) => (
                <TouchableOpacity
                  key={food.id}
                  style={styles.foodItem}
                  onPress={() => handleAddFood(food)}
                >
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodDetails}>
                      {food.calories} kcal • {food.protein}g protein • {food.serving}
                    </Text>
                  </View>
                  <View style={styles.addFoodButton}>
                    <Plus size={16} color="#FF6B35" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                selectedFoods.length === 0 && styles.saveButtonDisabled
              ]} 
              onPress={handleSaveMeal}
              disabled={selectedFoods.length === 0}
            >
              <LinearGradient
                colors={selectedFoods.length > 0 ? ['#FF6B35', '#F7931E'] : ['#D1D5DB', '#9CA3AF']}
                style={styles.saveButtonGradient}
              >
                <Utensils size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>Add Meal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTypeSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  mealTypesScroll: {
    marginHorizontal: -8,
  },
  mealTypeButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
  },
  selectedMealType: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF6B35',
  },
  mealTypeEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  mealTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  selectedMealTypeText: {
    color: '#FF6B35',
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
    paddingVertical: 12,
  },
  barcodeButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  selectedFoodsSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionItem: {
    alignItems: 'center',
    gap: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  selectedFoodsList: {
    paddingVertical: 16,
  },
  selectedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  selectedFoodInfo: {
    flex: 1,
  },
  selectedFoodName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  selectedFoodCalories: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    minWidth: 24,
    textAlign: 'center',
  },
  foodsList: {
    paddingBottom: 16,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  foodDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  addFoodButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});