import { World2 } from './world/World.js';

console.log('Hello, Metaverse!');

const container = document.querySelector('#scene-container');

const world2 = new World2(container as HTMLDivElement);

await world2.init();

world2.render();


