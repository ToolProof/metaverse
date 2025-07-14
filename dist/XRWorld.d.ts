import { World } from './World.js';
import * as THREE from 'three';
interface Config {
    speedMultiplier: number;
    rayColor: string;
    predicate: (obj: THREE.Object3D) => boolean;
    isGrabbable: boolean;
    selectionBehavior: SelectionBehavior;
    recursiveRaycast?: boolean;
}
interface SelectionCommand {
    selectedObject: THREE.Object3D | null;
    restoreOriginalPosition?: boolean;
}
interface SelectionBehavior {
    onSelectStart(intersected: THREE.Object3D | null): SelectionCommand;
    onSelectEnd(current: THREE.Object3D | null): SelectionCommand;
}
export declare class TransientSelection implements SelectionBehavior {
    onSelectStart(intersected: THREE.Object3D | null): SelectionCommand;
    onSelectEnd(current: THREE.Object3D | null): SelectionCommand;
}
export declare class PersistentSelection implements SelectionBehavior {
    private lastSelected;
    onSelectStart(intersected: THREE.Object3D | null): SelectionCommand;
    onSelectEnd(current: THREE.Object3D | null): SelectionCommand;
}
declare abstract class XRWorld extends World {
    private config;
    private controller;
    protected intersected: THREE.Object3D | null;
    protected selectedObject: THREE.Object3D | null;
    private grabbedObjectOriginalPosition;
    private textSprite;
    constructor(container: HTMLDivElement, config: Config);
    render(): void;
    start(): void;
    stop(): void;
    protected updateMovement(delta: number): void;
    protected updateInteraction(): void;
    protected showText(text: string): void;
    private highlight;
    private raycastFromController;
}
export { XRWorld };
