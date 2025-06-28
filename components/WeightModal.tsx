import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions,
  PanResponder,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Minus, X, Save, Scale, Target, TrendingDown } from 'lucide-react-native';

interface WeightModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeight: number;
  targetWeight: number;
  unit: 'kg' | 'lbs';
  onSave: (weight: number) => void;
}

export function WeightModal({ 
  visible, 
  onClose, 
  currentWeight, 
  targetWeight,
  unit,
  onSave 
}: WeightModalProps) {
  const [selectedWeight, setSelectedWeight] = useState(currentWeight);
  const [isDragging, setIsDragging] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;
  
  const minWeight = unit === 'kg' ? 30 : 66; // 30kg or 66lbs
  const maxWeight = unit === 'kg' ? 200 : 440; // 200kg or 440lbs

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderMove: (_, gestureState) => {
      const { dy } = gestureState;
      const sensitivity = unit === 'kg' ? 0.02 : 0.05; // Different sensitivity for kg vs lbs
      const change = -dy * sensitivity;
      const newWeight = Math.max(minWeight, Math.min(maxWeight, selectedWeight + change));
      setSelectedWeight(Math.round(newWeight * 10) / 10); // Round to 1 decimal place
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
    },
  });

  const adjustWeight = (change: number) => {
    const newWeight = Math.max(minWeight, Math.min(maxWeight, selectedWeight + change));
    setSelectedWeight(Math.round(newWeight * 10) / 10);
  };

  const handleSave = () => {
    onSave(selectedWeight);
    onClose();
  };

  const weightDifference = selectedWeight - targetWeight;
  const isAboveTarget = weightDifference > 0;
  const progressToTarget = Math.abs(weightDifference);

  const getMotivationalMessage = () => {
    if (Math.abs(weightDifference) < 0.5) {
      return "You're very close to your goal! 🎯";
    } else if (isAboveTarget) {
      return `${progressToTarget.toFixed(1)}${unit} to reach your goal 💪`;
    } else {
      return `${progressToTarget.toFixed(1)}${unit} below your target! 🌟`;
    }
  };

  const renderWeightScale = () => {
    const scaleItems = [];
    const range = 20; // Show 20 units around current weight
    const startWeight = Math.max(minWeight, selectedWeight - range/2);
    const endWeight = Math.min(maxWeight, selectedWeight + range/2);
    
    for (let i = startWeight; i <= endWeight; i += (unit === 'kg' ? 0.5 : 1)) {
      const isSelected = Math.abs(i - selectedWeight) < 0.1;
      const isTarget = Math.abs(i - targetWeight) < 0.1;
      
      scaleItems.push(
        <View
          key={i}
          style={[
            styles.scaleItem,
            isSelected && styles.selectedScaleItem,
            isTarget && styles.targetScaleItem
          ]}
        >
          <View style={[
            styles.scaleMark,
            isSelected && styles.selectedScaleMark,
            isTarget && styles.targetScaleMark
          ]} />
          {(i % (unit === 'kg' ? 1 : 2) === 0) && (
            <Text style={[
              styles.scaleText,
              isSelected && styles.selectedScaleText,
              isTarget && styles.targetScaleText
            ]}>
              {i.toFixed(unit === 'kg' ? 0 : 0)}
            </Text>
          )}
        </View>
      );
    }
    
    return scaleItems;
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
              <Scale size={24} color="#FF6B35" />
              <Text style={styles.title}>Update Weight</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.instructionText}>
            Drag the scale or use buttons to adjust your weight
          </Text>

          {/* Weight Display */}
          <View style={styles.weightDisplayContainer}>
            <View style={styles.weightDisplay}>
              <Text style={styles.weightNumber}>{selectedWeight.toFixed(1)}</Text>
              <Text style={styles.weightUnit}>{unit}</Text>
            </View>
            
            {/* Goal indicator */}
            <View style={styles.goalIndicator}>
              <Target size={16} color="#6B7280" />
              <Text style={styles.goalText}>Goal: {targetWeight}{unit}</Text>
            </View>
            
            {/* Motivational message */}
            <Text style={styles.motivationalText}>
              {getMotivationalMessage()}
            </Text>
          </View>

          {/* Interactive Scale */}
          <View style={styles.scaleContainer} {...panResponder.panHandlers}>
            <View style={styles.scalePointer} />
            <View style={styles.scaleTrack}>
              {renderWeightScale()}
            </View>
          </View>

          {/* Manual Controls */}
          <View style={styles.controls}>
            <View style={styles.adjustButtons}>
              <TouchableOpacity 
                style={styles.adjustButton}
                onPress={() => adjustWeight(unit === 'kg' ? -0.1 : -0.2)}
              >
                <Minus size={20} color="#6B7280" />
              </TouchableOpacity>
              
              <View style={styles.quickAdjustments}>
                <TouchableOpacity 
                  style={styles.quickButton}
                  onPress={() => adjustWeight(unit === 'kg' ? -1 : -2)}
                >
                  <Text style={styles.quickButtonText}>-{unit === 'kg' ? '1' : '2'}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickButton}
                  onPress={() => adjustWeight(unit === 'kg' ? 1 : 2)}
                >
                  <Text style={styles.quickButtonText}>+{unit === 'kg' ? '1' : '2'}</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.adjustButton}
                onPress={() => adjustWeight(unit === 'kg' ? 0.1 : 0.2)}
              >
                <Plus size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress to Goal */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progress to Goal</Text>
              <View style={styles.progressBadge}>
                <TrendingDown size={12} color="#10B981" />
                <Text style={styles.progressBadgeText}>
                  {isAboveTarget ? 'Losing' : 'Maintaining'}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min(100 - (progressToTarget / 10) * 100, 100)}%`,
                    backgroundColor: isAboveTarget ? '#FF6B35' : '#10B981'
                  }
                ]}
              />
            </View>
          </View>

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
                <Text style={styles.saveButtonText}>Save Weight</Text>
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
    padding: 24,
    width: '100%',
    maxWidth: 400,
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
    marginBottom: 8,
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
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  weightDisplayContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  weightDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  weightNumber: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  weightUnit: {
    fontSize: 20,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  goalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  motivationalText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    textAlign: 'center',
  },
  scaleContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
    height: 80,
  },
  scalePointer: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 20,
    backgroundColor: '#FF6B35',
    zIndex: 1,
  },
  scaleTrack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    marginTop: 20,
  },
  scaleItem: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  scaleMark: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginBottom: 4,
  },
  selectedScaleMark: {
    backgroundColor: '#FF6B35',
    height: 30,
  },
  targetScaleMark: {
    backgroundColor: '#10B981',
    height: 25,
  },
  scaleText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  selectedScaleText: {
    color: '#FF6B35',
    fontFamily: 'Inter-Bold',
  },
  targetScaleText: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
  },
  controls: {
    marginBottom: 24,
  },
  adjustButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adjustButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAdjustments: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  quickButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
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