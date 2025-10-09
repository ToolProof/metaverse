import * as THREE from 'three';
import { FrameLoop } from './systems/loop/FrameLoop.js';
import type { Scheduler, Updatable } from './systems/loop/types.js';
type MaybeFactory<T> = T | (() => T);
export interface RuntimeOptions {
    scene?: MaybeFactory<THREE.Scene>;
    camera?: MaybeFactory<THREE.PerspectiveCamera>;
    renderer?: MaybeFactory<THREE.WebGLRenderer>;
    lights?: MaybeFactory<{
        ambientLight: THREE.Light;
        mainLight: THREE.Light;
    }>;
    controlsFactory?: (camera: THREE.PerspectiveCamera, domElement: HTMLElement) => any | null;
    scheduler?: Scheduler;
    systems?: Updatable[];
    autoStart?: boolean;
    color?: string;
}
export declare class Runtime {
    protected container: HTMLDivElement;
    protected scene: THREE.Scene;
    protected camera: THREE.PerspectiveCamera;
    protected renderer: THREE.WebGLRenderer;
    protected controls: any;
    protected loop: FrameLoop;
    protected cameraRig: THREE.Group<THREE.Object3DEventMap>;
    protected clock: THREE.Clock;
    constructor(container: HTMLDivElement, options?: RuntimeOptions);
    protected createScene(color: string): THREE.Scene;
    protected createCamera(): THREE.PerspectiveCamera;
    protected createRenderer(): THREE.WebGLRenderer;
    protected createControls(camera: THREE.PerspectiveCamera, domElement: HTMLCanvasElement): import("three/examples/jsm/controls/OrbitControls.js").OrbitControls;
    protected createLights(): {
        ambientLight: THREE.Light;
        mainLight: THREE.Light;
    };
    protected createScheduler(): Scheduler;
    init(): Promise<void>;
    render(): void;
    start(): void;
    stop(): void;
}
export {};
