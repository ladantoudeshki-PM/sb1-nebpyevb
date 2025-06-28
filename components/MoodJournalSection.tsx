import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { Calendar, Clock, Trash2, Heart } from 'lucide-react-native';
import { useMoodJournal, MoodNote } from '@/hooks/useMoodJournal';

interface MoodJournalSectionProps {
  notes: MoodNote[];
  onDeleteNote: (id: string) => void;
}

export function MoodJournalSection({ notes, onDeleteNote }: MoodJournalSectionProps) {
  if (notes.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Heart size={48} color="#E5E7EB" />
        <Text style={styles.emptyStateTitle}>No journal entries yet</Text>
        <Text style={styles.emptyStateText}>
          Start writing about your feelings and thoughts to track your emotional journey
        </Text>
      </View>
    );
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = new Date().getTime();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Journal Entries</Text>
      <ScrollView style={styles.notesContainer} showsVerticalScrollIndicator={false}>
        {notes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <View style={styles.noteHeaderLeft}>
                <View style={styles.moodIndicator}>
                  <Image source={note.mood.image} style={styles.moodImage} />
                </View>
                <View style={styles.noteMetadata}>
                  <Text style={styles.noteMood}>{note.mood.title}</Text>
                  <View style={styles.noteTimeContainer}>
                    <Calendar size={12} color="#6B7280" />
                    <Text style={styles.noteTime}>{note.date}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.noteHeaderRight}>
                <Text style={styles.relativeTime}>{formatRelativeTime(note.timestamp)}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => onDeleteNote(note.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.noteText} numberOfLines={4}>
              {note.text}
            </Text>
            
            <View style={styles.noteFooter}>
              <View style={styles.timeContainer}>
                <Clock size={12} color="#9CA3AF" />
                <Text style={styles.noteTimeText}>{note.time}</Text>
              </View>
              {note.isPrivate && (
                <View style={styles.privateIndicator}>
                  <Text style={styles.privateText}>Private</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  notesContainer: {
    paddingHorizontal: 16,
    maxHeight: 400,
  },
  noteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteHeaderRight: {
    alignItems: 'flex-end',
  },
  moodIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moodImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  noteMetadata: {
    flex: 1,
  },
  noteMood: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  noteTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  relativeTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  privateIndicator: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  privateText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});