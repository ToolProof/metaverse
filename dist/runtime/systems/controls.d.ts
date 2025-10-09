import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PerspectiveCamera } from 'three';
declare function createControls(camera: PerspectiveCamera, canvas: HTMLCanvasElement): OrbitControls;
export { createControls };
