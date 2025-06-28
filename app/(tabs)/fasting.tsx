import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Square, Trophy, Target, Clock, Calendar } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { FastingTimer } from '@/components/FastingTimer';
import { FastingStats } from '@/components/FastingStats';
import { TimeSelector } from '@/components/TimeSelector';
import { EndFastModal } from '@/components/EndFastModal';

export default function FastingScreen() {
  const [scrollY, setScrollY] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [targetHours, setTargetHours] = useState(16);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalFasts, setTotalFasts] = useState(23);
  const [showStartTimeModal, setShowStartTimeModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showEndFastModal, setShowEndFastModal] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());

  const handleStartFasting = () => {
    if (!isActive) {
      const fastStartTime = selectedStartTime || new Date();
      setStartTime(fastStartTime);
      setIsActive(true);
    }
  };

  const handleStopFasting = () => {
    setShowEndFastModal(true);
  };

  const handleConfirmEndFast = (endTime: Date) => {
    setIsActive(false);
    setShowEndFastModal(false);
    // Here you could calculate the actual duration based on start and end times
    // and save it to your data store
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollIndicatorContainer}>
        <View style={styles.scrollIndicator}>
          <View style={[styles.scrollThumb, { 
            transform: [{ translateY: Math.min(scrollY * 0.5, 100) }] 
          }]} />
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {!isActive && (
          <View style={styles.setupSection}>
            <Text style={styles.setupTitle}>Setup Your Fast</Text>
            
            <View style={styles.timeSelectors}>
              <TouchableOpacity 
                style={styles.timeSelector}
                onPress={() => setShowStartTimeModal(true)}
              >
                <Clock size={20} color="#FF6B35" />
                <View style={styles.timeSelectorContent}>
                  <Text style={styles.timeSelectorLabel}>Start Time</Text>
                  <Text style={styles.timeSelectorValue}>
                    {formatDateTime(selectedStartTime)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.timeSelector}
                onPress={() => setShowDurationModal(true)}
              >
                <Target size={20} color="#F7931E" />
                <View style={styles.timeSelectorContent}>
                  <Text style={styles.timeSelectorLabel}>Duration</Text>
                  <Text style={styles.timeSelectorValue}>{targetHours} hours</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.timerSection}>
          <FastingTimer
            isActive={isActive}
            startTime={startTime}
            targetHours={targetHours}
          />
        </View>

        <View style={styles.controlsSection}>
          {!isActive ? (
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={handleStartFasting}
            >
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Play size={16} color="#ffffff" />
                <Text style={styles.buttonText}>Start Fasting</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity style={styles.controlButton} onPress={handleStopFasting}>
                <Square size={20} color="#FF6B35" />
                <Text style={styles.controlButtonText}>End Fast</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.bottomContent}>
          <FastingStats
            currentStreak={currentStreak}
            totalFasts={totalFasts}
            averageWindow={targetHours}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Fasts</Text>
            <View style={styles.historyContainer}>
              {[
                { date: 'Today', duration: '14h 32m', window: '16h', completed: false },
                { date: 'Yesterday', duration: '16h 15m', window: '16h', completed: true },
                { date: '2 days ago', duration: '18h 45m', window: '18h', completed: true },
                { date: '3 days ago', duration: '16h 02m', window: '16h', completed: true },
              ].map((fast, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyDate}>{fast.date}</Text>
                    <Text style={styles.historyWindow}>{fast.window} fast</Text>
                  </View>
                  <View style={styles.historyStats}>
                    <Text style={[
                      styles.historyDuration,
                      { color: fast.completed ? '#FF6B35' : '#6B7280' }
                    ]}>
                      {fast.duration}
                    </Text>
                    {fast.completed && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips & Benefits</Text>
            <View style={styles.tipsContainer}>
              <View style={styles.tipCard}>
                <Target size={24} color="#FF6B35" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Stay Hydrated</Text>
                  <Text style={styles.tipDescription}>
                    Drink plenty of water during your fasting window
                  </Text>
                </View>
              </View>
              <View style={styles.tipCard}>
                <Trophy size={24} color="#F7931E" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Start Gradually</Text>
                  <Text style={styles.tipDescription}>
                    Begin with shorter windows and gradually increase
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Start Time Modal */}
      <Modal
        visible={showStartTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStartTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Start Time</Text>
            <TimeSelector
              selectedTime={selectedStartTime}
              onTimeChange={setSelectedStartTime}
              mode="datetime"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowStartTimeModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setShowStartTimeModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Duration Modal */}
      <Modal
        visible={showDurationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDurationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Duration</Text>
            <TimeSelector
              selectedHours={targetHours}
              onHoursChange={setTargetHours}
              mode="duration"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowDurationModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setShowDurationModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* End Fast Confirmation Modal */}
      <EndFastModal
        visible={showEndFastModal}
        onClose={() => setShowEndFastModal(false)}
        onConfirm={handleConfirmEndFast}
        startTime={startTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollIndicatorContainer: {
    position: 'absolute',
    right: 4,
    top: 60,
    bottom: 60,
    width: 4,
    zIndex: 1000,
  },
  scrollIndicator: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    position: 'relative',
  },
  scrollThumb: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    opacity: 0.8,
  },
  setupSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 12,
  },
  setupTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  timeSelectors: {
    gap: 12,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  timeSelectorContent: {
    flex: 1,
    marginLeft: 16,
  },
  timeSelectorLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  timeSelectorValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  timerSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  controlsSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: 'center',
    width: '80%',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  activeControls: {
    alignItems: 'center',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  controlButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  historyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  historyWindow: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  historyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDuration: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  completedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 10,
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
  tipsContainer: {
    gap: 10,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tipContent: {
    flex: 1,
    marginLeft: 14,
  },
  tipTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#FF6B35',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  modalButtonTextPrimary: {
    color: '#ffffff',
  },
});