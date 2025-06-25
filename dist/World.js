import { createCamera } from './camera.js';
import { createLights } from './lights.js';
import { createScene } from './scene.js';
import { createRenderer } from './renderer.js';
import { createControls } from './controls.js';
import { Resizer } from './Resizer.js';
import * as THREE from 'three';
class World {
    constructor(container) {
        this.cameraRig = new THREE.Group();
        this.clock = new THREE.Clock();
        this.scene = createScene('skyblue');
        this.renderer = createRenderer();
        this.camera = createCamera(30);
        this.cameraRig.add(this.camera);
        this.dummyCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        this.dummyCube.position.set(0, 1, -2); // Position it in front of the camera
        this.container = container;
        const { ambientLight, mainLight } = createLights();
        this.scene.add(ambientLight, mainLight, this.cameraRig);
        container.append(this.renderer.domElement);
        createControls(this.camera, this.renderer.domElement);
        new Resizer(container, this.camera, this.renderer);
        this.start();
    }
}
export { World };
