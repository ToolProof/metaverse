import * as THREE from 'three';
export function placeXZRing(yOffset, ySpacing, boxWidth = 0.05, // ATTENTION: tight coupling
gap = 0.5, objects) {
    const angleStep = (2 * Math.PI) / objects.length;
    const radius = (boxWidth + gap) / angleStep;
    const y = yOffset * ySpacing;
    return objects.map((entry, i) => {
        const angle = i * angleStep;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        return {
            ...entry,
            position: new THREE.Vector3(x, y, z),
        };
    });
}
