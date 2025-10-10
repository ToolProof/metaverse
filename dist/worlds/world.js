import { createCamera } from '../runtime/components/camera.js';
import { createLights } from '../runtime/components/lights.js';
import { createScene } from '../runtime/components/scene.js';
import { createRenderer } from '../runtime/systems/renderer.js';
import { createControls } from '../runtime/systems/controls.js';
import { Resizer } from '../runtime/systems/Resizer.js';
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
        this.dummyCube = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 3), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
        this.dummyCube.position.set(10, -5, 5); // Position it in front of the camera
        const { ambientLight, mainLight } = createLights();
        this.scene.add(this.dummyCube, ambientLight, mainLight, this.cameraRig);
        container.append(this.renderer.domElement);
        createControls(this.camera, this.renderer.domElement);
        new Resizer(container, this.camera, this.renderer);
        // this.start();
    }
}
export { World };
