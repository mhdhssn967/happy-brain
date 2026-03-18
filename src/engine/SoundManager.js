import { Howl } from "howler";

class SoundManager {
  static instance = null;

  constructor() {
    this.sounds = {
      correct: new Howl({
        src: ["/assets/audio/correct.mp3"],
        volume: 0.7,
        preload: true,
      }),
      wrong: new Howl({
        src: ["/assets/audio/wrong.mp3"],
        volume: 0.7,
        preload: true,
      }),
      combo: new Howl({
        src: ["/assets/audio/combo.mp3"],
        volume: 0.6,
        preload: true,
      }),
      levelUp: new Howl({
        src: ["/assets/audio/level-up.mp3"],
        volume: 0.8,
        preload: true,
      }),
      gameOver: new Howl({
        src: ["/assets/audio/game-over.mp3"],
        volume: 0.6,
        preload: true,
      }),
      tick: new Howl({
        src: ["/assets/audio/tick.mp3"],
        volume: 0.3,
        preload: true,
      }),
    };

    this.muted = false;
  }

  static getInstance() {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Play a sound effect
   * @param {string} soundName - Key of the sound to play
   * @param {object} options - Optional Howler config overrides
   */
  playSound(soundName, options = {}) {
    if (this.muted || !this.sounds[soundName]) {
      return;
    }

    try {
      const sound = this.sounds[soundName];
      sound.volume(options.volume || 0.7);
      sound.play();
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
    }
  }

  /**
   * Stop a sound
   * @param {string} soundName
   */
  stopSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].stop();
    }
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  /**
   * Set mute state
   */
  setMute(isMuted) {
    this.muted = isMuted;
  }

  /**
   * Set volume for all sounds
   * @param {number} volume - 0 to 1
   */
  setVolume(volume) {
    Object.values(this.sounds).forEach(sound => {
      sound.volume(volume);
    });
  }

  /**
   * Play combo sound with increasing pitch (simulated with multiple plays)
   */
  playComboSound(comboLevel) {
    if (this.muted) return;
    
    // Play tick sound multiple times based on combo level
    const ticks = Math.min(comboLevel, 3);
    for (let i = 0; i < ticks; i++) {
      setTimeout(() => {
        this.playSound("tick", { volume: 0.4 });
      }, i * 100);
    }
  }

  /**
   * Preload all sounds
   */
  preloadAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.load();
    });
  }
}

export { SoundManager };