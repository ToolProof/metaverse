export class FrameLoop {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.updatables = [];
    }
    add(...items) {
        this.updatables.push(...items);
    }
    remove(item) {
        this.updatables = this.updatables.filter(u => u !== item);
    }
    clear() {
        this.updatables = [];
    }
    start() {
        this.updatables.forEach(u => u.start?.());
        this.scheduler.start((delta) => {
            for (const u of this.updatables)
                u.tick(delta);
        });
    }
    stop() {
        this.scheduler.stop();
        this.updatables.forEach(u => u.stop?.());
    }
}
