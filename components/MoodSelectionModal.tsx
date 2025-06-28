import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Heart } from 'lucide-react-native';

import { useMoodState } from '@/hooks/useMoodState';

interface MoodSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onMoodSelect: (mood: any) => void;
  currentMood?: any;
}

export function MoodSelectionModal({ 
  visible, 
  onClose, 
  onMoodSelect,
  currentMood 
}: MoodSelectionModalProps) {
  const [selectedMood, setSelectedMood] = useState<any>(currentMood || null);
  const { moods } = useMoodState();

  const handleMoodSelect = (mood: any) => {
    setSelectedMood(mood);
  };

  const handleConfirm = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood);
      onClose();
    }
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
            <Text style={styles.title}>How are you feeling today?</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            How are you feeling today? Select your current mood.
          </Text>

          <ScrollView style={styles.moodsContainer} showsVerticalScrollIndicator={false}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodOption,
                  selectedMood?.id === mood.id && [
                    styles.selectedOption,
                    { backgroundColor: mood.color + '15', borderColor: mood.color }
                  ]
                ]}
                onPress={() => handleMoodSelect(mood)}
              >
                <View style={styles.moodContent}>
                  <View style={styles.imageContainer}>
                    <Image source={mood.image} style={styles.moodImage} />
                    {selectedMood?.id === mood.id && (
                      <View style={[styles.selectedBadge, { backgroundColor: mood.color }]}>
                        <Heart size={12} color="#ffffff" />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.moodTextContainer}>
                    <Text style={[
                      styles.moodTitle,
                      selectedMood?.id === mood.id && { color: mood.color }
                    ]}>
                      {mood.title}
                    </Text>
                    <Text style={styles.moodDescription}>
                      {mood.id === 1 ? 'Feeling energetic and joyful' :
                       mood.id === 2 ? 'Calm and content' :
                       mood.id === 3 ? 'Feeling down or melancholy' :
                       'Frustrated or irritated'}
                    </Text>
                  </View>
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
                styles.confirmButton, 
                !selectedMood && styles.confirmButtonDisabled
              ]} 
              onPress={handleConfirm}
              disabled={!selectedMood}
            >
              <LinearGradient
                colors={selectedMood ? ['#FF6B35', '#F7931E'] : ['#D1D5DB', '#9CA3AF']}
                style={styles.confirmButtonGradient}
              >
                <Heart size={16} color="#ffffff" />
                <Text style={styles.confirmButtonText}>
                  Update Mood
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
    maxWidth: 400,
    maxHeight: '85%',
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
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
    lineHeight: 22,
  },
  moodsContainer: {
    paddingHorizontal: 24,
    maxHeight: 400,
  },
  moodOption: {
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
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  moodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  moodImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  selectedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  moodTextContainer: {
    flex: 1,
  },
  moodTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
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