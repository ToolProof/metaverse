import { Updatable, Scheduler } from './types.js';

export class FrameLoop {
  private updatables: Updatable[] = [];
  constructor(private scheduler: Scheduler) {}

  add(...items: Updatable[]) {
    this.updatables.push(...items);
  }

  remove(item: Updatable) {
    this.updatables = this.updatables.filter(u => u !== item);
  }

  clear() {
    this.updatables = [];
  }

  start() {
    this.updatables.forEach(u => u.start?.());
    this.scheduler.start((delta) => {
      for (const u of this.updatables) u.tick(delta);
    });
  }

  stop() {
    this.scheduler.stop();
    this.updatables.forEach(u => u.stop?.());
  }
}
