import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image,
  PanResponder,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Moon, Sun } from 'lucide-react-native';

interface SleepModalProps {
  visible: boolean;
  onClose: () => void;
  currentSleep: {
    hours: number;
    quality: 'good' | 'poor' | null;
  };
  onSave: (sleepData: { hours: number; quality: 'good' | 'poor' }) => void;
}

export function SleepModal({ 
  visible, 
  onClose, 
  currentSleep, 
  onSave 
}: SleepModalProps) {
  const [selectedQuality, setSelectedQuality] = useState<'good' | 'poor' | null>(currentSleep.quality);
  const [sleepHours, setSleepHours] = useState(currentSleep.hours);

  const sleepOptions = [
    {
      id: 'good',
      title: 'Restful Night',
      description: 'I woke up feeling refreshed and energized',
      image: require('../assets/images/good sleep.png'),
      color: '#10B981',
      icon: Sun,
    },
    {
      id: 'poor',
      title: 'Restless Night', 
      description: 'I feel tired and need more rest',
      image: require('../assets/images/bad sleep.png'),
      color: '#F59E0B',
      icon: Moon,
    }
  ];

  const minHours = 1;
  const maxHours = 12;
  const sliderWidth = 280;

  // Convert hours to slider position (0 to 1)
  const hoursToPosition = (hours: number) => {
    return (hours - minHours) / (maxHours - minHours);
  };

  // Convert slider position to hours
  const positionToHours = (position: number) => {
    const hours = minHours + (position * (maxHours - minHours));
    return Math.round(hours * 2) / 2; // Round to nearest 0.5
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const { dx } = gestureState;
      const currentPosition = hoursToPosition(sleepHours);
      const newPosition = Math.max(0, Math.min(1, currentPosition + (dx / sliderWidth)));
      const newHours = positionToHours(newPosition);
      setSleepHours(newHours);
    },
  });

  const handleSave = () => {
    if (selectedQuality && sleepHours) {
      onSave({ hours: sleepHours, quality: selectedQuality });
      onClose();
    }
  };

  const isValid = selectedQuality && sleepHours > 0;

  // Generate hour markers for the slider
  const generateHourMarkers = () => {
    const markers = [];
    for (let i = minHours; i <= maxHours; i += 1) {
      const position = hoursToPosition(i);
      const isMainHour = i % 2 === 0;
      
      markers.push(
        <View
          key={i}
          style={[
            styles.hourMarker,
            { left: position * sliderWidth },
            isMainHour && styles.mainHourMarker
          ]}
        >
          {isMainHour && (
            <Text style={styles.hourMarkerText}>{i}h</Text>
          )}
        </View>
      );
    }
    return markers;
  };

  const getSleepQualityColor = () => {
    if (!selectedQuality) return '#E5E7EB';
    return '#FF6B35';
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
            <Text style={styles.title}>How was your sleep?</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Sleep Quality Selection */}
            <View style={styles.qualitySection}>
              <Text style={styles.sectionTitle}>Sleep Quality</Text>
              <View style={styles.optionsContainer}>
                {sleepOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sleepOption,
                      selectedQuality === option.id && [
                        styles.selectedOption,
                        { borderColor: option.color }
                      ]
                    ]}
                    onPress={() => setSelectedQuality(option.id as 'good' | 'poor')}
                  >
                    <View style={styles.optionContent}>
                      <View style={styles.imageSection}>
                        <Image source={option.image} style={styles.sleepImage} />
                        {selectedQuality === option.id && (
                          <View style={[styles.selectedBadge, { backgroundColor: option.color }]}>
                            <option.icon size={12} color="#ffffff" />
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.textSection}>
                        <Text style={[
                          styles.optionTitle,
                          selectedQuality === option.id && { color: option.color }
                        ]}>
                          {option.title}
                        </Text>
                        <Text style={styles.optionDescription}>
                          {option.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sleep Duration Slider */}
            <View style={styles.durationSection}>
              <Text style={styles.sectionTitle}>Sleep Duration</Text>
              
              <View style={styles.durationDisplay}>
                <Text style={styles.durationValue}>{sleepHours}</Text>
                <Text style={styles.durationUnit}>hours</Text>
              </View>

              <View style={styles.sliderContainer}>
                {/* Hour markers */}
                <View style={styles.hourMarkersContainer}>
                  {generateHourMarkers()}
                </View>

                {/* Slider track */}
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderProgress,
                      { 
                        width: `${hoursToPosition(sleepHours) * 100}%`,
                        backgroundColor: getSleepQualityColor()
                      }
                    ]}
                  />
                </View>

                {/* Slider handle */}
                <View 
                  style={[
                    styles.sliderHandle,
                    { left: hoursToPosition(sleepHours) * sliderWidth - 15 }
                  ]}
                  {...panResponder.panHandlers}
                >
                  <View style={[
                    styles.sliderHandleInner,
                    { backgroundColor: getSleepQualityColor() }
                  ]}>
                    <View style={styles.sliderHandleCenter} />
                  </View>
                </View>
              </View>

              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>1h</Text>
                <Text style={styles.sliderLabelText}>12h</Text>
              </View>
            </View>
          </View>

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
                <Text style={[
                  styles.saveButtonText,
                  !isValid && styles.saveButtonTextDisabled
                ]}>
                  Save Sleep Data
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
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
    textAlign: 'center',
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
  content: {
    padding: 24,
    gap: 32,
  },
  qualitySection: {
    gap: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
    width: '100%',
  },
  sleepOption: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  optionContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  imageSection: {
    position: 'relative',
    marginRight: 20,
  },
  sleepImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  selectedBadge: {
    display: 'none',
  },
  textSection: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 22,
  },
  durationSection: {
    gap: 12,
  },
  durationDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  durationValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  durationUnit: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  sliderContainer: {
    height: 40,
    position: 'relative',
    marginHorizontal: 16,
  },
  hourMarkersContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 16,
  },
  hourMarker: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 6,
    backgroundColor: '#D1D5DB',
    transform: [{ translateX: -1 }],
  },
  mainHourMarker: {
    height: 8,
    backgroundColor: '#9CA3AF',
  },
  hourMarkerText: {
    position: 'absolute',
    top: 12,
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    transform: [{ translateX: -8 }],
  },
  sliderTrack: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  sliderProgress: {
    height: '100%',
    borderRadius: 2,
  },
  sliderHandle: {
    position: 'absolute',
    top: 14,
    width: 24,
    height: 16,
  },
  sliderHandleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderHandleCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderLabelText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  saveButtonTextDisabled: {
    color: '#ffffff',
  },
});