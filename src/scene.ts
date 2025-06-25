import { Color, Scene } from 'three';

function createScene(color: string = 'skyblue') {
  const scene = new Scene();

  scene.background = new Color(color);

  return scene;
}

export { createScene };