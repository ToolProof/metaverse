import * as THREE from 'three';
declare abstract class World {
    protected scene: THREE.Scene;
    protected renderer: THREE.WebGLRenderer;
    protected camera: THREE.PerspectiveCamera;
    protected cameraRig: THREE.Group<THREE.Object3DEventMap>;
    protected clock: THREE.Clock;
    protected container: HTMLDivElement;
    protected dummyCube: THREE.Mesh;
    constructor(container: HTMLDivElement);
    abstract init(): Promise<void>;
    abstract render(): void;
    abstract start(): void;
    abstract stop(): void;
}
export { World };
