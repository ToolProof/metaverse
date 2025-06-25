import { World } from 'threebase/dist/World';
import * as THREE from 'three';
declare abstract class XRWorld extends World {
    protected controller: THREE.Group;
    protected grabbedObject: THREE.Object3D | null;
    protected grabbedObjectOriginalPosition: THREE.Vector3 | null;
    protected textSprite: THREE.Sprite | null;
    private targetType;
    private rayColor;
    private speedMultiplier;
    constructor(container: HTMLDivElement, targetType: string, rayColor: string);
    render(): void;
    start(): void;
    stop(): void;
    protected update(delta: number): void;
    private createTextSprite;
    private lastText;
    protected showText(text: string): void;
    private onSelectStart;
    private onSelectEnd;
    private animate;
    private highlight;
    private raycastFromController;
}
export { XRWorld };
