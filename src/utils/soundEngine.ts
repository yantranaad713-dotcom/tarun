// Web Audio API pure harmonic singing bowl and chime synthesizer
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Plays a rich, soothing Himalayan Singing Bowl resonant harmonic stroke
  public playSingingBowl(baseFreq = 216, duration = 4.5) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.28, now + 0.08);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(this.ctx.destination);

      // Harmonics (Fundamental, 2nd, 3rd, 5th harmonic overtones typical of bronze alloy bowls)
      const harmonics = [
        { freq: baseFreq, amp: 1.0 },
        { freq: baseFreq * 2.01, amp: 0.45 },
        { freq: baseFreq * 2.99, amp: 0.25 },
        { freq: baseFreq * 4.82, amp: 0.12 }
      ];

      harmonics.forEach(({ freq, amp }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Subtle slow frequency modulation (acoustic beating / singing bowl wobble)
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(1.8, now); // 1.8 Hz gentle beat
        lfoGain.gain.setValueAtTime(1.2, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + duration);

        gain.gain.setValueAtTime(amp * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Play gentle Koshi chime bell for step transitions and soft feedback
  public playChime(pitch = 528) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.99, now + 2.0);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.2);
    } catch {
      // Ignore audio gesture restrictions
    }
  }
}

export const soundEngine = new SoundEngine();
