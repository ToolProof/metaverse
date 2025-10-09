import { PerspectiveCamera } from 'three';
function createCamera(z = 10) {
    const camera = new PerspectiveCamera(35, 1, 0.1, 500);
    camera.position.set(0, 0, z);
    return camera;
}
export { createCamera };
