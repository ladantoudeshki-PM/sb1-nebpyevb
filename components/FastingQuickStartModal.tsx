import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Clock, Play, Target, Zap } from 'lucide-react-native';

interface FastingQuickStartModalProps {
  visible: boolean;
  onClose: () => void;
  onStartFasting: (hours: number) => void;
}

export function FastingQuickStartModal({ 
  visible, 
  onClose, 
  onStartFasting 
}: FastingQuickStartModalProps) {
  const [selectedHours, setSelectedHours] = useState<number | null>(null);

  const fastingOptions = [
    {
      hours: 12,
      title: 'Beginner Fast',
      description: 'Perfect for starting your fasting journey',
      icon: Clock,
      color: '#10B981',
      benefits: ['Easy to maintain', 'Good for beginners', 'Flexible timing']
    },
    {
      hours: 16,
      title: 'Popular Choice',
      description: 'Most common intermittent fasting window',
      icon: Target,
      color: '#FF6B35',
      benefits: ['Proven effective', 'Sustainable', 'Great results']
    },
    {
      hours: 18,
      title: 'Advanced Fast',
      description: 'For experienced fasters seeking more benefits',
      icon: Zap,
      color: '#F59E0B',
      benefits: ['Enhanced autophagy', 'Better fat burning', 'Mental clarity']
    },
    {
      hours: 24,
      title: 'Extended Fast',
      description: 'Full day fast for maximum benefits',
      icon: Zap,
      color: '#EF4444',
      benefits: ['Deep autophagy', 'Reset metabolism', 'Spiritual benefits']
    }
  ];

  const handleStartFasting = () => {
    if (selectedHours) {
      onStartFasting(selectedHours);
      setSelectedHours(null);
    }
  };

  const getTimeDisplay = (hours: number) => {
    if (hours === 24) return '24 hours';
    return `${hours} hours`;
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
            <Text style={styles.title}>Choose Your Fast</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select a fasting window that fits your lifestyle
          </Text>

          <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
            {fastingOptions.map((option) => (
              <TouchableOpacity
                key={option.hours}
                style={[
                  styles.fastingOption,
                  selectedHours === option.hours && [
                    styles.selectedOption,
                    { backgroundColor: option.color + '10' }
                  ]
                ]}
                onPress={() => setSelectedHours(option.hours)}
              >
                <View style={styles.optionHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                    <option.icon size={24} color={option.color} />
                  </View>
                  <View style={styles.optionInfo}>
                    <View style={styles.titleRow}>
                      <Text style={[
                        styles.optionTitle,
                        selectedHours === option.hours && { color: option.color }
                      ]}>
                        {getTimeDisplay(option.hours)}
                      </Text>
                      <Text style={styles.optionSubtitle}>{option.title}</Text>
                    </View>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                  {selectedHours === option.hours && (
                    <View style={[styles.selectedIndicator, { backgroundColor: option.color }]}>
                      <Text style={styles.selectedIndicatorText}>✓</Text>
                    </View>
                  )}
                </View>

                <View style={styles.benefitsList}>
                  {option.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <View style={[styles.benefitDot, { backgroundColor: option.color }]} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.startButton, 
                !selectedHours && styles.startButtonDisabled
              ]} 
              onPress={handleStartFasting}
              disabled={!selectedHours}
            >
              <LinearGradient
                colors={selectedHours ? ['#FF6B35', '#F7931E'] : ['#D1D5DB', '#9CA3AF']}
                style={styles.startButtonGradient}
              >
                <Play size={16} color="#ffffff" />
                <Text style={styles.startButtonText}>
                  Start {selectedHours ? `${selectedHours}h` : ''} Fast
                </Text>
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
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 24,
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
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  optionsContainer: {
    paddingHorizontal: 24,
    maxHeight: 400,
  },
  fastingOption: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#FF6B35',
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  optionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F7931E',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  selectedIndicatorText: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  startButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonDisabled: {
    opacity: 0.6,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});