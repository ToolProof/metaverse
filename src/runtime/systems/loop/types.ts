// Minimal contract for systems that update each frame
export interface Updatable {
  tick(delta: number): void;
  start?(): void;
  stop?(): void;
}

// Scheduler abstraction so Loop doesn't care about XR vs RAF
export interface Scheduler {
  start(cb: (delta: number) => void): void;
  stop(): void;
}
