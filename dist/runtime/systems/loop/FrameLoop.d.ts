import { Updatable, Scheduler } from './types.js';
export declare class FrameLoop {
    private scheduler;
    private updatables;
    constructor(scheduler: Scheduler);
    add(...items: Updatable[]): void;
    remove(item: Updatable): void;
    clear(): void;
    start(): void;
    stop(): void;
}
