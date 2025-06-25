import * as THREE from 'three';
declare abstract class World {
    protected scene: any;
    protected renderer: any;
    protected camera: PerspectiveCamera;
    protected cameraRig: any;
    protected clock: any;
    protected container: HTMLDivElement;
    protected dummyCube: THREE.Mesh;
    constructor(container: HTMLDivElement);
    abstract init(): Promise<void>;
    abstract render(): void;
    abstract start(): void;
    abstract stop(): void;
}
export { World };
