import { useState, useEffect } from 'react';

export interface DayPlan {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  isRestDay: boolean;
  type?: 'upper-body' | 'lower-body' | 'cardio' | 'yoga' | 'mixed' | 'custom';
  customType?: string;
  notes?: string;
  targetDuration?: number; // in minutes
}

const defaultWeeklyPlan: DayPlan[] = [
  { dayOfWeek: 0, dayName: 'Sunday', isRestDay: true },
  { dayOfWeek: 1, dayName: 'Monday', isRestDay: false, type: 'upper-body', targetDuration: 45 },
  { dayOfWeek: 2, dayName: 'Tuesday', isRestDay: false, type: 'cardio', targetDuration: 30 },
  { dayOfWeek: 3, dayName: 'Wednesday', isRestDay: false, type: 'lower-body', targetDuration: 45 },
  { dayOfWeek: 4, dayName: 'Thursday', isRestDay: true },
  { dayOfWeek: 5, dayName: 'Friday', isRestDay: false, type: 'mixed', targetDuration: 40 },
  { dayOfWeek: 6, dayName: 'Saturday', isRestDay: false, type: 'yoga', targetDuration: 30 },
];

// Global state for workout plan
let globalWeeklyPlan: DayPlan[] = defaultWeeklyPlan;
let listeners: ((plan: DayPlan[]) => void)[] = [];

export function useWorkoutPlan() {
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(globalWeeklyPlan);

  useEffect(() => {
    const listener = (plan: DayPlan[]) => {
      setWeeklyPlan(plan);
    };
    
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const updateWeeklyPlan = (newPlan: DayPlan[]) => {
    globalWeeklyPlan = newPlan;
    listeners.forEach(listener => listener(newPlan));
  };

  const updateDayPlan = (dayOfWeek: number, updates: Partial<DayPlan>) => {
    const updatedPlan = globalWeeklyPlan.map(day => 
      day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day
    );
    updateWeeklyPlan(updatedPlan);
  };

  const getPlannedWorkoutDays = () => {
    return globalWeeklyPlan.filter(day => !day.isRestDay).length;
  };

  return {
    weeklyPlan,
    updateWeeklyPlan,
    updateDayPlan,
    getPlannedWorkoutDays,
  };
}