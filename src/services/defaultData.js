// Pure clean initial state for Ceren & Tahir (Start date: 05.02.2026)

export const INITIAL_COUPLE_PROFILE = {
  partner1: {
    name: 'Ceren',
    avatar: '👱🏼‍♀️',
    nickname: 'Bitanem',
    color: '#fb7185',
  },
  partner2: {
    name: 'Tahir',
    avatar: '👨🏻‍🦰',
    nickname: 'Sevgilim',
    color: '#60a5fa',
  },
  anniversaryDate: '2026-02-05T00:00:00',
  relationshipTitle: 'Ceren ❤️ Tahir',
  ourSong: 'Radiohead - Jigsaw Falling Into Place',
  spotifyUrl: 'https://open.spotify.com/track/0YJ9FWWHn9EfnN0lHwbzvV',
  dailyQuote: 'Seninle geçen her saniye, hayatımın en güzel melodisi...',
  dailyQuoteAuthor: 'Ceren & Tahir',
  pinCode: '9999',
  pinQuestion: 'İlk buluştuğumuz gün neredeydik?',
  pinAnswer: 'penguen',
};

// Clean empty notes board
export const INITIAL_NOTES = [];

// Clean events: Only relationship start, monthly 5ths, birthdays and Valentine's Day
export const generateAnniversaryEvents = () => {
  const events = [
    {
      id: 'anniv-start',
      title: 'Aşkımızın Başlangıcı 💖',
      date: '2026-02-05',
      category: 'anniversary',
      icon: '💖',
      description: '05.02.2026 - Hayatımızın en güzel başlangıcı.',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-1',
      title: '1. Ay Dönümümüz 💖',
      date: '2026-03-05',
      category: 'anniversary',
      icon: '💖',
      description: '1. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-2',
      title: '2. Ay Dönümümüz 💖',
      date: '2026-04-05',
      category: 'anniversary',
      icon: '💖',
      description: '2. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-3',
      title: '3. Ay Dönümümüz 💖',
      date: '2026-05-05',
      category: 'anniversary',
      icon: '💖',
      description: '3. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-4',
      title: '4. Ay Dönümümüz 💖',
      date: '2026-06-05',
      category: 'anniversary',
      icon: '💖',
      description: '4. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-5',
      title: '5. Ay Dönümümüz 💖',
      date: '2026-07-05',
      category: 'anniversary',
      icon: '💖',
      description: '5. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-6',
      title: '6. Ay Dönümümüz (Yarım Yıl!) 💖',
      date: '2026-08-05',
      category: 'anniversary',
      icon: '🎉',
      description: '6. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-7',
      title: '7. Ay Dönümümüz! 💖🎉',
      date: '2026-09-05',
      category: 'anniversary',
      icon: '✨',
      description: '05.09.2026 - 7. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'bday-tahir',
      title: 'Tahir Doğum Günü 🎂🎉',
      date: '2026-09-09',
      category: 'birthday',
      icon: '🎂',
      description: '09.09 - Tahir Doğum Günü',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-8',
      title: '8. Ay Dönümümüz 💖',
      date: '2026-10-05',
      category: 'anniversary',
      icon: '💖',
      description: '8. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'bday-ceren',
      title: 'Ceren Doğum Günü 🎂🎉',
      date: '2026-10-27',
      category: 'birthday',
      icon: '🎂',
      description: '27.10 - Ceren Doğum Günü',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-9',
      title: '9. Ay Dönümümüz 💖',
      date: '2026-11-05',
      category: 'anniversary',
      icon: '💖',
      description: '9. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-10',
      title: '10. Ay Dönümümüz 💖',
      date: '2026-12-05',
      category: 'anniversary',
      icon: '💖',
      description: '10. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-11',
      title: '11. Ay Dönümümüz 💖',
      date: '2027-01-05',
      category: 'anniversary',
      icon: '💖',
      description: '11. Ay Dönümümüz',
      isTimeCapsule: false,
    },
    {
      id: 'anniv-year-1',
      title: 'BÜYÜK 1. YIL DÖNÜMÜMÜZ! 🥂🎉💖',
      date: '2027-02-05',
      category: 'anniversary',
      icon: '👑',
      description: '05.02.2027 - 1. Yıl Dönümümüz!',
      isTimeCapsule: false,
    },
    {
      id: 'valentines-day-2027',
      title: 'Sevgililer Günü 💖🌹',
      date: '2027-02-14',
      category: 'date',
      icon: '🌹',
      description: '14 Şubat - Sevgililer Günü',
      isTimeCapsule: false,
    },
  ];
  return events;
};

export const INITIAL_EVENTS = generateAnniversaryEvents();

// Clean empty collections
export const INITIAL_COUPONS = [];
export const INITIAL_REASONS = [];
export const INITIAL_MEMORIES = [];
export const INITIAL_DRAWINGS = [];

// Preset songs
export const PRESET_SONGS = [
  {
    title: 'Jigsaw Falling Into Place',
    artist: 'Radiohead',
    spotifyUrl: 'https://open.spotify.com/track/0YJ9FWWHn9EfnN0lHwbzvV',
  },
  {
    title: 'Perfect',
    artist: 'Ed Sheeran',
    spotifyUrl: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v',
  },
  {
    title: 'Until I Found You',
    artist: 'Stephen Sanchez',
    spotifyUrl: 'https://open.spotify.com/track/0T5iIrTTrmBQWZrBGg8YW7',
  },
  {
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    spotifyUrl: 'https://open.spotify.com/track/6lanRgr6wX096YUmUVFxSt',
  },
  {
    title: "Can't Help Falling in Love",
    artist: 'Kina Grannis',
    spotifyUrl: 'https://open.spotify.com/track/6nRpvQkK2WjHskkL92cTzD',
  },
];

