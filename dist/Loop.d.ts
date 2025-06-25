import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import type { Object3D, Object3DEventMap } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
declare class Loop {
    private camera;
    private cameraRig;
    private scene;
    private renderer;
    private clock;
    private dummyCube;
    updatables: ((Object3D<Object3DEventMap> | OrbitControls) & {
        tick: (delta: number) => void;
    })[];
    constructor(camera: PerspectiveCamera, cameraRig: THREE.Group, scene: Scene, renderer: WebGLRenderer, dummyCube: THREE.Mesh);
    start(): void;
    stop(): void;
    tick(): void;
    update(delta: number): void;
}
export { Loop };
