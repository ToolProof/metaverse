import * as THREE from 'three';
export declare function placeXZRing(yOffset: number, ySpacing: number, boxWidth: number | undefined, // ATTENTION: tight coupling
gap: number | undefined, objects: {
    title: string;
    content: string;
}[]): ({
    title: string;
    content: string;
    position: THREE.Vector3;
})[];
