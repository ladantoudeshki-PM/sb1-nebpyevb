import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface MoodSelectorProps {
  moods: any[];
  selectedMood: any;
  onMoodSelect?: (mood: any) => void;
}

export function MoodSelector({ moods, selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.moodsGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodOption,
              selectedMood.id === mood.id && styles.selectedOption,
              { borderColor: selectedMood.id === mood.id ? mood.color : '#E5E7EB' }
            ]}
            onPress={() => onMoodSelect?.(mood)}
          >
            <Image source={mood.image} style={styles.moodImage} />
            <Text style={[
              styles.moodLabel,
              { color: selectedMood.id === mood.id ? mood.color : '#1F2937' }
            ]}>
              {mood.title}
            </Text>
            {selectedMood.id === mood.id && (
              <View style={[styles.selectedIndicator, { backgroundColor: mood.color }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  moodOption: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    width: '47%', // Two columns with some spacing
    backgroundColor: '#ffffff',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    minHeight: 120,
    justifyContent: 'center',
  },
  selectedOption: {
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  moodImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  moodLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});