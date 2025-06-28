import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Heart, Zap } from 'lucide-react-native';
import { MoodChart } from '@/components/MoodChart';
import { MoodSelector } from '@/components/MoodSelector';
import { useMoodState } from '@/hooks/useMoodState';
import { MoodJournalModal } from '@/components/MoodJournalModal';
import { MoodJournalSection } from '@/components/MoodJournalSection';
import { useMoodJournal } from '@/hooks/useMoodJournal';

export default function MoodScreen() {
  const { currentMood, updateMood, moods } = useMoodState();
  const { notes, addNote, deleteNote } = useMoodJournal();
  const [showJournalModal, setShowJournalModal] = useState(false);

  const handleAddNote = (noteText: string) => {
    addNote(noteText, currentMood);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mood Tracker</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <MoodSelector moods={moods} selectedMood={currentMood} onMoodSelect={updateMood} />
        </View>

        <View style={styles.section}>
          <View style={styles.currentMoodCard}>
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.currentMoodGradient}
            >
              <View style={styles.currentMoodContent}>
                <Image source={currentMood.image} style={styles.currentMoodImage} />
                <View style={styles.currentMoodText}>
                  <Text style={styles.currentMoodLabel}>Today's Mood</Text>
                  <Text style={styles.currentMoodValue}>{currentMood.title}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Scroll Down Indicator */}
        <View style={styles.scrollIndicator}>
          <View style={styles.scrollDots}>
            <View style={[styles.scrollDot, styles.activeDot]} />
            <View style={styles.scrollDot} />
            <View style={styles.scrollDot} />
          </View>
          <Text style={styles.scrollHint}>Scroll down for more insights</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Trend</Text>
            <TouchableOpacity style={styles.trendButton}>
              <TrendingUp size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
          <MoodChart />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Patterns</Text>
          <View style={styles.patternsContainer}>
            <View style={styles.patternCard}>
              <Heart size={24} color="#FF6B35" />
              <Text style={styles.patternTitle}>Best Days</Text>
              <Text style={styles.patternValue}>Weekends</Text>
              <Text style={styles.patternDescription}>
                You feel most positive on weekends
              </Text>
            </View>
            <View style={styles.patternCard}>
              <Zap size={24} color="#F7931E" />
              <Text style={styles.patternTitle}>Stress Peaks</Text>
              <Text style={styles.patternValue}>Mondays</Text>
              <Text style={styles.patternDescription}>
                Consider morning meditation
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Journal</Text>
          <TouchableOpacity 
            style={styles.journalButton}
            onPress={() => setShowJournalModal(true)}
          >
            <Text style={styles.journalButtonText}>Add Note About Today</Text>
          </TouchableOpacity>
        </View>

        <MoodJournalSection 
          notes={notes} 
          onDeleteNote={deleteNote}
        />
      </ScrollView>

      <MoodJournalModal
        visible={showJournalModal}
        onClose={() => setShowJournalModal(false)}
        onSaveNote={handleAddNote}
        currentMood={currentMood}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  trendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentMoodCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  currentMoodGradient: {
    padding: 24,
  },
  currentMoodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentMoodImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 20,
    backgroundColor: 'transparent',
  },
  currentMoodText: {
    flex: 1,
  },
  currentMoodLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  currentMoodValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  patternsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  patternCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  patternTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  patternValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  patternDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  journalButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  journalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  scrollIndicator: {
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  scrollDots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  scrollDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    backgroundColor: '#FF6B35',
    width: 20,
  },
  scrollHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});