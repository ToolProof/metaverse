import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PerspectiveCamera } from 'three';

function createControls(camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
    const controls = new OrbitControls(camera, canvas);

    // controls.enableDamping = true;
    // controls.dampingFactor = 0.01;

    // controls.target.x = -3;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = ;
    

    controls.tick = () => controls.update();

    return controls;
}

export { createControls };