import { Clock } from 'three';
// Uses requestAnimationFrame to drive the loop
export class RAFScheduler {
    constructor() {
        this.running = false;
        this.clock = new Clock();
        this.handle = 0;
    }
    start(cb) {
        if (this.running)
            return;
        this.running = true;
        const step = () => {
            if (!this.running)
                return;
            const delta = this.clock.getDelta();
            cb(delta);
            this.handle = requestAnimationFrame(step);
        };
        this.handle = requestAnimationFrame(step);
    }
    stop() {
        this.running = false;
        if (this.handle)
            cancelAnimationFrame(this.handle);
    }
}
// Uses renderer.setAnimationLoop (XR-friendly)
export class XRRendererScheduler {
    constructor(renderer) {
        this.renderer = renderer;
        this.clock = new Clock();
    }
    start(cb) {
        this.renderer.setAnimationLoop(() => {
            const delta = this.clock.getDelta();
            cb(delta);
        });
    }
    stop() {
        this.renderer.setAnimationLoop(null);
    }
}
