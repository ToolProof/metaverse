import * as THREE from 'three';
declare abstract class World {
    protected container: HTMLDivElement;
    protected renderer: THREE.WebGLRenderer;
    protected scene: THREE.Scene;
    protected camera: THREE.PerspectiveCamera;
    protected cameraRig: THREE.Group<THREE.Object3DEventMap>;
    protected clock: THREE.Clock;
    protected dummyCube: THREE.Mesh;
    constructor(container: HTMLDivElement, color?: string);
    abstract init(): Promise<void>;
    abstract render(): void;
    abstract start(): void;
    abstract stop(): void;
}
export { World };
