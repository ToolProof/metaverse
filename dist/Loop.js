import { Clock } from 'three';
import * as THREE from 'three';
class Loop {
    constructor(camera, cameraRig, scene, renderer, dummyCube) {
        this.clock = new Clock();
        this.updatables = [];
        this.camera = camera;
        this.cameraRig = cameraRig;
        this.scene = scene;
        this.renderer = renderer;
        this.dummyCube = dummyCube;
    }
    start() {
        this.renderer.setAnimationLoop(() => {
            // tell every animated object to tick forward one frame
            // this.tick();
            this.update(this.clock.getDelta()); // ATTENTION: temporary hack
            // render a frame
            this.renderer.render(this.scene, this.camera);
        });
    }
    stop() {
        this.renderer.setAnimationLoop(null);
    }
    tick() {
        const delta = this.clock.getDelta();
        for (const object of this.updatables) {
            object.tick(delta);
        }
    }
    update(delta) {
        const session = this.renderer.xr.getSession();
        if (!session) {
            this.dummyCube.material.color.set('red'); // Not in XR
            return;
        }
        this.dummyCube.material.color.set('green'); // XR session active
        const speed = 1.5;
        let moved = false;
        let inputDetected = false;
        for (const inputSource of session.inputSources) {
            if (inputSource.handedness !== 'left')
                continue;
            const gp = inputSource.gamepad;
            if (gp && gp.axes.length >= 2) {
                inputDetected = true;
                const x = gp.axes[2] ?? gp.axes[0];
                const y = gp.axes[3] ?? gp.axes[1];
                // Use cube scale to show joystick direction
                this.dummyCube.scale.set(Math.abs(x) + 0.1, Math.abs(y) + 0.1, 1);
                if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
                    const movement = new THREE.Vector3(x, 0, -y)
                        .normalize()
                        .multiplyScalar(speed * delta)
                        .applyQuaternion(this.camera.quaternion);
                    this.cameraRig.position.add(movement);
                    moved = true;
                }
            }
        }
        if (!inputDetected) {
            this.dummyCube.material.color.set('orange'); // No gamepad input found
        }
        else if (!moved) {
            this.dummyCube.material.color.set('yellow'); // Gamepad connected, but stick idle
        }
    }
}
export { Loop };
