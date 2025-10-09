import * as THREE from 'three';
import { createScene } from './components/scene.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createRenderer } from './systems/renderer.js';
import { createControls } from './systems/controls.js';
import { FrameLoop } from './systems/loop/FrameLoop.js';
import { XRRendererScheduler } from './systems/loop/schedulers.js';
import type { Scheduler, Updatable } from './systems/loop/types.js';
import { Resizer } from './systems/Resizer.js';


type MaybeFactory<T> = T | (() => T);

export interface RuntimeOptions {
    scene?: MaybeFactory<THREE.Scene>;
    camera?: MaybeFactory<THREE.PerspectiveCamera>;
    renderer?: MaybeFactory<THREE.WebGLRenderer>;
    lights?: MaybeFactory<{ ambientLight: THREE.Light; mainLight: THREE.Light }>; // match existing createLights shape
    controlsFactory?: (camera: THREE.PerspectiveCamera, domElement: HTMLElement) => any | null;
    scheduler?: Scheduler;
    systems?: Updatable[];
    autoStart?: boolean;
    color?: string; // preserve old param as an option
}

export class Runtime {
    protected container: HTMLDivElement;
    protected scene: THREE.Scene;
    protected camera: THREE.PerspectiveCamera;
    protected renderer: THREE.WebGLRenderer;
    protected controls: any;
    protected loop: FrameLoop;
    protected cameraRig = new THREE.Group();
    protected clock = new THREE.Clock();

    constructor(container: HTMLDivElement, options: RuntimeOptions = {}) {
        this.container = container;

        const color = options.color ?? 'skyblue';

        // Allow injected instances or builders; otherwise call template methods
        this.renderer = typeof options.renderer === 'function' ? options.renderer() : options.renderer ?? this.createRenderer();
        this.scene = typeof options.scene === 'function' ? options.scene() : options.scene ?? this.createScene(color);
        this.camera = typeof options.camera === 'function' ? options.camera() : options.camera ?? this.createCamera();

        const controlsFactory = options.controlsFactory ?? this.createControls.bind(this);
        this.controls = controlsFactory(this.camera, this.renderer.domElement as HTMLCanvasElement);

        const scheduler = options.scheduler ?? this.createScheduler();
        this.loop = new FrameLoop(scheduler);
        this.cameraRig.add(this.camera);

        const { ambientLight, mainLight } =
            typeof options.lights === 'function' ? options.lights() : options.lights ?? this.createLights();

        this.scene.add(ambientLight, mainLight, this.cameraRig);

        container.append(this.renderer.domElement);

        new Resizer(container, this.camera, this.renderer);

        // Register systems, ensuring render runs last so it reflects all updates
        const renderSystem: Updatable = { tick: () => this.renderer.render(this.scene, this.camera) };

        this.loop.add(...(options.systems ?? []), renderSystem);

        if (options.autoStart ?? true) {
            this.start();
        }
    }

    // Template methods: subclasses can override these to change construction
    protected createScene(color: string): THREE.Scene {
        return createScene(color);
    }
    protected createCamera(): THREE.PerspectiveCamera {
        return createCamera(30);
    }
    protected createRenderer(): THREE.WebGLRenderer {
        return createRenderer();
    }
    protected createControls(camera: THREE.PerspectiveCamera, domElement: HTMLCanvasElement) {
        return createControls(camera, domElement);
    }
    protected createLights(): { ambientLight: THREE.Light; mainLight: THREE.Light } {
        return createLights();
    }
    protected createScheduler(): Scheduler {
        return new XRRendererScheduler(this.renderer);
    }

    // Lifecycle (non-abstract for composition users)
    async init(): Promise<void> {
        // no-op default
    }

    render(): void {
        // single-shot render
        this.renderer.render(this.scene, this.camera);
    }

    start(): void {
        this.loop.start();
    }

    stop(): void {
        this.loop.stop();
    }
}