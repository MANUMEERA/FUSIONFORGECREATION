// Web Audio API based Buzzer and Chime Generator for Realtime Lead Notifications

class BuzzerSoundEngine {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Load saved sound preference
    try {
      const savedMute = localStorage.getItem('fusion_admin_buzzer_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem('fusion_admin_buzzer_muted', String(muted));
    } catch {
      // ignore
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Plays a prominent, attention-grabbing dual-pulse buzzer tone for incoming leads
   */
  public playLeadBuzzer(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Pulse 1: Alert Warning (880Hz -> 1046Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.18);

      // Pulse 2: High Chime Echo (1318Hz -> 1760Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.2);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.35);

      gain2.gain.setValueAtTime(0.001, now + 0.2);
      gain2.gain.linearRampToValueAtTime(0.4, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.2);
      osc2.stop(now + 0.55);

      // Pulse 3: Secondary Resonance Confirmation Ring
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();

      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(1046.50, now + 0.38);
      osc3.frequency.exponentialRampToValueAtTime(2093, now + 0.65);

      gain3.gain.setValueAtTime(0.001, now + 0.38);
      gain3.gain.linearRampToValueAtTime(0.3, now + 0.4);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      osc3.connect(gain3);
      gain3.connect(ctx.destination);

      osc3.start(now + 0.38);
      osc3.stop(now + 0.85);

    } catch (err) {
      console.warn('Audio buzzer failed to play:', err);
    }
  }

  /**
   * Diagnostic test buzzer sound
   */
  public playTestBuzzer(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (err) {
      console.warn('Test buzzer failed:', err);
    }
  }
}

export const buzzerEngine = new BuzzerSoundEngine();
