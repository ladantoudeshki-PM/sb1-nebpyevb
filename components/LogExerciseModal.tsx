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
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Save, Dumbbell, Activity, Heart, Zap, Coffee, Clock, Flame } from 'lucide-react-native';

interface LogExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onLogExercise: (exercise: any) => void;
  suggestedType?: string;
}

const workoutTypes = [
  { id: 'upper-body', label: 'Upper Body', icon: Dumbbell, color: '#FF6B35' },
  { id: 'lower-body', label: 'Lower Body', icon: Activity, color: '#F7931E' },
  { id: 'cardio', label: 'Cardio', icon: Heart, color: '#FF6B35' },
  { id: 'yoga', label: 'Yoga', icon: Zap, color: '#F7931E' },
  { id: 'mixed', label: 'Mixed', icon: Coffee, color: '#FF6B35' },
  { id: 'custom', label: 'Custom', icon: Dumbbell, color: '#6B7280' },
];

const commonExercises = {
  'upper-body': ['Push-ups', 'Pull-ups', 'Bench Press', 'Shoulder Press', 'Bicep Curls', 'Tricep Dips'],
  'lower-body': ['Squats', 'Lunges', 'Deadlifts', 'Leg Press', 'Calf Raises', 'Hip Thrusts'],
  'cardio': ['Running', 'Cycling', 'Swimming', 'Jump Rope', 'HIIT', 'Elliptical'],
  'yoga': ['Vinyasa Flow', 'Hatha Yoga', 'Power Yoga', 'Yin Yoga', 'Restorative Yoga', 'Hot Yoga'],
  'mixed': ['Circuit Training', 'CrossFit', 'Functional Training', 'Boot Camp', 'Total Body Workout'],
  'custom': [],
};

export function LogExerciseModal({ 
  visible, 
  onClose, 
  onLogExercise,
  suggestedType 
}: LogExerciseModalProps) {
  const [exerciseName, setExerciseName] = useState('');
  const [selectedType, setSelectedType] = useState(suggestedType || 'mixed');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');

  const handleSave = () => {
    if (exerciseName.trim() && duration.trim()) {
      onLogExercise({
        name: exerciseName.trim(),
        type: selectedType,
        duration: parseInt(duration),
        notes: notes.trim(),
        caloriesBurned: caloriesBurned ? parseInt(caloriesBurned) : undefined,
      });
      
      // Reset form
      setExerciseName('');
      setDuration('');
      setNotes('');
      setCaloriesBurned('');
      onClose();
    }
  };

  const isValid = exerciseName.trim() && duration.trim() && parseInt(duration) > 0;

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTypeInfo = (typeId: string) => {
    return workoutTypes.find(t => t.id === typeId) || workoutTypes[0];
  };

  const currentTypeInfo = getTypeInfo(selectedType);
  const TypeIcon = currentTypeInfo.icon;

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
              <Dumbbell size={24} color="#FF6B35" />
              <Text style={styles.title}>Log Exercise</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>{getCurrentDate()}</Text>
            <Text style={styles.timeText}>{getCurrentTime()}</Text>
          </View>

          <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Exercise Name */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Exercise Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Morning Run, Push-ups, Yoga Flow"
                value={exerciseName}
                onChangeText={setExerciseName}
                autoFocus
              />
              
              {/* Quick suggestions based on type */}
              {commonExercises[selectedType as keyof typeof commonExercises]?.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <Text style={styles.suggestionsLabel}>Quick suggestions:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {commonExercises[selectedType as keyof typeof commonExercises].map((exercise) => (
                      <TouchableOpacity
                        key={exercise}
                        style={styles.suggestionChip}
                        onPress={() => setExerciseName(exercise)}
                      >
                        <Text style={styles.suggestionText}>{exercise}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Workout Type */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Workout Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesScroll}>
                {workoutTypes.map((type) => {
                  const isSelected = selectedType === type.id;
                  const TypeIconComponent = type.icon;
                  
                  return (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.typeOption,
                        isSelected && [styles.typeOptionSelected, { backgroundColor: type.color + '20' }]
                      ]}
                      onPress={() => setSelectedType(type.id)}
                    >
                      <TypeIconComponent 
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
            </View>

            {/* Duration */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Duration (minutes)</Text>
              <View style={styles.durationContainer}>
                <Clock size={20} color="#6B7280" />
                <TextInput
                  style={styles.durationInput}
                  placeholder="30"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                />
                <Text style={styles.durationUnit}>minutes</Text>
              </View>
              
              {/* Quick duration buttons */}
              <View style={styles.quickDurationContainer}>
                {[15, 30, 45, 60, 90].map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    style={styles.quickDurationButton}
                    onPress={() => setDuration(mins.toString())}
                  >
                    <Text style={styles.quickDurationText}>{mins}m</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Calories (Optional) */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Calories Burned (optional)</Text>
              <View style={styles.durationContainer}>
                <Flame size={20} color="#F7931E" />
                <TextInput
                  style={styles.durationInput}
                  placeholder="200"
                  value={caloriesBurned}
                  onChangeText={setCaloriesBurned}
                  keyboardType="numeric"
                />
                <Text style={styles.durationUnit}>kcal</Text>
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="How did it feel? Any specific exercises, sets, reps, or observations..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, !isValid && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={!isValid}
            >
              <LinearGradient
                colors={isValid ? ['#FF6B35', '#F7931E'] : ['#D1D5DB', '#9CA3AF']}
                style={styles.saveButtonGradient}
              >
                <Save size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>Log Exercise</Text>
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
  dateTimeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  suggestionsContainer: {
    marginTop: 12,
  },
  suggestionsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  typesScroll: {
    marginBottom: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 120,
  },
  typeOptionSelected: {
    borderColor: '#FF6B35',
  },
  typeOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginLeft: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  durationInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
    marginRight: 8,
  },
  durationUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickDurationContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  quickDurationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickDurationText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 80,
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