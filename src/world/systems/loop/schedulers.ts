import { Clock, WebGLRenderer } from 'three';
import { Scheduler } from './types.js';

// Uses requestAnimationFrame to drive the loop
export class RAFScheduler implements Scheduler {
  private running = false;
  private clock = new Clock();
  private handle = 0;

  start(cb: (delta: number) => void): void {
    if (this.running) return;
    this.running = true;

    const step = () => {
      if (!this.running) return;
      const delta = this.clock.getDelta();
      cb(delta);
      this.handle = requestAnimationFrame(step);
    };

    this.handle = requestAnimationFrame(step);
  }

  stop(): void {
    this.running = false;
    if (this.handle) cancelAnimationFrame(this.handle);
  }
}

// Uses renderer.setAnimationLoop (XR-friendly)
export class XRRendererScheduler implements Scheduler {
  private clock = new Clock();
  constructor(private renderer: WebGLRenderer) {}

  start(cb: (delta: number) => void): void {
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta();
      cb(delta);
    });
  }

  stop(): void {
    this.renderer.setAnimationLoop(null);
  }
}
