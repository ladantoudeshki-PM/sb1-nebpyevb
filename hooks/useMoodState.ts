import { useState, useEffect } from 'react';

interface Mood {
  id: number;
  title: string;
  image: any;
  color: string;
}

const defaultMoods: Mood[] = [
  {
    id: 1,
    title: 'Happy & Energetic',
    image: require('../assets/images/Happy-Energetic.png'),
    color: '#FFD700',
  },
  {
    id: 2,
    title: 'Peaceful',
    image: require('../assets/images/Peaceful.png'),
    color: '#90EE90',
  },
  {
    id: 3,
    title: 'Gloomy and Sad',
    image: require('../assets/images/Gloomy and sad.png'),
    color: '#87CEEB',
  },
  {
    id: 4,
    title: 'Angry',
    image: require('../assets/images/Anrgy.png'),
    color: '#FF6B6B',
  },
];

// Global state for mood
let globalMoodState: Mood = defaultMoods[1]; // Default to Peaceful
let listeners: ((mood: Mood) => void)[] = [];

export function useMoodState() {
  const [currentMood, setCurrentMood] = useState<Mood>(globalMoodState);

  useEffect(() => {
    const listener = (mood: Mood) => {
      setCurrentMood(mood);
    };
    
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const updateMood = (mood: Mood) => {
    globalMoodState = mood;
    listeners.forEach(listener => listener(mood));
  };

  return {
    currentMood,
    updateMood,
    moods: defaultMoods,
  };
}