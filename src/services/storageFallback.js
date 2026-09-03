import {
  INITIAL_COUPLE_PROFILE,
  INITIAL_NOTES,
  INITIAL_EVENTS,
  INITIAL_COUPONS,
  INITIAL_REASONS,
  INITIAL_MEMORIES,
  INITIAL_DRAWINGS,
  INITIAL_PET_DATA,
  INITIAL_DAILY_QUESTIONS,
  INITIAL_WHEEL_CONFIGS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_SCRATCH_CARDS,
  INITIAL_INSIDE_JOKES,
  INITIAL_SOS_VAULT,
  INITIAL_CYCLE_DATA,
  INITIAL_FITCHECK_DATA,
  INITIAL_WATER_DATA,
  INITIAL_HOURLY_SCHEDULE,
  INITIAL_RADAR_DATA,
  INITIAL_SAVED_PLACES,
} from './defaultData';

const STORAGE_KEYS = {
  PROFILE: 'lovehub_profile',
  NOTES: 'lovehub_notes',
  EVENTS: 'lovehub_events',
  COUPONS: 'lovehub_coupons',
  REASONS: 'lovehub_reasons',
  MEMORIES: 'lovehub_memories',
  DRAWINGS: 'lovehub_drawings',
  ACTIVE_PERSONA: 'lovehub_active_persona',
  PET: 'lovehub_pet',
  DAILY_QUESTIONS: 'lovehub_daily_questions',
  WHEEL: 'lovehub_wheel',
  QUIZ: 'lovehub_quiz',
  SCRATCH_CARDS: 'lovehub_scratch_cards',
  INSIDE_JOKES: 'lovehub_inside_jokes',
  SOS_VAULT: 'lovehub_sos_vault',
  CYCLE: 'lovehub_cycle',
  FITCHECK: 'lovehub_fitcheck',
  WATER: 'lovehub_water',
  SCHEDULE: 'lovehub_hourly_schedule',
  RADAR: 'lovehub_radar_data',
  SAVED_PLACES: 'lovehub_saved_places',
};

// Initialize BroadcastChannel for cross-tab realtime sync
let channel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('lovehub_realtime_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported:', e);
}

// Storage helpers
export const getLocalData = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultVal;
  }
};

export const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Broadcast change to other open tabs
    if (channel) {
      channel.postMessage({ type: 'SYNC_UPDATE', key, data, timestamp: Date.now() });
    }
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

// Initialize storage with default data if empty or safely merge new key events
export const initializeLocalStorage = () => {
  const existingProfile = getLocalData(STORAGE_KEYS.PROFILE, null);
  if (!existingProfile) {
    setLocalData(STORAGE_KEYS.PROFILE, INITIAL_COUPLE_PROFILE);
  } else if (existingProfile.anniversaryDate !== '2026-02-05T00:00:00') {
    // preserve any custom partner details, update date
    setLocalData(STORAGE_KEYS.PROFILE, {
      ...existingProfile,
      anniversaryDate: '2026-02-05T00:00:00',
    });
  }
  
  const existingEvents = getLocalData(STORAGE_KEYS.EVENTS, null);
  if (!existingEvents) {
    setLocalData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  } else {
    // Merge missing key events (e.g. Birthdays, Valentine's Day) without overwriting user's events
    const existingIds = new Set(existingEvents.map((e) => e.id));
    const toAdd = INITIAL_EVENTS.filter((e) => !existingIds.has(e.id));
    if (toAdd.length > 0) {
      const merged = [...existingEvents, ...toAdd].sort((a, b) => new Date(a.date) - new Date(b.date));
      setLocalData(STORAGE_KEYS.EVENTS, merged);
    }
  }

  const existingNotes = getLocalData(STORAGE_KEYS.NOTES, null);
  if (!existingNotes) {
    setLocalData(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  }

  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    setLocalData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REASONS)) {
    setLocalData(STORAGE_KEYS.REASONS, INITIAL_REASONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEMORIES)) {
    setLocalData(STORAGE_KEYS.MEMORIES, INITIAL_MEMORIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DRAWINGS)) {
    setLocalData(STORAGE_KEYS.DRAWINGS, INITIAL_DRAWINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PET)) {
    setLocalData(STORAGE_KEYS.PET, INITIAL_PET_DATA);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DAILY_QUESTIONS)) {
    setLocalData(STORAGE_KEYS.DAILY_QUESTIONS, INITIAL_DAILY_QUESTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WHEEL)) {
    setLocalData(STORAGE_KEYS.WHEEL, INITIAL_WHEEL_CONFIGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUIZ)) {
    setLocalData(STORAGE_KEYS.QUIZ, INITIAL_QUIZ_QUESTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCRATCH_CARDS)) {
    setLocalData(STORAGE_KEYS.SCRATCH_CARDS, INITIAL_SCRATCH_CARDS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.INSIDE_JOKES)) {
    setLocalData(STORAGE_KEYS.INSIDE_JOKES, INITIAL_INSIDE_JOKES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SOS_VAULT)) {
    setLocalData(STORAGE_KEYS.SOS_VAULT, INITIAL_SOS_VAULT);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CYCLE)) {
    setLocalData(STORAGE_KEYS.CYCLE, INITIAL_CYCLE_DATA);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FITCHECK)) {
    setLocalData(STORAGE_KEYS.FITCHECK, INITIAL_FITCHECK_DATA);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WATER)) {
    setLocalData(STORAGE_KEYS.WATER, INITIAL_WATER_DATA);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCHEDULE)) {
    setLocalData(STORAGE_KEYS.SCHEDULE, INITIAL_HOURLY_SCHEDULE);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RADAR)) {
    setLocalData(STORAGE_KEYS.RADAR, INITIAL_RADAR_DATA);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_PLACES)) {
    setLocalData(STORAGE_KEYS.SAVED_PLACES, INITIAL_SAVED_PLACES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_PERSONA)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PERSONA, 'partner1');
  }
};

// Broadcast Channel subscriber
export const subscribeToLocalSync = (onUpdate) => {
  const handleBroadcast = (event) => {
    if (event.data && event.data.type === 'SYNC_UPDATE') {
      onUpdate(event.data);
    }
  };

  const handleStorageEvent = (event) => {
    if (event.key && event.newValue) {
      try {
        onUpdate({
          key: event.key,
          data: JSON.parse(event.newValue),
          timestamp: Date.now(),
        });
      } catch (e) {}
    }
  };

  if (channel) {
    channel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
};

export { STORAGE_KEYS };
