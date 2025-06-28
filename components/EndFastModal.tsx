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
import { X, Calendar, Clock, CircleCheck as CheckCircle, ChevronDown } from 'lucide-react-native';

interface EndFastModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (endTime: Date) => void;
  startTime: Date | null;
}

export function EndFastModal({ 
  visible, 
  onClose, 
  onConfirm,
  startTime 
}: EndFastModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    [yesterday, today].forEach((date) => {
      if (!startTime || date >= new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate())) {
        options.push({
          date: new Date(date),
          label: date.toDateString() === today.toDateString() ? 'Today' : 
                 date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
          isToday: date.toDateString() === today.toDateString()
        });
      }
    });

    return options;
  };

  const generateTimeOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeOption = new Date();
        timeOption.setHours(hour, minute, 0, 0);
        
        // Create combined date/time for validation
        const combinedDateTime = new Date(selectedDate);
        combinedDateTime.setHours(hour, minute, 0, 0);
        
        // Only show valid times (after start time and not in future)
        if (startTime && combinedDateTime > startTime && combinedDateTime <= now) {
          options.push({
            time: timeOption,
            label: timeOption.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            value: { hour, minute }
          });
        }
      }
    }

    return options;
  };

  const handleConfirm = () => {
    const endTime = new Date(selectedDate);
    endTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
    onConfirm(endTime);
  };

  const formatSelectedDateTime = () => {
    const dateStr = selectedDate.toDateString() === new Date().toDateString() ? 
      'Today' : selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const timeStr = selectedTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${dateStr}, ${timeStr}`;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

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
            <Text style={styles.title}>When did you end your fast?</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.selectionContainer}>
            <Text style={styles.selectionLabel}>Selected Time:</Text>
            <View style={styles.selectedTimeDisplay}>
              <Calendar size={20} color="#FF6B35" />
              <Text style={styles.selectedTimeText}>{formatSelectedDateTime()}</Text>
            </View>
          </View>

          <View style={styles.selectorContainer}>
            {/* Date Selector */}
            <View style={styles.selectorSection}>
              <TouchableOpacity 
                style={styles.selectorButton}
                onPress={() => {
                  setShowDatePicker(!showDatePicker);
                  setShowTimePicker(false);
                }}
              >
                <Calendar size={18} color="#FF6B35" />
                <Text style={styles.selectorButtonText}>
                  {selectedDate.toDateString() === new Date().toDateString() ? 
                    'Today' : selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </Text>
                <ChevronDown size={18} color="#6B7280" />
              </TouchableOpacity>

              {showDatePicker && (
                <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
                  {dateOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.option,
                        selectedDate.toDateString() === option.date.toDateString() && styles.selectedOption
                      ]}
                      onPress={() => {
                        setSelectedDate(option.date);
                        setShowDatePicker(false);
                      }}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedDate.toDateString() === option.date.toDateString() && styles.selectedOptionText
                      ]}>
                        {option.label}
                      </Text>
                      {selectedDate.toDateString() === option.date.toDateString() && (
                        <CheckCircle size={16} color="#FF6B35" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Time Selector */}
            <View style={styles.selectorSection}>
              <TouchableOpacity 
                style={styles.selectorButton}
                onPress={() => {
                  setShowTimePicker(!showTimePicker);
                  setShowDatePicker(false);
                }}
              >
                <Clock size={18} color="#F7931E" />
                <Text style={styles.selectorButtonText}>
                  {selectedTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </Text>
                <ChevronDown size={18} color="#6B7280" />
              </TouchableOpacity>

              {showTimePicker && (
                <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
                  {timeOptions.map((option, index) => {
                    const isSelected = selectedTime.getHours() === option.value.hour && 
                                     selectedTime.getMinutes() === option.value.minute;
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.option,
                          isSelected && styles.selectedOption
                        ]}
                        onPress={() => {
                          const newTime = new Date();
                          newTime.setHours(option.value.hour, option.value.minute, 0, 0);
                          setSelectedTime(newTime);
                          setShowTimePicker(false);
                        }}
                      >
                        <Text style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText
                        ]}>
                          {option.label}
                        </Text>
                        {isSelected && (
                          <CheckCircle size={16} color="#F7931E" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={handleConfirm}
            >
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                style={styles.confirmButtonGradient}
              >
                <CheckCircle size={16} color="#ffffff" />
                <Text style={styles.confirmButtonText}>End Fast</Text>
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
  selectionContainer: {
    padding: 24,
    paddingBottom: 16,
  },
  selectionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  selectedTimeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  selectedTimeText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  selectorContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  selectorSection: {
    position: 'relative',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 12,
  },
  optionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#FFF3E0',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  selectedOptionText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 16,
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
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});