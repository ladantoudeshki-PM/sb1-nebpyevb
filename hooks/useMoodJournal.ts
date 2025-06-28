import { useState, useEffect } from 'react';

export interface MoodNote {
  id: string;
  text: string;
  mood: any;
  date: string;
  time: string;
  timestamp: number;
  isPrivate: boolean;
}

// Global state for mood notes
let globalNotes: MoodNote[] = [];
let listeners: ((notes: MoodNote[]) => void)[] = [];

export function useMoodJournal() {
  const [notes, setNotes] = useState<MoodNote[]>(globalNotes);

  useEffect(() => {
    const listener = (updatedNotes: MoodNote[]) => {
      setNotes(updatedNotes);
    };
    
    listeners.push(listener);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const addNote = (text: string, mood: any) => {
    const now = new Date();
    const newNote: MoodNote = {
      id: Date.now().toString(),
      text,
      mood,
      date: now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: now.getTime(),
      isPrivate: true,
    };

    globalNotes = [newNote, ...globalNotes];
    listeners.forEach(listener => listener(globalNotes));
  };

  const deleteNote = (id: string) => {
    globalNotes = globalNotes.filter(note => note.id !== id);
    listeners.forEach(listener => listener(globalNotes));
  };

  const getNotesForToday = () => {
    const today = new Date().toDateString();
    return notes.filter(note => new Date(note.timestamp).toDateString() === today);
  };

  const getNotesForWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return notes.filter(note => note.timestamp >= weekAgo.getTime());
  };

  return {
    notes,
    addNote,
    deleteNote,
    getNotesForToday,
    getNotesForWeek,
  };
}