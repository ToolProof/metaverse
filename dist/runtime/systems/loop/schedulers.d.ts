import { WebGLRenderer } from 'three';
import { Scheduler } from './types.js';
export declare class RAFScheduler implements Scheduler {
    private running;
    private clock;
    private handle;
    start(cb: (delta: number) => void): void;
    stop(): void;
}
export declare class XRRendererScheduler implements Scheduler {
    private renderer;
    private clock;
    constructor(renderer: WebGLRenderer);
    start(cb: (delta: number) => void): void;
    stop(): void;
}
