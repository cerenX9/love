// Sound effects and synthesized lofi ambient music using Web Audio API

class SoundManager {
  constructor() {
    this.ctx = null;
    this.ambientGain = null;
    this.isPlayingAmbient = false;
    this.ambientInterval = null;
    this.ambientNoiseNode = null;
    this.ambientMode = 'lofi'; // 'lofi' | 'rain' | 'heartbeat' | 'custom'
    this.volume = 0.5;
    this.muted = false;
    this.customAudio = null;
    this.customAudioUrl = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        this.muted ? 0 : this.volume * 0.25,
        this.ctx.currentTime
      );
    }
    if (this.customAudio) {
      this.customAudio.volume = this.muted ? 0 : this.volume;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    this.setVolume(this.volume);
    return this.muted;
  }

  // Play heart pop sound
  playPop() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Play stamp slam sound
  playStamp() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.5 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);

      setTimeout(() => {
        if (!this.ctx) return;
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(659.25, this.ctx.currentTime);
        chime.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);

        chimeGain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start();
        chime.stop(this.ctx.currentTime + 0.2);
      }, 50);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Play magical chime
  playChime() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.25 * this.volume, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.6);
        }, index * 90);
      });
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Play realistic deep heartbeat pulse (Lub-Dub)
  playHeartbeat() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.12);

      gain1.gain.setValueAtTime(0.7 * this.volume, this.ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start();
      osc1.stop(this.ctx.currentTime + 0.12);

      setTimeout(() => {
        if (!this.ctx) return;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(75, this.ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(36, this.ctx.currentTime + 0.15);

        gain2.gain.setValueAtTime(0.85 * this.volume, this.ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start();
        osc2.stop(this.ctx.currentTime + 0.15);
      }, 140);
    } catch (e) {
      console.warn('Heartbeat audio error:', e);
    }
  }

  // Play lock click sound
  playLock() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.setValueAtTime(200, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Lofi Piano Generator
  startLofi() {
    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0], // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 261.63, 293.66, 392.0], // Gsus4
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isPlayingAmbient || !this.ctx || this.ambientMode !== 'lofi') return;

      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx];

      try {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.2);
        noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.6);

        osc.connect(noteGain);
        noteGain.connect(this.ambientGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.7);
      } catch (e) {
        console.warn('Ambient note error:', e);
      }

      noteIdx = (noteIdx + 1) % currentChord.length;
      if (noteIdx === 0) {
        chordIdx = (chordIdx + 1) % chords.length;
      }
    };

    playNextNote();
    this.ambientInterval = setInterval(playNextNote, 750);
  }

  // Rain Ambient Noise Generator
  startRain() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Pink-ish noise
      lastOut = output[i];
      output[i] *= 1.8;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft raindrops
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);
    whiteNoise.start();
    this.ambientNoiseNode = whiteNoise;
  }

  // Heartbeat Ambient Pulse Loop
  startHeartbeatLoop() {
    this.playHeartbeat();
    this.ambientInterval = setInterval(() => {
      if (this.isPlayingAmbient && this.ambientMode === 'heartbeat') {
        this.playHeartbeat();
      }
    }, 1100);
  }

  // Start Custom Audio / MP3
  startCustomAudio(url) {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    if (!url) return;
    this.customAudioUrl = url;
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = this.muted ? 0 : this.volume;
    audio.play().catch((e) => console.warn('Audio play prevented:', e));
    this.customAudio = audio;
  }

  // Main Ambient Control
  startAmbientMusic(mode = 'lofi', customUrl = null) {
    this.stopAmbientMusic();
    this.initContext();
    if (!this.ctx) return;

    this.isPlayingAmbient = true;
    this.ambientMode = mode;

    if (mode === 'custom') {
      this.startCustomAudio(customUrl || this.customAudioUrl);
      return;
    }

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(
      this.muted ? 0 : this.volume * 0.25,
      this.ctx.currentTime
    );
    this.ambientGain.connect(this.ctx.destination);

    if (mode === 'rain') {
      this.startRain();
    } else if (mode === 'heartbeat') {
      this.startHeartbeatLoop();
    } else {
      this.startLofi();
    }
  }

  stopAmbientMusic() {
    this.isPlayingAmbient = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientNoiseNode) {
      try {
        this.ambientNoiseNode.stop();
        this.ambientNoiseNode.disconnect();
      } catch (e) {}
      this.ambientNoiseNode = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch (e) {}
    }
  }

  toggleAmbientMusic(mode = 'lofi', customUrl = null) {
    if (this.isPlayingAmbient && this.ambientMode === mode) {
      this.stopAmbientMusic();
      return false;
    } else {
      this.startAmbientMusic(mode, customUrl);
      return true;
    }
  }
}

export const soundManager = new SoundManager();
