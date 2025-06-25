import { PerspectiveCamera, WebGLRenderer } from 'three';
declare class Resizer {
    private setSize;
    onResize(): void;
    constructor(container: HTMLDivElement, camera: PerspectiveCamera, renderer: WebGLRenderer);
}
export { Resizer };
