import { createCamera } from './camera.js';
import { createLights } from './lights.js';
import { createScene } from './scene.js';
import { createRenderer } from './renderer.js';
import { createControls } from './controls.js';
import { Resizer } from './Resizer.js';
import * as THREE from 'three';
class World {
    constructor(container, color = 'skyblue') {
        this.cameraRig = new THREE.Group();
        this.clock = new THREE.Clock();
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
}
export { World };
class World2 extends World {
    constructor(container, color = 'skyblue') {
        super(container, color);
        this.init = () => {
            return Promise.resolve();
        };
        this.render = () => {
            this.renderer.render(this.scene, this.camera);
        };
        this.start = () => {
        };
        this.stop = () => {
        };
    }
}
export { World2 };
