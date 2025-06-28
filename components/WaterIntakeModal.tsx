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
import { Plus, Minus, X, Save, ChevronUp, ChevronDown } from 'lucide-react-native';

interface WaterIntakeModalProps {
  visible: boolean;
  onClose: () => void;
  currentIntake: number;
  targetIntake: number;
  onSave: (amount: number) => void;
}

export function WaterIntakeModal({ 
  visible, 
  onClose, 
  currentIntake, 
  targetIntake, 
  onSave 
}: WaterIntakeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(currentIntake);
  const [isDragging, setIsDragging] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;
  const maxGlasses = 10;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderMove: (_, gestureState) => {
      const { dy } = gestureState;
      const sensitivity = 0.02;
      const change = -dy * sensitivity;
      const newAmount = Math.max(0, Math.min(maxGlasses, selectedAmount + change));
      setSelectedAmount(Math.round(newAmount * 4) / 4); // Round to nearest 0.25
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
    },
  });

  const progress = Math.min(selectedAmount / maxGlasses, 1);

  const getGlassLabel = () => {
    if (selectedAmount === 0) return "0 glasses";
    if (selectedAmount === 1) return "1 glass";
    if (selectedAmount > 10) return "10+ glasses";
    return `${selectedAmount} glasses`;
  };

  const adjustAmount = (change: number) => {
    const newAmount = Math.max(0, Math.min(maxGlasses, selectedAmount + change));
    setSelectedAmount(Math.round(newAmount * 4) / 4);
  };

  const handleSave = () => {
    onSave(selectedAmount);
    onClose();
  };

  const renderBubbles = () => {
    const bubbleCount = Math.floor(progress * 12);
    const bubbles = [];
    
    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 8 + 2;
      const left = 20 + Math.random() * 60; // Keep bubbles within circle bounds
      const bottom = 10 + Math.random() * (progress * 160); // Scale with water level
      
      bubbles.push(
        <View
          key={i}
          style={[
            styles.bubble,
            {
              width: size,
              height: size,
              left: `${left}%`,
              bottom: bottom,
            }
          ]}
        />
      );
    }
    
    return bubbles;
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
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Water Intake</Text>
          
          <Text style={styles.instructionText}>
            Slide up or down on the circle to adjust your water intake
          </Text>

          <View style={styles.circularSliderContainer} {...panResponder.panHandlers}>
            {/* Dynamic slide indicator */}
            <View style={styles.slideIndicator}>
              <ChevronUp size={16} color="#06B6D4" style={styles.slideIcon} />
              <ChevronDown size={16} color="#06B6D4" style={styles.slideIcon} />
            </View>
            
            <View style={styles.circularSlider}>
              {/* Background circle */}
              <View style={styles.circleBackground} />
              
              {/* Water fill - properly clipped to circle */}
              <View style={styles.waterContainer}>
                <View style={[styles.waterFill, { height: `${progress * 100}%` }]}>
                  <LinearGradient
                    colors={['#06B6D4', '#0891B2', '#0E7490']}
                    style={styles.waterGradient}
                  >
                    {renderBubbles()}
                  </LinearGradient>
                </View>
              </View>

              {/* Center content */}
              <View style={styles.centerContent}>
                <Text style={styles.centerGlassesNumber}>{selectedAmount}</Text>
                <Text style={styles.centerGlassesLabel}>glasses</Text>
              </View>
            </View>
          </View>

          <View style={styles.controls}>
            <View style={styles.adjustButtons}>
              <TouchableOpacity 
                style={styles.adjustButton}
                onPress={() => adjustAmount(-0.25)}
              >
                <Minus size={20} color="#6B7280" />
              </TouchableOpacity>
              
              <View style={styles.amountDisplay}>
                <Text style={styles.currentAmount}>{selectedAmount}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.adjustButton}
                onPress={() => adjustAmount(0.25)}
              >
                <Plus size={20} color="#6B7280" />
              </TouchableOpacity>
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
                <Text style={styles.saveButtonText}>Save</Text>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularSliderContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  slideIndicator: {
    position: 'absolute',
    right: -50,
    top: '50%',
    transform: [{ translateY: -20 }],
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  slideIcon: {
    marginVertical: 1,
    opacity: 0.8,
  },
  circularSlider: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  circleBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#F3F4F6',
    borderWidth: 4,
    borderColor: '#E5E7EB',
  },
  waterContainer: {
    position: 'absolute',
    width: 192, // Slightly smaller than circle to account for border
    height: 192,
    borderRadius: 96,
    top: 4,
    left: 4,
    overflow: 'hidden', // This ensures water stays within circle bounds
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 96,
    borderBottomRightRadius: 96,
    overflow: 'hidden',
  },
  waterGradient: {
    flex: 1,
    position: 'relative',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerGlassesNumber: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  centerGlassesLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  controls: {
    marginBottom: 24,
    marginTop: 16,
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
  amountDisplay: {
    alignItems: 'center',
  },
  currentAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
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
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});