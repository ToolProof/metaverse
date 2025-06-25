import * as THREE from 'three';

export function placeXZRing(
    yOffset: number,
    ySpacing: number,
    boxWidth = 0.05,
    gap = 0.5,
    objects: { title: string; content: string }[],
): ({ title: string; content: string; position: THREE.Vector3 })[] {
    const angleStep = (2 * Math.PI) / objects.length;
    const radius = (boxWidth + gap) / angleStep;
    const y = yOffset * ySpacing;

    return objects.map((dayEntry, i) => {
        const angle = i * angleStep;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        return {
            ...dayEntry,
            position: new THREE.Vector3(x, y, z),
        };
    });
}