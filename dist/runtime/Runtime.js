import * as THREE from 'three';
import { createScene } from './components/scene.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createRenderer } from './systems/renderer.js';
import { createControls } from './systems/controls.js';
import { FrameLoop } from './systems/loop/FrameLoop.js';
import { XRRendererScheduler } from './systems/loop/schedulers.js';
import { Resizer } from './systems/Resizer.js';
export class Runtime {
    constructor(container, options = {}) {
        this.cameraRig = new THREE.Group();
        this.clock = new THREE.Clock();
        this.container = container;
        const color = options.color ?? 'skyblue';
        // Allow injected instances or builders; otherwise call template methods
        this.renderer = typeof options.renderer === 'function' ? options.renderer() : options.renderer ?? this.createRenderer();
        this.scene = typeof options.scene === 'function' ? options.scene() : options.scene ?? this.createScene(color);
        this.camera = typeof options.camera === 'function' ? options.camera() : options.camera ?? this.createCamera();
        const controlsFactory = options.controlsFactory ?? this.createControls.bind(this);
        this.controls = controlsFactory(this.camera, this.renderer.domElement);
        const scheduler = options.scheduler ?? this.createScheduler();
        this.loop = new FrameLoop(scheduler);
        this.cameraRig.add(this.camera);
        const { ambientLight, mainLight } = typeof options.lights === 'function' ? options.lights() : options.lights ?? this.createLights();
        this.scene.add(ambientLight, mainLight, this.cameraRig);
        container.append(this.renderer.domElement);
        new Resizer(container, this.camera, this.renderer);
        // Register systems, ensuring render runs last so it reflects all updates
        const renderSystem = { tick: () => this.renderer.render(this.scene, this.camera) };
        this.loop.add(...(options.systems ?? []), renderSystem);
        if (options.autoStart ?? true) {
            this.start();
        }
    }
    // Template methods: subclasses can override these to change construction
    createScene(color) {
        return createScene(color);
    }
    createCamera() {
        return createCamera(30);
    }
    createRenderer() {
        return createRenderer();
    }
    createControls(camera, domElement) {
        return createControls(camera, domElement);
    }
    createLights() {
        return createLights();
    }
    createScheduler() {
        return new XRRendererScheduler(this.renderer);
    }
    // Lifecycle (non-abstract for composition users)
    async init() {
        // no-op default
    }
    render() {
        // single-shot render
        this.renderer.render(this.scene, this.camera);
    }
    start() {
        this.loop.start();
    }
    stop() {
        this.loop.stop();
    }
}
