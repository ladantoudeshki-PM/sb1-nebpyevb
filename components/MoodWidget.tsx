import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useState } from 'react';
import { MoodSelectionModal } from './MoodSelectionModal';
import { useMoodState } from '@/hooks/useMoodState';
import { router } from 'expo-router';

export function MoodWidget() {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const { currentMood, updateMood } = useMoodState();

  const handleMoodPress = () => {
    // Navigate to mood page
    router.push('/(tabs)/mood');
  };

  const handleQuickMoodSelect = () => {
    setShowMoodModal(true);
  };

  const handleMoodSelect = (mood: any) => {
    updateMood(mood);
  };

  return (
    <>
      <View style={styles.moodWidget}>
        <TouchableOpacity 
          style={styles.moodCard} 
          onPress={handleMoodPress}
          onLongPress={handleQuickMoodSelect}
        >
          <View style={styles.moodContent}>
            <Image source={currentMood.image} style={styles.moodImage} />
            <Text style={styles.moodLabel}>Mood</Text>
            <Text style={styles.moodSubtext}>Today</Text>
          </View>
        </TouchableOpacity>
        
        {/* Quick mood selection button */}
        <TouchableOpacity 
          style={styles.quickSelectButton} 
          onPress={handleQuickMoodSelect}
        >
          <Heart size={12} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <MoodSelectionModal
        visible={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onMoodSelect={handleMoodSelect}
        currentMood={currentMood}
      />
    </>
  );
}

const styles = StyleSheet.create({
  moodWidget: {
    width: 100,
    position: 'relative',
  },
  moodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFE4D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  moodContent: {
    alignItems: 'center',
    gap: 4,
  },
  moodImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  moodLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  moodSubtext: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickSelectButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});