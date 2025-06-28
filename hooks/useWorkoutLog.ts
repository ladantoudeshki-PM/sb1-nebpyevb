import { useState, useEffect } from 'react';

export interface Exercise {
  id: string;
  name: string;
  type: 'upper-body' | 'lower-body' | 'cardio' | 'yoga' | 'mixed' | 'custom';
  duration: number; // in minutes
  notes?: string;
  date: string;
  time: string;
  timestamp: number;
  caloriesBurned?: number;
}

export interface WeekStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  averageDuration: number;
  workoutDays: number;
  targetDays: number;
}

// Global state for workout log
let globalWorkouts: Exercise[] = [
  {
    id: '1',
    name: 'Morning Push-ups & Squats',
    type: 'mixed',
    duration: 25,
    notes: 'Felt great today! 3 sets of 15 push-ups, 3 sets of 20 squats',
    date: new Date().toLocaleDateString(),
    time: '8:30 AM',
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    caloriesBurned: 180,
  },
  {
    id: '2',
    name: 'Evening Yoga Flow',
    type: 'yoga',
    duration: 30,
    notes: 'Relaxing session focusing on flexibility',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
    time: '7:00 PM',
    timestamp: Date.now() - 24 * 60 * 60 * 1000, // Yesterday
    caloriesBurned: 120,
  },
];

let listeners: ((workouts: Exercise[]) => void)[] = [];

export function useWorkoutLog() {
  const [workouts, setWorkouts] = useState<Exercise[]>(globalWorkouts);

  useEffect(() => {
    const listener = (updatedWorkouts: Exercise[]) => {
      setWorkouts(updatedWorkouts);
    };
    
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const addWorkout = (exercise: Omit<Exercise, 'id' | 'date' | 'time' | 'timestamp'>) => {
    const now = new Date();
    const newWorkout: Exercise = {
      ...exercise,
      id: Date.now().toString(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: now.getTime(),
    };

    globalWorkouts = [newWorkout, ...globalWorkouts];
    listeners.forEach(listener => listener(globalWorkouts));
  };

  const deleteWorkout = (id: string) => {
    globalWorkouts = globalWorkouts.filter(workout => workout.id !== id);
    listeners.forEach(listener => listener(globalWorkouts));
  };

  const getTodayWorkouts = () => {
    const today = new Date().toDateString();
    return workouts.filter(workout => new Date(workout.timestamp).toDateString() === today);
  };

  const getWeekStats = (): WeekStats => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekWorkouts = workouts.filter(workout => workout.timestamp >= weekAgo.getTime());
    
    const totalWorkouts = weekWorkouts.length;
    const totalDuration = weekWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCalories = weekWorkouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);
    const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    
    // Count unique workout days
    const workoutDays = new Set(
      weekWorkouts.map(workout => new Date(workout.timestamp).toDateString())
    ).size;

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      averageDuration,
      workoutDays,
      targetDays: 5, // This could come from user preferences
    };
  };

  return {
    workouts,
    addWorkout,
    deleteWorkout,
    getTodayWorkouts,
    getWeekStats,
  };
}