import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getLocalData,
  setLocalData,
  initializeLocalStorage,
  subscribeToLocalSync,
  STORAGE_KEYS,
} from '../services/storageFallback';
import {
  isFirebaseConfigured,
  subscribeToCollection,
  subscribeToDoc,
  saveFirestoreDoc,
  addFirestoreDoc,
  deleteFirestoreDoc,
} from '../services/firebase';
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
} from '../services/defaultData';

const SharedDataContext = createContext();

export const SharedDataProvider = ({ children }) => {
  const [useFirebase, setUseFirebase] = useState(isFirebaseConfigured());

  // App lock state (PIN lock)
  const [isLocked, setIsLocked] = useState(false);

  // Active navigation tab ('home', 'calendar', 'games', 'notes', 'canvas', 'moments', 'sos', 'coupons')
  const [activeTab, setActiveTab] = useState('home');

  const navigateTo = useCallback((tabId) => {
    setActiveTab(tabId);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, []);

  // Active persona ('partner1' | 'partner2')
  const [activePersona, setActivePersonaState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PERSONA) || 'partner1';
  });

  // State slices
  const [profile, setProfile] = useState(() => {
    const saved = getLocalData(STORAGE_KEYS.PROFILE, INITIAL_COUPLE_PROFILE);
    if (saved) {
      let changed = false;
      if (saved.partner1 && (saved.partner1.avatar === '👩🏻‍🦰' || saved.partner1.avatar === '👱🏻‍♀️')) {
        saved.partner1.avatar = '👱🏼‍♀️';
        changed = true;
      }
      if (saved.partner2 && (saved.partner2.avatar === '👨🏻‍💻' || saved.partner2.avatar === '👨🏻' || saved.partner2.avatar === '👨🏼' || saved.partner2.avatar === '👨🏽')) {
        saved.partner2.avatar = '👨🏻‍🦰';
        changed = true;
      }
      if (
        !saved.ourSong ||
        saved.ourSong === 'Perfect - Ed Sheeran' ||
        saved.spotifyUrl === 'https://open.spotify.com/track/15ea10vpAnArRBGmCGewjf'
      ) {
        saved.ourSong = 'Radiohead - Jigsaw Falling Into Place';
        saved.spotifyUrl = 'https://open.spotify.com/track/0YJ9FWWHn9EfnN0lHwbzvV';
        changed = true;
      }
      if (!saved.pinAnswer || saved.pinAnswer === 'Kadıköy') {
        saved.pinAnswer = 'penguen';
        changed = true;
      }
      if (!saved.pinCode || saved.pinCode === '0502' || saved.pinCode.length !== 4) {
        saved.pinCode = '9999';
        changed = true;
      }
      if (!saved.relationshipTitle || saved.relationshipTitle === 'Ceren & Tahir' || saved.relationshipTitle === 'Our Love Hub' || saved.relationshipTitle === 'T ❤️ C') {
        saved.relationshipTitle = 'Ceren ❤️ Tahir';
        changed = true;
      }
      if (changed) {
        setLocalData(STORAGE_KEYS.PROFILE, saved);
      }
    }
    return saved;
  });
  const [notes, setNotes] = useState(() =>
    getLocalData(STORAGE_KEYS.NOTES, INITIAL_NOTES)
  );
  const [events, setEvents] = useState(() =>
    getLocalData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS)
  );
  const [coupons, setCoupons] = useState(() =>
    getLocalData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS)
  );
  const [reasons, setReasons] = useState(() =>
    getLocalData(STORAGE_KEYS.REASONS, INITIAL_REASONS)
  );
  const [memories, setMemories] = useState(() =>
    getLocalData(STORAGE_KEYS.MEMORIES, INITIAL_MEMORIES)
  );
  const [drawings, setDrawings] = useState(() =>
    getLocalData(STORAGE_KEYS.DRAWINGS, INITIAL_DRAWINGS)
  );

  // 7 New Modules States
  const [petData, setPetData] = useState(() =>
    getLocalData(STORAGE_KEYS.PET, INITIAL_PET_DATA)
  );
  const [dailyQuestions, setDailyQuestions] = useState(() =>
    getLocalData(STORAGE_KEYS.DAILY_QUESTIONS, INITIAL_DAILY_QUESTIONS)
  );
  const [wheelConfig, setWheelConfig] = useState(() =>
    getLocalData(STORAGE_KEYS.WHEEL, INITIAL_WHEEL_CONFIGS)
  );
  const [quizQuestions, setQuizQuestions] = useState(() =>
    getLocalData(STORAGE_KEYS.QUIZ, INITIAL_QUIZ_QUESTIONS)
  );
  const [scratchCards, setScratchCards] = useState(() =>
    getLocalData(STORAGE_KEYS.SCRATCH_CARDS, INITIAL_SCRATCH_CARDS)
  );
  const [insideJokes, setInsideJokes] = useState(() =>
    getLocalData(STORAGE_KEYS.INSIDE_JOKES, INITIAL_INSIDE_JOKES)
  );
  const [sosVault, setSosVault] = useState(() =>
    getLocalData(STORAGE_KEYS.SOS_VAULT, INITIAL_SOS_VAULT)
  );

  // 4 New Modules States: Cycle, FitCheck, Water, Hourly Schedule
  const [cycleData, setCycleData] = useState(() =>
    getLocalData(STORAGE_KEYS.CYCLE, INITIAL_CYCLE_DATA)
  );
  const [fitCheckPosts, setFitCheckPosts] = useState(() =>
    getLocalData(STORAGE_KEYS.FITCHECK, INITIAL_FITCHECK_DATA)
  );
  const [waterData, setWaterData] = useState(() =>
    getLocalData(STORAGE_KEYS.WATER, INITIAL_WATER_DATA)
  );
  const [hourlySchedule, setHourlySchedule] = useState(() =>
    getLocalData(STORAGE_KEYS.SCHEDULE, INITIAL_HOURLY_SCHEDULE)
  );
  const [radarData, setRadarData] = useState(() =>
    getLocalData(STORAGE_KEYS.RADAR, INITIAL_RADAR_DATA)
  );
  const [savedPlaces, setSavedPlaces] = useState(() =>
    getLocalData(STORAGE_KEYS.SAVED_PLACES, INITIAL_SAVED_PLACES)
  );

  // Initialize storage once
  useEffect(() => {
    initializeLocalStorage();
    if (profile.pinCode && profile.pinCode.length === 4) {
      setIsLocked(true);
    }
  }, []);

  // Update active persona
  const setActivePersona = (persona) => {
    setActivePersonaState(persona);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PERSONA, persona);
  };

  const currentPartner = activePersona === 'partner1' ? profile.partner1 : profile.partner2;

  // Real-time synchronization subscription
  useEffect(() => {
    if (useFirebase) {
      // Firebase Subscriptions
      const unsubProfile = subscribeToDoc('settings', 'profile', (data) => {
        if (data) setProfile(data);
      });
      const unsubNotes = subscribeToCollection('notes', (items) => setNotes(items), 'createdAt');
      const unsubEvents = subscribeToCollection('events', (items) => setEvents(items), 'date', 'asc');
      const unsubCoupons = subscribeToCollection('coupons', (items) => setCoupons(items));
      const unsubReasons = subscribeToCollection('reasons', (items) => setReasons(items), 'id', 'asc');
      const unsubMemories = subscribeToCollection('memories', (items) => setMemories(items), 'date');
      const unsubDrawings = subscribeToCollection('drawings', (items) => setDrawings(items), 'createdAt');
      const unsubPet = subscribeToDoc('pet', 'main', (data) => {
        if (data) setPetData(data);
      });
      const unsubDailyQ = subscribeToCollection('dailyQuestions', (items) => setDailyQuestions(items), 'date');
      const unsubJokes = subscribeToCollection('insideJokes', (items) => setInsideJokes(items), 'firstSaidDate');
      const unsubScratch = subscribeToCollection('scratchCards', (items) => setScratchCards(items));
      const unsubQuiz = subscribeToCollection('quizQuestions', (items) => setQuizQuestions(items));
      const unsubSos = subscribeToCollection('sosVault', (items) => setSosVault(items));

      return () => {
        unsubProfile();
        unsubNotes();
        unsubEvents();
        unsubCoupons();
        unsubReasons();
        unsubMemories();
        unsubDrawings();
        unsubPet();
        unsubDailyQ();
        unsubJokes();
        unsubScratch();
        unsubQuiz();
        unsubSos();
      };
    } else {
      // LocalStorage BroadcastChannel Subscriptions
      const unsubscribe = subscribeToLocalSync(({ key, data }) => {
        if (key === STORAGE_KEYS.PROFILE) setProfile(data);
        if (key === STORAGE_KEYS.NOTES) setNotes(data);
        if (key === STORAGE_KEYS.EVENTS) setEvents(data);
        if (key === STORAGE_KEYS.COUPONS) setCoupons(data);
        if (key === STORAGE_KEYS.REASONS) setReasons(data);
        if (key === STORAGE_KEYS.MEMORIES) setMemories(data);
        if (key === STORAGE_KEYS.DRAWINGS) setDrawings(data);
        if (key === STORAGE_KEYS.PET) setPetData(data);
        if (key === STORAGE_KEYS.DAILY_QUESTIONS) setDailyQuestions(data);
        if (key === STORAGE_KEYS.WHEEL) setWheelConfig(data);
        if (key === STORAGE_KEYS.QUIZ) setQuizQuestions(data);
        if (key === STORAGE_KEYS.SCRATCH_CARDS) setScratchCards(data);
        if (key === STORAGE_KEYS.INSIDE_JOKES) setInsideJokes(data);
        if (key === STORAGE_KEYS.SOS_VAULT) setSosVault(data);
        if (key === STORAGE_KEYS.CYCLE) setCycleData(data);
        if (key === STORAGE_KEYS.FITCHECK) setFitCheckPosts(data);
        if (key === STORAGE_KEYS.WATER) setWaterData(data);
        if (key === STORAGE_KEYS.SCHEDULE) setHourlySchedule(data);
        if (key === STORAGE_KEYS.RADAR) setRadarData(data);
        if (key === STORAGE_KEYS.SAVED_PLACES) setSavedPlaces(data);
      });

      return unsubscribe;
    }
  }, [useFirebase]);

  // --- XP & Pet Growth Helper ---
  const awardXP = useCallback(
    async (amount = 15) => {
      setPetData((prev) => {
        const newXp = (prev?.xp || 0) + amount;
        const currentLevel = prev?.level || 1;
        const xpThreshold = currentLevel * 100;
        let newLevel = currentLevel;
        if (newXp >= xpThreshold && currentLevel < 10) {
          newLevel += 1;
        }

        const updatedPet = {
          ...prev,
          xp: newXp,
          level: newLevel,
          mood: 'happy',
        };

        if (useFirebase) {
          saveFirestoreDoc('pet', 'main', updatedPet);
        } else {
          setLocalData(STORAGE_KEYS.PET, updatedPet);
        }
        return updatedPet;
      });
    },
    [useFirebase]
  );

  // --- CRUD ACTIONS ---

  // Update Profile
  const updateProfile = async (newProfile) => {
    setProfile(newProfile);
    if (useFirebase) {
      await saveFirestoreDoc('settings', 'profile', newProfile);
    } else {
      setLocalData(STORAGE_KEYS.PROFILE, newProfile);
    }
  };

  // Update Daily Quote
  const updateDailyQuote = async (quoteText, authorName) => {
    const updated = {
      ...profile,
      dailyQuote: quoteText,
      dailyQuoteAuthor: authorName || `${profile.partner1?.name} & ${profile.partner2?.name}`,
    };
    await updateProfile(updated);
    awardXP(10);
  };

  // Update Song & Spotify Url
  const updateSong = async (songTitle, spotifyLink = '') => {
    const updated = {
      ...profile,
      ourSong: songTitle,
      spotifyUrl: spotifyLink,
    };
    await updateProfile(updated);
  };

  // Notes
  const addNote = async (noteContent, color = 'rose', options = {}) => {
    const isPartner1 = activePersona === 'partner1';
    const newNote = {
      id: 'note-' + Date.now(),
      author: isPartner1 ? profile.partner1.name : profile.partner2.name,
      avatar: isPartner1 ? profile.partner1.avatar : profile.partner2.avatar,
      authorRole: activePersona,
      content: noteContent,
      color,
      pinned: false,
      likes: 0,
      isLocked: Boolean(options.isLocked),
      unlockDate: options.unlockDate || null,
      createdAt: new Date().toISOString(),
    };

    if (useFirebase) {
      await addFirestoreDoc('notes', newNote);
    } else {
      const updated = [newNote, ...notes];
      setNotes(updated);
      setLocalData(STORAGE_KEYS.NOTES, updated);
    }
    awardXP(25);
    return newNote;
  };

  const deleteNote = async (id) => {
    if (useFirebase) {
      await deleteFirestoreDoc('notes', id);
    } else {
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      setLocalData(STORAGE_KEYS.NOTES, updated);
    }
  };

  const togglePinNote = async (id) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    setNotes(updated);
    if (useFirebase) {
      const target = updated.find((n) => n.id === id);
      await saveFirestoreDoc('notes', id, target);
    } else {
      setLocalData(STORAGE_KEYS.NOTES, updated);
    }
  };

  const likeNote = async (id) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, likes: (n.likes || 0) + 1 } : n));
    setNotes(updated);
    if (useFirebase) {
      const target = updated.find((n) => n.id === id);
      await saveFirestoreDoc('notes', id, target);
    } else {
      setLocalData(STORAGE_KEYS.NOTES, updated);
    }
    awardXP(5);
  };

  // Events & Time Capsules
  const addEvent = async (eventData) => {
    const isPartner1 = activePersona === 'partner1';
    const newEvent = {
      id: 'event-' + Date.now(),
      createdByRole: activePersona,
      createdBy: isPartner1 ? profile.partner1.name : profile.partner2.name,
      ...eventData,
    };

    if (useFirebase) {
      await addFirestoreDoc('events', newEvent);
    } else {
      const updated = [...events, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(updated);
      setLocalData(STORAGE_KEYS.EVENTS, updated);
    }
    awardXP(30);
    return newEvent;
  };

  const deleteEvent = async (id) => {
    if (useFirebase) {
      await deleteFirestoreDoc('events', id);
    } else {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      setLocalData(STORAGE_KEYS.EVENTS, updated);
    }
  };

  // Coupons
  const redeemCoupon = async (id) => {
    let target = null;
    const updated = coupons.map((c) => {
      if (c.id !== id) return c;

      const isInfinite = Boolean(c.isInfinite);
      const currentUsed = Number(c.usedCount) || (c.isRedeemed ? (Number(c.maxUses) || 1) : 0);
      const newUsedCount = currentUsed + 1;
      const maxUses = isInfinite ? null : (Number(c.maxUses) || 1);
      const isNowRedeemed = isInfinite ? false : newUsedCount >= maxUses;

      target = {
        ...c,
        isInfinite,
        maxUses,
        usedCount: newUsedCount,
        isRedeemed: isNowRedeemed,
        redeemedAt: new Date().toISOString(),
        redeemedBy: currentPartner.name,
      };
      return target;
    });

    setCoupons(updated);
    if (useFirebase) {
      if (target) {
        await saveFirestoreDoc('coupons', id, target);
      }
    } else {
      setLocalData(STORAGE_KEYS.COUPONS, updated);
    }
    awardXP(20);
  };

  const addCoupon = async (couponData) => {
    const isInfinite = Boolean(couponData.isInfinite);
    const maxUses = isInfinite ? null : (Number(couponData.maxUses) || 1);

    const newCoupon = {
      id: 'coupon-' + Date.now(),
      isInfinite,
      maxUses,
      usedCount: 0,
      isRedeemed: false,
      redeemedAt: null,
      redeemedBy: null,
      createdBy: currentPartner.name,
      createdAt: new Date().toISOString(),
      ...couponData,
    };

    if (useFirebase) {
      await addFirestoreDoc('coupons', newCoupon);
    } else {
      const updated = [newCoupon, ...coupons];
      setCoupons(updated);
      setLocalData(STORAGE_KEYS.COUPONS, updated);
    }
    awardXP(20);
    return newCoupon;
  };

  const updateCoupon = async (id, updatedFields) => {
    let target = null;
    const updated = coupons.map((c) => {
      if (c.id !== id) return c;
      target = {
        ...c,
        ...updatedFields,
      };

      if (target.isInfinite) {
        target.isInfinite = true;
        target.maxUses = null;
        target.isRedeemed = false;
      } else {
        target.isInfinite = false;
        target.maxUses = Number(target.maxUses) || 1;
        const used = Number(target.usedCount) || 0;
        target.isRedeemed = used >= target.maxUses;
      }
      return target;
    });

    setCoupons(updated);
    if (useFirebase) {
      if (target) {
        await saveFirestoreDoc('coupons', id, target);
      }
    } else {
      setLocalData(STORAGE_KEYS.COUPONS, updated);
    }
  };

  const resetCoupon = async (id) => {
    let target = null;
    const updated = coupons.map((c) => {
      if (c.id !== id) return c;
      target = {
        ...c,
        usedCount: 0,
        isRedeemed: false,
        redeemedAt: null,
        redeemedBy: null,
      };
      return target;
    });

    setCoupons(updated);
    if (useFirebase) {
      if (target) {
        await saveFirestoreDoc('coupons', id, target);
      }
    } else {
      setLocalData(STORAGE_KEYS.COUPONS, updated);
    }
  };

  const deleteCoupon = async (id) => {
    if (useFirebase) {
      await deleteFirestoreDoc('coupons', id);
    } else {
      const updated = coupons.filter((c) => c.id !== id);
      setCoupons(updated);
      setLocalData(STORAGE_KEYS.COUPONS, updated);
    }
  };

  // Reasons
  const addReason = async (title, text) => {
    const newReason = {
      id: Date.now(),
      title,
      text,
      author: currentPartner.name,
    };

    if (useFirebase) {
      await addFirestoreDoc('reasons', newReason);
    } else {
      const updated = [...reasons, newReason];
      setReasons(updated);
      setLocalData(STORAGE_KEYS.REASONS, updated);
    }
    awardXP(15);
  };

  // Memories / Timeline Gallery
  const addMemory = async (memoryData) => {
    const newMemory = {
      id: 'mem-' + Date.now(),
      likes: 0,
      createdBy: currentPartner.name,
      createdAt: new Date().toISOString(),
      ...memoryData,
    };

    if (useFirebase) {
      await addFirestoreDoc('memories', newMemory);
    } else {
      const updated = [newMemory, ...memories].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setMemories(updated);
      setLocalData(STORAGE_KEYS.MEMORIES, updated);
    }
    awardXP(35);
    return newMemory;
  };

  const deleteMemory = async (id) => {
    if (useFirebase) {
      await deleteFirestoreDoc('memories', id);
    } else {
      const updated = memories.filter((m) => m.id !== id);
      setMemories(updated);
      setLocalData(STORAGE_KEYS.MEMORIES, updated);
    }
  };

  const likeMemory = async (id) => {
    const updated = memories.map((m) => (m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m));
    setMemories(updated);
    if (useFirebase) {
      const target = updated.find((m) => m.id === id);
      await saveFirestoreDoc('memories', id, target);
    } else {
      setLocalData(STORAGE_KEYS.MEMORIES, updated);
    }
    awardXP(5);
  };

  // Drawings
  const saveDrawing = async (arg1, arg2) => {
    let dataUrlStr = '';
    let drawingTitleStr = 'Aşk Çizimi';

    if (typeof arg1 === 'object' && arg1 !== null) {
      dataUrlStr = arg1.dataUrl || '';
      drawingTitleStr = arg1.title || 'Aşk Çizimi';
    } else {
      dataUrlStr = typeof arg1 === 'string' ? arg1 : '';
      drawingTitleStr = typeof arg2 === 'string' ? arg2 : 'Aşk Çizimi';
    }

    const newDrawing = {
      id: 'draw-' + Date.now(),
      author: currentPartner.name,
      avatar: currentPartner.avatar,
      title: drawingTitleStr,
      dataUrl: dataUrlStr,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    if (useFirebase) {
      await addFirestoreDoc('drawings', newDrawing);
    } else {
      const updated = [newDrawing, ...drawings];
      setDrawings(updated);
      setLocalData(STORAGE_KEYS.DRAWINGS, updated);
    }
    awardXP(40);
    return newDrawing;
  };

  const deleteDrawing = async (id) => {
    if (useFirebase) {
      await deleteFirestoreDoc('drawings', id);
    } else {
      const updated = drawings.filter((d) => d.id !== id);
      setDrawings(updated);
      setLocalData(STORAGE_KEYS.DRAWINGS, updated);
    }
  };

  // 1. Virtual Pet Actions
  const interactPet = async (actionType = 'water') => {
    const now = new Date().toISOString();
    const updatedPet = {
      ...petData,
      lastWatered: actionType === 'water' ? now : petData.lastWatered,
      lastPetted: actionType === 'pet' ? now : petData.lastPetted,
      xp: (petData?.xp || 0) + 20,
      mood: 'excited',
    };

    if (updatedPet.xp >= updatedPet.level * 100 && updatedPet.level < 10) {
      updatedPet.level += 1;
    }

    setPetData(updatedPet);
    if (useFirebase) {
      await saveFirestoreDoc('pet', 'main', updatedPet);
    } else {
      setLocalData(STORAGE_KEYS.PET, updatedPet);
    }
  };

  // 2. Daily Questions Actions
  const answerDailyQuestion = async (questionId, answerText) => {
    const currentPartnerKey = activePersona; // 'partner1' or 'partner2'
    const updatedQuestions = dailyQuestions.map((q) => {
      if (q.id === questionId) {
        const answers = { ...(q.answers || {}) };
        answers[currentPartnerKey] = {
          author: currentPartner.name,
          answer: answerText,
          answeredAt: new Date().toISOString(),
        };
        return { ...q, answers };
      }
      return q;
    });

    setDailyQuestions(updatedQuestions);
    if (useFirebase) {
      const target = updatedQuestions.find((q) => q.id === questionId);
      await saveFirestoreDoc('dailyQuestions', questionId, target);
    } else {
      setLocalData(STORAGE_KEYS.DAILY_QUESTIONS, updatedQuestions);
    }
    awardXP(30);
  };

  const addDailyQuestion = async (questionText) => {
    const newQ = {
      id: 'dq-' + Date.now(),
      date: new Date().toISOString().substring(0, 10),
      question: questionText,
      answers: {},
      createdBy: currentPartner.name,
    };
    const updated = [newQ, ...dailyQuestions];
    setDailyQuestions(updated);
    if (useFirebase) {
      await addFirestoreDoc('dailyQuestions', newQ);
    } else {
      setLocalData(STORAGE_KEYS.DAILY_QUESTIONS, updated);
    }
    awardXP(20);
  };

  const deleteDailyQuestion = async (id) => {
    if (useFirebase) {
      await deleteFirestoreDoc('dailyQuestions', id);
    } else {
      const updated = dailyQuestions.filter((q) => q.id !== id);
      setDailyQuestions(updated);
      setLocalData(STORAGE_KEYS.DAILY_QUESTIONS, updated);
    }
  };

  // 3. Decision Wheel Actions
  const updateWheelConfig = async (newConfig) => {
    setWheelConfig(newConfig);
    if (useFirebase) {
      await saveFirestoreDoc('wheel', 'main', newConfig);
    } else {
      setLocalData(STORAGE_KEYS.WHEEL, newConfig);
    }
  };

  // 4. Quiz Questions Actions
  const addQuizQuestion = async (questionObj) => {
    const newQuiz = {
      id: 'quiz-' + Date.now(),
      creator: currentPartner.name,
      ...questionObj,
    };
    const updated = [newQuiz, ...quizQuestions];
    setQuizQuestions(updated);
    if (useFirebase) {
      await addFirestoreDoc('quizQuestions', newQuiz);
    } else {
      setLocalData(STORAGE_KEYS.QUIZ, updated);
    }
    awardXP(25);
  };

  const deleteQuizQuestion = async (id) => {
    if (useFirebase) {
      await deleteFirestoreDoc('quizQuestions', id);
    } else {
      const updated = quizQuestions.filter((q) => q.id !== id);
      setQuizQuestions(updated);
      setLocalData(STORAGE_KEYS.QUIZ, updated);
    }
  };

  // 5. Scratch Card Actions
  const scratchCard = async (cardId) => {
    const updated = scratchCards.map((c) =>
      c.id === cardId ? { ...c, isScratched: true, revealedAt: new Date().toISOString() } : c
    );
    setScratchCards(updated);
    if (useFirebase) {
      const target = updated.find((c) => c.id === cardId);
      await saveFirestoreDoc('scratchCards', cardId, target);
    } else {
      setLocalData(STORAGE_KEYS.SCRATCH_CARDS, updated);
    }
    awardXP(30);
  };

  const addScratchCard = async (cardObj) => {
    const newCard = {
      id: 'scratch-' + Date.now(),
      isScratched: false,
      revealedAt: null,
      createdBy: currentPartner.name,
      ...cardObj,
    };
    const updated = [newCard, ...scratchCards];
    setScratchCards(updated);
    if (useFirebase) {
      await addFirestoreDoc('scratchCards', newCard);
    } else {
      setLocalData(STORAGE_KEYS.SCRATCH_CARDS, updated);
    }
    awardXP(25);
  };

  const deleteScratchCard = async (id) => {
    if (useFirebase) {
      await deleteFirestoreDoc('scratchCards', id);
    } else {
      const updated = scratchCards.filter((c) => c.id !== id);
      setScratchCards(updated);
      setLocalData(STORAGE_KEYS.SCRATCH_CARDS, updated);
    }
  };

  // 6. Inside Jokes Actions
  const addInsideJoke = async (jokeObj) => {
    const newJoke = {
      id: 'joke-' + Date.now(),
      author: currentPartner.name,
      ...jokeObj,
    };
    const updated = [newJoke, ...insideJokes];
    setInsideJokes(updated);
    if (useFirebase) {
      await addFirestoreDoc('insideJokes', newJoke);
    } else {
      setLocalData(STORAGE_KEYS.INSIDE_JOKES, updated);
    }
    awardXP(20);
  };

  const deleteInsideJoke = async (id) => {
    const updated = insideJokes.filter((j) => j.id !== id);
    setInsideJokes(updated);
    if (useFirebase) {
      await deleteFirestoreDoc('insideJokes', id);
    } else {
      setLocalData(STORAGE_KEYS.INSIDE_JOKES, updated);
    }
  };

  // 7. SOS Vault Actions
  const addSOSMessage = async (sosObj) => {
    const newSos = {
      id: 'sos-' + Date.now(),
      createdBy: currentPartner.name,
      ...sosObj,
    };
    const updated = [newSos, ...sosVault];
    setSosVault(updated);
    if (useFirebase) {
      await addFirestoreDoc('sosVault', newSos);
    } else {
      setLocalData(STORAGE_KEYS.SOS_VAULT, updated);
    }
    awardXP(25);
  };

  // 8. Ceren's Menstrual & Ovulation Cycle Actions
  const updateCycleSettings = async (settings) => {
    const updated = {
      ...cycleData,
      ...settings,
    };
    setCycleData(updated);
    if (useFirebase) {
      await saveFirestoreDoc('cycle', 'main', updated);
    } else {
      setLocalData(STORAGE_KEYS.CYCLE, updated);
    }
  };

  const logCycleDay = async (dateStr, logInfo) => {
    const newLogs = {
      ...(cycleData?.logs || {}),
      [dateStr]: logInfo,
    };
    const updated = {
      ...cycleData,
      logs: newLogs,
    };
    if (logInfo.isPeriod && (!cycleData.lastPeriodStart || dateStr >= cycleData.lastPeriodStart)) {
      updated.lastPeriodStart = dateStr;
    }
    setCycleData(updated);
    if (useFirebase) {
      await saveFirestoreDoc('cycle', 'main', updated);
    } else {
      setLocalData(STORAGE_KEYS.CYCLE, updated);
    }
    awardXP(15);
  };

  const deleteCycleLog = async (dateStr) => {
    const newLogs = { ...(cycleData?.logs || {}) };
    delete newLogs[dateStr];
    const updated = {
      ...cycleData,
      logs: newLogs,
    };
    setCycleData(updated);
    if (useFirebase) {
      await saveFirestoreDoc('cycle', 'main', updated);
    } else {
      setLocalData(STORAGE_KEYS.CYCLE, updated);
    }
  };

  // 9. FitCheck (24h Outfit Story & Auto-Archive) Actions
  const addFitCheckPost = async (postData) => {
    const now = Date.now();
    const newPost = {
      id: 'fc-' + now,
      author: currentPartner.name,
      avatar: currentPartner.avatar,
      uploadedAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
      likes: 0,
      reactions: {},
      isArchived: false,
      ...postData,
    };
    const updated = [newPost, ...fitCheckPosts];
    setFitCheckPosts(updated);
    if (useFirebase) {
      await addFirestoreDoc('fitcheck', newPost);
    } else {
      setLocalData(STORAGE_KEYS.FITCHECK, updated);
    }
    awardXP(30);
    return newPost;
  };

  const likeFitCheckPost = async (id, emoji = '🔥') => {
    const updated = fitCheckPosts.map((p) => {
      if (p.id === id) {
        const reactions = { ...(p.reactions || {}) };
        const currentCount = reactions[emoji] || 0;
        reactions[emoji] = currentCount + 1;
        return { ...p, reactions, likes: (p.likes || 0) + 1 };
      }
      return p;
    });
    setFitCheckPosts(updated);
    if (useFirebase) {
      const target = updated.find((p) => p.id === id);
      await saveFirestoreDoc('fitcheck', id, target);
    } else {
      setLocalData(STORAGE_KEYS.FITCHECK, updated);
    }
    awardXP(5);
  };

  const deleteFitCheckPost = async (id) => {
    if (useFirebase) {
      await deleteFirestoreDoc('fitcheck', id);
    } else {
      const updated = fitCheckPosts.filter((p) => p.id !== id);
      setFitCheckPosts(updated);
      setLocalData(STORAGE_KEYS.FITCHECK, updated);
    }
  };

  // Check and auto-archive expired FitChecks to memories
  const checkAndArchiveExpiredFitChecks = useCallback(async () => {
    const now = Date.now();
    let hasChanges = false;
    let newlyArchivedMemories = [];

    const updatedPosts = fitCheckPosts.map((post) => {
      if (now > post.expiresAt && !post.isArchived) {
        hasChanges = true;
        newlyArchivedMemories.push({
          id: 'mem-fc-' + post.id,
          title: `FitCheck: ${post.author} (${post.caption || 'Günün Kombini'})`,
          description: post.caption || '24 saatlik FitCheck hikayesinden otomatik arşivlendi 👗✨',
          imageUrl: post.photoUrl,
          date: new Date(post.uploadedAt).toISOString().substring(0, 10),
          location: 'FitCheck',
          tag: 'fitcheck',
          createdBy: post.author,
          createdAt: new Date().toISOString(),
          likes: post.likes || 0,
        });
        return { ...post, isArchived: true };
      }
      return post;
    });

    if (hasChanges) {
      setFitCheckPosts(updatedPosts);
      setLocalData(STORAGE_KEYS.FITCHECK, updatedPosts);

      if (newlyArchivedMemories.length > 0) {
        const updatedMemories = [...newlyArchivedMemories, ...memories];
        setMemories(updatedMemories);
        setLocalData(STORAGE_KEYS.MEMORIES, updatedMemories);
      }
    }
  }, [fitCheckPosts, memories]);

  useEffect(() => {
    checkAndArchiveExpiredFitChecks();
  }, [checkAndArchiveExpiredFitChecks]);

  // 10. Water Tracker Actions
  const updateWater = async (dateStr, partnerKey, delta) => {
    const currentDay = waterData[dateStr] || { partner1: 0, partner2: 0 };
    const currentVal = currentDay[partnerKey] || 0;
    const newVal = Math.max(0, Math.min(30, currentVal + delta));

    const updated = {
      ...waterData,
      [dateStr]: {
        ...currentDay,
        [partnerKey]: newVal,
      },
    };
    setWaterData(updated);
    if (useFirebase) {
      await saveFirestoreDoc('water', 'main', updated);
    } else {
      setLocalData(STORAGE_KEYS.WATER, updated);
    }
    if (delta > 0) awardXP(5);
  };

  const resetWater = async (dateStr, partnerKey) => {
    const currentDay = waterData[dateStr] || { partner1: 0, partner2: 0 };
    const updated = {
      ...waterData,
      [dateStr]: {
        ...currentDay,
        [partnerKey]: 0,
      },
    };
    setWaterData(updated);
    if (useFirebase) {
      await saveFirestoreDoc('water', 'main', updated);
    } else {
      setLocalData(STORAGE_KEYS.WATER, updated);
    }
  };

  const updateWaterTarget = async (target) => {
    const updated = {
      ...waterData,
      dailyTarget: Math.max(1, Math.min(25, target)),
    };
    setWaterData(updated);
    if (useFirebase) {
      await saveFirestoreDoc('water', 'main', updated);
    } else {
      setLocalData(STORAGE_KEYS.WATER, updated);
    }
  };

  // 11. Hourly Daily Schedule Actions
  const updateScheduleSlot = async (dateStr, hourStr, partnerKey, slotData) => {
    const currentDay = hourlySchedule[dateStr] || {};
    const currentHour = currentDay[hourStr] || {};

    const updated = {
      ...hourlySchedule,
      [dateStr]: {
        ...currentDay,
        [hourStr]: {
          ...currentHour,
          [partnerKey]: slotData,
        },
      },
    };
    setHourlySchedule(updated);
    if (useFirebase) {
      await saveFirestoreDoc('schedule', 'main', updated);
    } else {
      setLocalData(STORAGE_KEYS.SCHEDULE, updated);
    }
    awardXP(10);
  };

  const clearScheduleSlot = async (dateStr, hourStr, partnerKey) => {
    const currentDay = hourlySchedule[dateStr] || {};
    const currentHour = currentDay[hourStr] || {};
    const updatedHour = { ...currentHour };
    delete updatedHour[partnerKey];

    const updated = {
      ...hourlySchedule,
      [dateStr]: {
        ...currentDay,
        [hourStr]: updatedHour,
      },
    };
    setHourlySchedule(updated);
    if (useFirebase) {
      await saveFirestoreDoc('schedule', 'main', updated);
    } else {
      setLocalData(STORAGE_KEYS.SCHEDULE, updated);
    }
  };

  // --- Love Radar & Live Location Actions ---
  const updatePartnerLocation = useCallback(
    async (partnerKey, locationInfo) => {
      const updated = {
        ...(radarData || INITIAL_RADAR_DATA),
        [partnerKey]: {
          ...((radarData && radarData[partnerKey]) || {}),
          ...locationInfo,
          updatedAt: new Date().toISOString(),
        },
      };
      setRadarData(updated);
      if (useFirebase) {
        await saveFirestoreDoc('radar', 'main', updated);
      } else {
        setLocalData(STORAGE_KEYS.RADAR, updated);
      }
    },
    [radarData, useFirebase]
  );

  const togglePartnerLocationSharing = useCallback(
    async (partnerKey) => {
      const currentVal = (radarData && radarData[partnerKey]?.isSharing) !== false;
      const nextVal = !currentVal;
      const updated = {
        ...(radarData || INITIAL_RADAR_DATA),
        [partnerKey]: {
          ...((radarData && radarData[partnerKey]) || {}),
          isSharing: nextVal,
          updatedAt: new Date().toISOString(),
        },
      };
      setRadarData(updated);
      if (useFirebase) {
        await saveFirestoreDoc('radar', 'main', updated);
      } else {
        setLocalData(STORAGE_KEYS.RADAR, updated);
      }
      return nextVal;
    },
    [radarData, useFirebase]
  );

  // --- Saved Custom Places Actions ---
  const addSavedPlace = useCallback(
    async (place) => {
      const newPlace = {
        id: `place-${Date.now()}`,
        name: place.name || 'Özel Mekanımız 📍',
        lat: place.lat,
        lng: place.lng,
        createdBy:
          place.createdBy ||
          (activePersona === 'partner1' ? profile.partner1?.name : profile.partner2?.name),
        createdAt: new Date().toISOString(),
      };
      const updated = [newPlace, ...(savedPlaces || [])];
      setSavedPlaces(updated);
      if (useFirebase) {
        await addFirestoreDoc('saved_places', newPlace);
      } else {
        setLocalData(STORAGE_KEYS.SAVED_PLACES, updated);
      }
      return newPlace;
    },
    [savedPlaces, activePersona, profile, useFirebase]
  );

  const deleteSavedPlace = useCallback(
    async (id) => {
      const updated = (savedPlaces || []).filter((p) => p.id !== id);
      setSavedPlaces(updated);
      if (useFirebase) {
        await deleteFirestoreDoc('saved_places', id);
      } else {
        setLocalData(STORAGE_KEYS.SAVED_PLACES, updated);
      }
    },
    [savedPlaces, useFirebase]
  );

  return (
    <SharedDataContext.Provider
      value={{
        profile,
        updateProfile,
        updateDailyQuote,
        updateSong,
        activePersona,
        setActivePersona,
        activeTab,
        setActiveTab,
        navigateTo,
        currentPartner,
        isLocked,
        setIsLocked,
        useFirebase,
        setUseFirebase,
        // Notes
        notes,
        addNote,
        deleteNote,
        togglePinNote,
        likeNote,
        // Events
        events,
        addEvent,
        deleteEvent,
        // Coupons
        coupons,
        redeemCoupon,
        addCoupon,
        updateCoupon,
        resetCoupon,
        deleteCoupon,
        // Reasons
        reasons,
        addReason,
        // Memories
        memories,
        addMemory,
        deleteMemory,
        likeMemory,
        // Drawings
        drawings,
        saveDrawing,
        deleteDrawing,
        // Games & Fun Modules
        petData,
        interactPet,
        awardXP,
        dailyQuestions,
        answerDailyQuestion,
        addDailyQuestion,
        deleteDailyQuestion,
        wheelConfig,
        updateWheelConfig,
        quizQuestions,
        addQuizQuestion,
        deleteQuizQuestion,
        scratchCards,
        scratchCard,
        addScratchCard,
        deleteScratchCard,
        insideJokes,
        addInsideJoke,
        deleteInsideJoke,
        sosVault,
        addSOSMessage,
        // 4 New Modules
        cycleData,
        updateCycleSettings,
        logCycleDay,
        deleteCycleLog,
        fitCheckPosts,
        addFitCheckPost,
        likeFitCheckPost,
        deleteFitCheckPost,
        waterData,
        updateWater,
        resetWater,
        updateWaterTarget,
        hourlySchedule,
        updateScheduleSlot,
        clearScheduleSlot,
        radarData,
        updatePartnerLocation,
        togglePartnerLocationSharing,
        savedPlaces,
        addSavedPlace,
        deleteSavedPlace,
      }}
    >
      {children}
    </SharedDataContext.Provider>
  );
};

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (!context) {
    console.warn('useSharedData accessed outside SharedDataProvider, using fallback');
    return {
      profile: INITIAL_COUPLE_PROFILE,
      updateProfile: () => {},
      updateDailyQuote: () => {},
      updateSong: () => {},
      activePersona: 'partner1',
      setActivePersona: () => {},
      activeTab: 'home',
      setActiveTab: () => {},
      navigateTo: () => {},
      currentPartner: INITIAL_COUPLE_PROFILE.partner1,
      isLocked: false,
      setIsLocked: () => {},
      useFirebase: false,
      setUseFirebase: () => {},
      notes: [],
      addNote: () => {},
      deleteNote: () => {},
      togglePinNote: () => {},
      likeNote: () => {},
      events: [],
      addEvent: () => {},
      deleteEvent: () => {},
      coupons: [],
      redeemCoupon: () => {},
      addCoupon: () => {},
      updateCoupon: () => {},
      resetCoupon: () => {},
      deleteCoupon: () => {},
      reasons: [],
      addReason: () => {},
      memories: [],
      addMemory: () => {},
      deleteMemory: () => {},
      likeMemory: () => {},
      drawings: [],
      saveDrawing: () => {},
      deleteDrawing: () => {},
      petData: INITIAL_PET_DATA,
      interactPet: () => {},
      awardXP: () => {},
      dailyQuestions: INITIAL_DAILY_QUESTIONS,
      answerDailyQuestion: () => {},
      addDailyQuestion: () => {},
      deleteDailyQuestion: () => {},
      wheelConfig: INITIAL_WHEEL_CONFIGS,
      updateWheelConfig: () => {},
      quizQuestions: INITIAL_QUIZ_QUESTIONS,
      addQuizQuestion: () => {},
      deleteQuizQuestion: () => {},
      scratchCards: INITIAL_SCRATCH_CARDS,
      scratchCard: () => {},
      addScratchCard: () => {},
      deleteScratchCard: () => {},
      insideJokes: INITIAL_INSIDE_JOKES,
      addInsideJoke: () => {},
      deleteInsideJoke: () => {},
      sosVault: INITIAL_SOS_VAULT,
      addSOSMessage: () => {},
      cycleData: INITIAL_CYCLE_DATA,
      updateCycleSettings: () => {},
      logCycleDay: () => {},
      deleteCycleLog: () => {},
      fitCheckPosts: INITIAL_FITCHECK_DATA,
      addFitCheckPost: () => {},
      likeFitCheckPost: () => {},
      deleteFitCheckPost: () => {},
      waterData: INITIAL_WATER_DATA,
      updateWater: () => {},
      resetWater: () => {},
      updateWaterTarget: () => {},
      hourlySchedule: INITIAL_HOURLY_SCHEDULE,
      updateScheduleSlot: () => {},
      clearScheduleSlot: () => {},
      radarData: INITIAL_RADAR_DATA,
      updatePartnerLocation: () => {},
      togglePartnerLocationSharing: () => {},
      savedPlaces: INITIAL_SAVED_PLACES,
      addSavedPlace: () => {},
      deleteSavedPlace: () => {},
    };
  }
  return context;
};
