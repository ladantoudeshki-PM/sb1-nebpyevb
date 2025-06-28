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
import { X, Save, BookOpen, Calendar, Heart } from 'lucide-react-native';

interface MoodJournalModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveNote: (note: string) => void;
  currentMood?: any;
}

export function MoodJournalModal({ 
  visible, 
  onClose, 
  onSaveNote,
  currentMood 
}: MoodJournalModalProps) {
  const [noteText, setNoteText] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleSave = () => {
    if (noteText.trim()) {
      onSaveNote(noteText.trim());
      setNoteText('');
      onClose();
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const placeholderTexts = [
    "What made you feel this way today?",
    "Describe your thoughts and emotions...",
    "What happened that influenced your mood?",
    "How are you taking care of yourself today?",
    "What are you grateful for right now?",
  ];

  const randomPlaceholder = placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)];

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
              <BookOpen size={24} color="#FF6B35" />
              <Text style={styles.title}>Mood Journal</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeRow}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.dateTimeText}>{getCurrentDate()}</Text>
            </View>
            <Text style={styles.timeText}>{getCurrentTime()}</Text>
          </View>

          {currentMood && (
            <View style={styles.moodContext}>
              <Text style={styles.moodContextLabel}>Current Mood:</Text>
              <View style={styles.moodContextContent}>
                <View style={[styles.moodDot, { backgroundColor: currentMood.color }]} />
                <Text style={[styles.moodContextText, { color: currentMood.color }]}>
                  {currentMood.title}
                </Text>
              </View>
            </View>
          )}

          <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.noteInput}
                placeholder={randomPlaceholder}
                placeholderTextColor="#9CA3AF"
                value={noteText}
                onChangeText={setNoteText}
                multiline
                textAlignVertical="top"
                autoFocus
              />
            </View>

            <View style={styles.privacyContainer}>
              <TouchableOpacity 
                style={styles.privacyToggle}
                onPress={() => setIsPrivate(!isPrivate)}
              >
                <View style={[
                  styles.privacyCheckbox,
                  isPrivate && styles.privacyCheckboxActive
                ]}>
                  {isPrivate && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.privacyLabel}>Keep this note private</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                !noteText.trim() && styles.saveButtonDisabled
              ]} 
              onPress={handleSave}
              disabled={!noteText.trim()}
            >
              <LinearGradient
                colors={noteText.trim() ? ['#FF6B35', '#F7931E'] : ['#D1D5DB', '#9CA3AF']}
                style={styles.saveButtonGradient}
              >
                <Save size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save Note</Text>
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
    height: '85%',
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
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 24,
  },
  moodContext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFF8F5',
  },
  moodContextLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  moodContextContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  moodContextText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 24,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 24,
    textAlignVertical: 'top',
    minHeight: 200,
    padding: 0,
  },
  privacyContainer: {
    marginBottom: 16,
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyCheckboxActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  checkmark: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
  privacyLabel: {
    fontSize: 14,
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