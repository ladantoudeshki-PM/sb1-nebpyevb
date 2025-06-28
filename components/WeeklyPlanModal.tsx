import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Save, Calendar, Dumbbell, Activity, Heart, Zap, Coffee } from 'lucide-react-native';
import { DayPlan } from '@/hooks/useWorkoutPlan';

interface WeeklyPlanModalProps {
  visible: boolean;
  onClose: () => void;
  currentPlan: DayPlan[];
  onSavePlan: (plan: DayPlan[]) => void;
}

const workoutTypes = [
  { id: 'upper-body', label: 'Upper Body', icon: Dumbbell, color: '#FF6B35' },
  { id: 'lower-body', label: 'Lower Body', icon: Activity, color: '#F7931E' },
  { id: 'cardio', label: 'Cardio', icon: Heart, color: '#FF6B35' },
  { id: 'yoga', label: 'Yoga', icon: Zap, color: '#F7931E' },
  { id: 'mixed', label: 'Mixed', icon: Coffee, color: '#FF6B35' },
  { id: 'custom', label: 'Custom', icon: Dumbbell, color: '#6B7280' },
];

export function WeeklyPlanModal({ 
  visible, 
  onClose, 
  currentPlan, 
  onSavePlan 
}: WeeklyPlanModalProps) {
  const [editedPlan, setEditedPlan] = useState<DayPlan[]>(currentPlan);

  const updateDayPlan = (dayOfWeek: number, updates: Partial<DayPlan>) => {
    setEditedPlan(prev => 
      prev.map(day => 
        day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day
      )
    );
  };

  const handleSave = () => {
    onSavePlan(editedPlan);
    onClose();
  };

  const getWorkoutTypeInfo = (type?: string) => {
    return workoutTypes.find(t => t.id === type) || workoutTypes[0];
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Calendar size={24} color="#FF6B35" />
              <Text style={styles.title}>Weekly Workout Plan</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Plan your workout schedule for the week. Choose workout types and target durations for each day.
          </Text>

          <ScrollView style={styles.daysContainer} showsVerticalScrollIndicator={false}>
            {editedPlan.map((day) => (
              <View key={day.dayOfWeek} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayName}>{day.dayName}</Text>
                  <TouchableOpacity
                    style={[
                      styles.restToggle,
                      day.isRestDay && styles.restToggleActive
                    ]}
                    onPress={() => updateDayPlan(day.dayOfWeek, { isRestDay: !day.isRestDay })}
                  >
                    <Text style={[
                      styles.restToggleText,
                      day.isRestDay && styles.restToggleTextActive
                    ]}>
                      {day.isRestDay ? 'Rest Day' : 'Workout'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {!day.isRestDay && (
                  <View style={styles.workoutConfig}>
                    <Text style={styles.configLabel}>Workout Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesScroll}>
                      {workoutTypes.map((type) => {
                        const isSelected = day.type === type.id;
                        const TypeIcon = type.icon;
                        
                        return (
                          <TouchableOpacity
                            key={type.id}
                            style={[
                              styles.typeOption,
                              isSelected && [styles.typeOptionSelected, { backgroundColor: type.color + '20' }]
                            ]}
                            onPress={() => updateDayPlan(day.dayOfWeek, { type: type.id as any })}
                          >
                            <TypeIcon 
                              size={20} 
                              color={isSelected ? type.color : '#6B7280'} 
                            />
                            <Text style={[
                              styles.typeOptionText,
                              isSelected && { color: type.color }
                            ]}>
                              {type.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>

                    {day.type === 'custom' && (
                      <View style={styles.customTypeContainer}>
                        <Text style={styles.configLabel}>Custom Type</Text>
                        <TextInput
                          style={styles.customTypeInput}
                          placeholder="e.g., Swimming, Rock Climbing"
                          value={day.customType || ''}
                          onChangeText={(text) => updateDayPlan(day.dayOfWeek, { customType: text })}
                        />
                      </View>
                    )}

                    <View style={styles.durationContainer}>
                      <Text style={styles.configLabel}>Target Duration (minutes)</Text>
                      <View style={styles.durationButtons}>
                        {[15, 30, 45, 60, 90].map((duration) => (
                          <TouchableOpacity
                            key={duration}
                            style={[
                              styles.durationButton,
                              day.targetDuration === duration && styles.durationButtonSelected
                            ]}
                            onPress={() => updateDayPlan(day.dayOfWeek, { targetDuration: duration })}
                          >
                            <Text style={[
                              styles.durationButtonText,
                              day.targetDuration === duration && styles.durationButtonTextSelected
                            ]}>
                              {duration}m
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.notesContainer}>
                      <Text style={styles.configLabel}>Notes (optional)</Text>
                      <TextInput
                        style={styles.notesInput}
                        placeholder="Add any specific notes for this day..."
                        value={day.notes || ''}
                        onChangeText={(text) => updateDayPlan(day.dayOfWeek, { notes: text })}
                        multiline
                        numberOfLines={2}
                      />
                    </View>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                style={styles.saveButtonGradient}
              >
                <Save size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save Plan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
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
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    paddingHorizontal: 24,
    marginBottom: 24,
    lineHeight: 22,
  },
  daysContainer: {
    paddingHorizontal: 24,
    maxHeight: 500,
  },
  dayCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  restToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  restToggleActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  restToggleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  restToggleTextActive: {
    color: '#ffffff',
  },
  workoutConfig: {
    gap: 16,
  },
  configLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  typesScroll: {
    marginBottom: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 100,
  },
  typeOptionSelected: {
    borderColor: '#FF6B35',
  },
  typeOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 6,
  },
  customTypeContainer: {
    marginTop: 8,
  },
  customTypeInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  durationContainer: {
    marginTop: 8,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  durationButtonSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  durationButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  durationButtonTextSelected: {
    color: '#ffffff',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 60,
    textAlignVertical: 'top',
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