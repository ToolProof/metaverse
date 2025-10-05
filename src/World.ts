import { createCamera } from './camera.js';
import { createLights } from './lights.js';
import { createScene } from './scene.js';
import { createRenderer } from './renderer.js';
import { createControls } from './controls.js';
import { Resizer } from './Resizer.js';
import * as THREE from 'three';


abstract class World {
    protected container;
    protected renderer;
    protected scene;
    protected camera;
    protected cameraRig = new THREE.Group();
    protected clock = new THREE.Clock();
    protected dummyCube: THREE.Mesh;

    constructor(container: HTMLDivElement, color: string = 'skyblue') {
        this.container = container;
        this.renderer = createRenderer();
        this.scene = createScene(color);
        this.camera = createCamera(30);
        this.cameraRig.add(this.camera);

        this.dummyCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        this.dummyCube.position.set(0, 1, -2); // Position it in front of the camera

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