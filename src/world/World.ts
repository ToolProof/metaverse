import * as THREE from 'three';
import { createScene } from './components/scene.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { loadBirds } from './components/birds/birds.js';
import { createRenderer } from './systems/renderer.js';
import { createControls } from './systems/controls.js';
import { Resizer } from './systems/Resizer.js';


abstract class World {
    protected container;
    protected scene;
    protected camera;
    protected renderer;
    protected controls;
    protected cameraRig = new THREE.Group();
    protected clock = new THREE.Clock();
    protected dummyCube: THREE.Mesh;

    constructor(container: HTMLDivElement, color: string = 'skyblue') {
        this.container = container;
        this.renderer = createRenderer();
        this.scene = createScene(color);
        this.camera = createCamera(30);
        this.controls = createControls(this.camera, this.renderer.domElement);
        this.cameraRig.add(this.camera);

        this.dummyCube = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 3), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
        this.dummyCube.position.set(10, -5, 5); // Position it in front of the camera

        const { ambientLight, mainLight } = createLights();

        this.scene.add(this.dummyCube, ambientLight, mainLight, this.cameraRig);

        container.append(this.renderer.domElement);

        createControls(this.camera, this.renderer.domElement);

        new Resizer(container, this.camera, this.renderer);

        this.start();
    }

    abstract init(): Promise<void>;

    abstract render(): void;

    abstract start(): void;

    abstract stop(): void;

}

export { World };


class World2 extends World {
    constructor(container: HTMLDivElement, color: string = 'skyblue') {
        super(container, color);
    }

    async init(): Promise<void> {
        const { parrot, flamingo, stork } = await loadBirds();
        this.controls.target.copy(parrot.position);

        // loop.updatables.push(parrot, flamingo, stork);
        this.scene.add(parrot, flamingo, stork);
    }

    render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    start(): void {
        // no-op for now
    }

    stop(): void {
        // no-op for now
    }
}

export { World2 };