// Virtual Pet Initial (Level 1)
export const INITIAL_PET_DATA = {
  xp: 0,
  level: 1,
  type: 'tree',
  name: 'Aşk Ağacımız 🌱',
  lastWatered: new Date().toISOString(),
  lastPetted: new Date().toISOString(),
  mood: 'happy',
  unlockedBadges: [],
};

// Clean empty Daily Questions
export const INITIAL_DAILY_QUESTIONS = [];

// Decision Wheel Config
export const INITIAL_WHEEL_CONFIGS = {
  currentCategory: 'food',
  categories: {
    food: {
      title: 'Ne Yiyelim? 🍝',
      options: [
        { id: 'opt-1', text: 'MAKARNA! 🍝', color: '#fb7185' },
        { id: 'opt-2', text: 'Pizza 🍕', color: '#f43f5e' },
        { id: 'opt-3', text: 'Ev Yemeği 🥗', color: '#34d399' },
        { id: 'opt-4', text: 'Tatlı & Kahve ☕', color: '#f472b6' },
      ],
    },
    activity: {
      title: 'Ne Yapsak? 🎬',
      options: [
        { id: 'act-1', text: 'Film / Dizi 🎬', color: '#fb7185' },
        { id: 'act-2', text: 'Yürüyüş & Kahve ☕', color: '#34d399' },
        { id: 'act-3', text: 'Oyun Oyna 🎮', color: '#818cf8' },
        { id: 'act-4', text: 'Masaj Saati 💆‍♀️', color: '#f472b6' },
      ],
    },
    movies: {
      title: 'Film Türü? 🍿',
      options: [
        { id: 'mov-1', text: 'Romantik Komedi 💖', color: '#fb7185' },
        { id: 'mov-2', text: 'Animasyon 🧸', color: '#38bdf8' },
        { id: 'mov-3', text: 'Gizem & Gerilim 🕵️‍♂️', color: '#64748b' },
      ],
    },
  },
};

// Clean empty Quiz Questions
export const INITIAL_QUIZ_QUESTIONS = [];

// Clean empty Scratch Cards
export const INITIAL_SCRATCH_CARDS = [];

// Clean empty Inside Jokes
export const INITIAL_INSIDE_JOKES = [];

// Clean empty SOS Vault
export const INITIAL_SOS_VAULT = [];

// Ceren's Menstrual & Ovulation Cycle Initial Data
export const INITIAL_CYCLE_DATA = {
  lastPeriodStart: '2026-08-20',
  periodDuration: 5,
  cycleLength: 28,
  logs: {
    '2026-08-20': {
      isPeriod: true,
      flow: 'medium',
      symptoms: ['kramp', 'yorgunluk'],
      mood: 'hassas',
      note: 'Regl başlangıcı',
    },
    '2026-08-21': {
      isPeriod: true,
      flow: 'heavy',
      symptoms: ['kramp', 'tatli_krizi'],
      mood: 'duygusal',
      note: '',
    },
    '2026-08-22': {
      isPeriod: true,
      flow: 'medium',
      symptoms: ['yorgunluk'],
      mood: 'sakin',
      note: '',
    },
    '2026-08-23': {
      isPeriod: true,
      flow: 'light',
      symptoms: [],
      mood: 'mutlu',
      note: '',
    },
    '2026-08-24': {
      isPeriod: true,
      flow: 'light',
      symptoms: [],
      mood: 'enerjik',
      note: '',
    },
  },
};

// FitCheck (24-Hour Outfit Stories)
export const INITIAL_FITCHECK_DATA = [];

// Daily Water Tracker (Glasses per day: { 'YYYY-MM-DD': { partner1: 0, partner2: 0 } })
export const INITIAL_WATER_DATA = {};

// Hourly Daily Schedule ({ 'YYYY-MM-DD': { 'HH:00': { partner1: { status, text }, partner2: { status, text } } } })
export const INITIAL_HOURLY_SCHEDULE = {};

// Love Radar & Live Location Data
export const INITIAL_RADAR_DATA = {
  partner1: {
    lat: 40.9833,
    lng: 29.0278,
    locationName: 'Kadıköy Moda Sahili 🌊',
    updatedAt: new Date().toISOString(),
  },
  partner2: {
    lat: 41.0422,
    lng: 29.0067,
    locationName: 'Beşiktaş Çarşı / Meydan ⚓',
    updatedAt: new Date().toISOString(),
  },
};

// Couple's Custom Saved Places
export const INITIAL_SAVED_PLACES = [
  {
    id: 'place-1',
    name: 'Kadıköy Moda Sahili 🌊',
    lat: 40.9833,
    lng: 29.0278,
    createdBy: 'Ceren',
  },
  {
    id: 'place-2',
    name: 'Beşiktaş Çarşı ⚓',
    lat: 41.0422,
    lng: 29.0067,
    createdBy: 'Tahir',
  },
];


