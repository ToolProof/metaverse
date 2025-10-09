export interface Updatable {
    tick(delta: number): void;
    start?(): void;
    stop?(): void;
}
export interface Scheduler {
    start(cb: (delta: number) => void): void;
    stop(): void;
}
