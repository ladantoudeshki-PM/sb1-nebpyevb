import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Save, Target, Calendar, TrendingDown, Scale, Clock } from 'lucide-react-native';

interface WeightGoalModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeight: number;
  targetWeight: number;
  targetDate: Date;
  unit: 'kg' | 'lbs';
  onSave: (targetWeight: number, targetDate: Date) => void;
}

export function WeightGoalModal({ 
  visible, 
  onClose, 
  currentWeight,
  targetWeight,
  targetDate,
  unit,
  onSave 
}: WeightGoalModalProps) {
  const [selectedTargetWeight, setSelectedTargetWeight] = useState(targetWeight);
  const [selectedTargetDate, setSelectedTargetDate] = useState(targetDate);

  const minWeight = unit === 'kg' ? 40 : 88;
  const maxWeight = unit === 'kg' ? 150 : 330;

  const handleSave = () => {
    onSave(selectedTargetWeight, selectedTargetDate);
    onClose();
  };

  const adjustWeight = (change: number) => {
    const newWeight = Math.max(minWeight, Math.min(maxWeight, selectedTargetWeight + change));
    setSelectedTargetWeight(Math.round(newWeight * 10) / 10);
  };

  const adjustDate = (days: number) => {
    const newDate = new Date(selectedTargetDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedTargetDate(newDate);
  };

  const getWeightToLose = () => {
    return Math.max(0, currentWeight - selectedTargetWeight);
  };

  const getWeeksToGoal = () => {
    const now = new Date();
    const diffTime = selectedTargetDate.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, diffWeeks);
  };

  const getWeeklyTarget = () => {
    const weightToLose = getWeightToLose();
    const weeks = getWeeksToGoal();
    return weightToLose / weeks;
  };

  const getRecommendation = () => {
    const weeklyTarget = getWeeklyTarget();
    const maxSafeWeekly = unit === 'kg' ? 0.5 : 1.1; // 0.5kg or 1.1lbs per week
    
    if (weeklyTarget > maxSafeWeekly) {
      return {
        type: 'warning',
        message: 'This goal may be too aggressive. Consider a longer timeframe.',
        color: '#F59E0B'
      };
    } else if (weeklyTarget < 0.1) {
      return {
        type: 'easy',
        message: 'This is a very achievable goal with gradual progress.',
        color: '#10B981'
      };
    } else {
      return {
        type: 'good',
        message: 'This is a healthy and achievable goal.',
        color: '#FF6B35'
      };
    }
  };

  const recommendation = getRecommendation();
  const weightToLose = getWeightToLose();
  const weeksToGoal = getWeeksToGoal();
  const weeklyTarget = getWeeklyTarget();

  const quickDateOptions = [
    { label: '1 Month', days: 30 },
    { label: '3 Months', days: 90 },
    { label: '6 Months', days: 180 },
    { label: '1 Year', days: 365 },
  ];

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
              <Target size={24} color="#FF6B35" />
              <Text style={styles.title}>Set Weight Goal</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Current Weight Display */}
            <View style={styles.currentWeightSection}>
              <Text style={styles.sectionTitle}>Current Weight</Text>
              <View style={styles.currentWeightDisplay}>
                <Scale size={20} color="#6B7280" />
                <Text style={styles.currentWeightText}>
                  {currentWeight} {unit}
                </Text>
              </View>
            </View>

            {/* Target Weight Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Target Weight</Text>
              <View style={styles.weightSelector}>
                <TouchableOpacity 
                  style={styles.adjustButton}
                  onPress={() => adjustWeight(unit === 'kg' ? -0.5 : -1)}
                >
                  <Text style={styles.adjustButtonText}>-</Text>
                </TouchableOpacity>
                
                <View style={styles.weightDisplay}>
                  <Text style={styles.targetWeightNumber}>
                    {selectedTargetWeight.toFixed(1)}
                  </Text>
                  <Text style={styles.weightUnit}>{unit}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.adjustButton}
                  onPress={() => adjustWeight(unit === 'kg' ? 0.5 : 1)}
                >
                  <Text style={styles.adjustButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Quick weight adjustments */}
              <View style={styles.quickWeightButtons}>
                {[
                  unit === 'kg' ? -5 : -11,
                  unit === 'kg' ? -2 : -4.4,
                  unit === 'kg' ? -1 : -2.2,
                  unit === 'kg' ? 1 : 2.2,
                  unit === 'kg' ? 2 : 4.4,
                  unit === 'kg' ? 5 : 11
                ].map((change) => (
                  <TouchableOpacity
                    key={change}
                    style={styles.quickWeightButton}
                    onPress={() => adjustWeight(change)}
                  >
                    <Text style={styles.quickWeightButtonText}>
                      {change > 0 ? '+' : ''}{change}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Target Date Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Target Date</Text>
              <View style={styles.dateSelector}>
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.selectedDate}>
                  {selectedTargetDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>

              {/* Quick date options */}
              <View style={styles.quickDateButtons}>
                {quickDateOptions.map((option) => (
                  <TouchableOpacity
                    key={option.label}
                    style={styles.quickDateButton}
                    onPress={() => {
                      const newDate = new Date();
                      newDate.setDate(newDate.getDate() + option.days);
                      setSelectedTargetDate(newDate);
                    }}
                  >
                    <Text style={styles.quickDateButtonText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Manual date adjustment */}
              <View style={styles.dateAdjustment}>
                <TouchableOpacity 
                  style={styles.dateAdjustButton}
                  onPress={() => adjustDate(-7)}
                >
                  <Text style={styles.dateAdjustButtonText}>-1 Week</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dateAdjustButton}
                  onPress={() => adjustDate(7)}
                >
                  <Text style={styles.dateAdjustButtonText}>+1 Week</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Goal Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Goal Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <TrendingDown size={16} color="#FF6B35" />
                  <Text style={styles.summaryLabel}>Weight to lose:</Text>
                  <Text style={styles.summaryValue}>
                    {weightToLose.toFixed(1)} {unit}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Clock size={16} color="#F7931E" />
                  <Text style={styles.summaryLabel}>Time frame:</Text>
                  <Text style={styles.summaryValue}>
                    {weeksToGoal} weeks
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Target size={16} color="#10B981" />
                  <Text style={styles.summaryLabel}>Weekly target:</Text>
                  <Text style={styles.summaryValue}>
                    {weeklyTarget.toFixed(2)} {unit}/week
                  </Text>
                </View>
              </View>

              {/* Recommendation */}
              <View style={[styles.recommendationCard, { borderLeftColor: recommendation.color }]}>
                <Text style={[styles.recommendationText, { color: recommendation.color }]}>
                  {recommendation.message}
                </Text>
              </View>
            </View>
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
                <Text style={styles.saveButtonText}>Save Goal</Text>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  currentWeightSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 24,
  },
  currentWeightDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currentWeightText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  weightSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
  },
  adjustButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
  },
  weightDisplay: {
    alignItems: 'center',
    gap: 8,
  },
  targetWeightNumber: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  weightUnit: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickWeightButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  quickWeightButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  quickWeightButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  selectedDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 12,
  },
  quickDateButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  quickDateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickDateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  dateAdjustment: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  dateAdjustButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  dateAdjustButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  recommendationCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 20,
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