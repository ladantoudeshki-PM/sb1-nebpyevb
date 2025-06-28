import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface TimeSelectorProps {
  selectedTime?: Date;
  selectedHours?: number;
  onTimeChange?: (time: Date) => void;
  onHoursChange?: (hours: number) => void;
  mode: 'datetime' | 'duration';
}

export function TimeSelector({ 
  selectedTime, 
  selectedHours, 
  onTimeChange, 
  onHoursChange, 
  mode 
}: TimeSelectorProps) {
  const [currentDate] = useState(new Date());

  if (mode === 'duration') {
    const hours = Array.from({ length: 24 }, (_, i) => i + 1);
    
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Fasting Duration</Text>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {hours.map((hour) => (
            <TouchableOpacity
              key={hour}
              style={[
                styles.timeOption,
                selectedHours === hour && styles.selectedTimeOption
              ]}
              onPress={() => onHoursChange?.(hour)}
            >
              <Text style={[
                styles.timeOptionText,
                selectedHours === hour && styles.selectedTimeOptionText
              ]}>
                {hour} {hour === 1 ? 'hour' : 'hours'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // DateTime mode
  const generateTimeOptions = () => {
    const options = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Generate time slots for yesterday and today
    [yesterday, today].forEach((date, dayIndex) => {
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeOption = new Date(date);
          timeOption.setHours(hour, minute, 0, 0);
          
          // Only show past times
          if (timeOption <= currentDate) {
            options.push({
              date: timeOption,
              label: timeOption.toLocaleString('en-US', {
                weekday: dayIndex === 0 ? 'short' : undefined,
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              isToday: dayIndex === 1,
            });
          }
        }
      }
    });

    return options.reverse(); // Most recent first
  };

  const timeOptions = generateTimeOptions();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>When did you start fasting?</Text>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {timeOptions.slice(0, 48).map((option, index) => { // Limit to 48 options
          const isSelected = selectedTime && 
            Math.abs(selectedTime.getTime() - option.date.getTime()) < 60000; // Within 1 minute
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeOption,
                isSelected && styles.selectedTimeOption
              ]}
              onPress={() => onTimeChange?.(option.date)}
            >
              <Text style={[
                styles.timeOptionText,
                isSelected && styles.selectedTimeOptionText
              ]}>
                {option.label}
              </Text>
              {option.isToday && (
                <Text style={styles.todayBadge}>Today</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    maxHeight: 300,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  timeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  selectedTimeOption: {
    backgroundColor: '#FF6B35',
  },
  timeOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  selectedTimeOptionText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  todayBadge: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F7931E',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});