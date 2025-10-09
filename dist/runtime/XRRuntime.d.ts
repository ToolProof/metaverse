import { Runtime } from './Runtime.js';
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
    selected: THREE.Object3D | null;
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
export default class XRRuntime extends Runtime {
    private config;
    private controller;
    protected intersected: THREE.Object3D | null;
    protected selected: THREE.Object3D | null;
    private grabbedOriginalPosition;
    private textSprite;
    constructor(container: HTMLDivElement, config: Config);
    render(): void;
    start(): void;
    protected updateMovement(delta: number): void;
    protected updateInteraction(): void;
    protected showText(text: string): void;
    private highlight;
    private raycastFromController;
    private setDummyColor;
}
export {};
