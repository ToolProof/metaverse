import { MathUtils, PerspectiveCamera } from 'three';

function createCamera(z: number = 10): PerspectiveCamera {
  const camera = new PerspectiveCamera(35, 1, 0.1, 500);

  camera.position.set(0, 0, z);

  return camera;
}

export { createCamera };