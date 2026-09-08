export class SoundService {
  private static ctx: AudioContext | null = null;
  private static initialized = false;

  public static init() {
    if (this.initialized) return;
    this.initialized = true;

    // Create a single persistent AudioContext
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const handleInteract = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      document.removeEventListener('click', handleInteract);
      document.removeEventListener('touchstart', handleInteract);
      document.removeEventListener('keydown', handleInteract);
    };

    document.addEventListener('click', handleInteract);
    document.addEventListener('touchstart', handleInteract);
    document.addEventListener('keydown', handleInteract);
  }

  public static playSuccessSound() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Ensure it's running
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const playTone = (freq: number, startTime: number, duration: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        // Lower volume (was 0.1, now 0.03) for a softer chime
        gain.gain.setValueAtTime(0.03, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = this.ctx.currentTime;
      playTone(987.77, now, 0.25);       // B5
      playTone(1318.51, now + 0.12, 0.45); // E6
    } catch (e) {
      console.warn('Failed to play sound', e);
    }
  }
}
