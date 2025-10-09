import { DirectionalLight, HemisphereLight } from 'three';
declare function createLights(): {
    ambientLight: HemisphereLight;
    mainLight: DirectionalLight;
};
export { createLights };
