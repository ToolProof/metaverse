import { PerspectiveCamera, WebGLRenderer } from 'three';


class Resizer {

    private setSize = (container: HTMLDivElement, camera: PerspectiveCamera, renderer: WebGLRenderer) => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
        // renderer.setSize(300, 300);
        renderer.setPixelRatio(window.devicePixelRatio);
    };

    onResize() { }

    constructor(container: HTMLDivElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        // set initial size
        this.setSize(container, camera, renderer);

        // ATTENTION: scene goes black
        window.addEventListener('resize', () => {
            // set the size again if a resize occurs
            this.setSize(container, camera, renderer);
            this.onResize();
        });

    }
}

export { Resizer };