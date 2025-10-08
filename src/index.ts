import { Runtime2 } from './runtime/Runtime.js';

console.log('Hello, Metaverse!');

const container = document.querySelector('#scene-container');

const runtime2 = new Runtime2(container as HTMLDivElement);

await runtime2.init();

runtime2.render();


