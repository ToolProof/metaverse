import { World } from './World.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import * as THREE from 'three';


abstract class XRWorld extends World {
    protected controller: THREE.Group;
    protected grabbedObject: THREE.Object3D | null = null;
    protected grabbedObjectOriginalPosition: THREE.Vector3 | null = null;
    protected textSprite: THREE.Sprite | null = null;
    private targetType: string;
    private rayColor: string;
    private speedMultiplier = 1;

    constructor(container: HTMLDivElement, targetType: string, rayColor: string) {
        super(container);

        this.targetType = targetType;
        this.rayColor = rayColor;

        this.renderer.xr.enabled = true;
        document.body.appendChild(VRButton.createButton(this.renderer));

        this.controller = this.renderer.xr.getController(0);

        this.controller.addEventListener('selectstart', this.onSelectStart.bind(this));
        this.controller.addEventListener('selectend', this.onSelectEnd.bind(this));
        this.scene.add(this.controller);

        const laserGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        ]);

        const laserMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); // yellow line
        const laser = new THREE.Line(laserGeometry, laserMaterial);
        laser.scale.z = 5; // make it 5 units long

        // this.controller.add(laser); // attach to controller so it moves with it

        // this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    render() {
        // draw a single frame
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.update(this.clock.getDelta());

            // render a frame
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    protected update(delta: number) {
        // return;
        const session = this.renderer.xr.getSession();
        if (!session) {
            this.dummyCube.material.color.set('red');
            return;
        }

        this.dummyCube.material.color.set('green');

        const movementSpeed = 1 * this.speedMultiplier;
        const rotationSpeed = 2;

        let moved = false;
        let inputDetected = false;

        const debugLeft = '';
        const debugRight = '';

        for (const inputSource of session.inputSources) {
            const gp = inputSource.gamepad;
            if (!gp || gp.axes.length < 2) continue;

            inputDetected = true;

            const x = gp.axes[2] ?? gp.axes[0];
            const y = gp.axes[3] ?? gp.axes[1];

            // 🟦 LEFT controller → movement
            if (inputSource.handedness === 'left') {
                this.dummyCube.scale.set(Math.abs(x) + 0.1, Math.abs(y) + 0.1, 1);

                // Joystick-based horizontal movement
                if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
                    const movement = new THREE.Vector3(x, 0, y)
                        .normalize()
                        .multiplyScalar(movementSpeed * delta)
                        .applyQuaternion(this.cameraRig.quaternion);

                    this.cameraRig.position.add(movement);
                    moved = true;
                }

                // 🎯 Button-based vertical movement
                if (gp.buttons[0]?.pressed) {
                    this.cameraRig.position.y -= movementSpeed * delta; // button 0 = down
                    moved = true;
                }
                if (gp.buttons[1]?.pressed) {
                    this.cameraRig.position.y += movementSpeed * delta; // button 1 = up
                    moved = true;
                }
            }

            // 🟨 RIGHT controller → yaw rotation
            else if (inputSource.handedness === 'right') {
                this.dummyCube.scale.set(Math.abs(x) + 0.1, Math.abs(y) + 0.1, 1);

                // Joystick-based yaw rotation
                if (Math.abs(x) > 0.1) {
                    const yaw = -x * rotationSpeed * delta;
                    const rotation = new THREE.Quaternion().setFromAxisAngle(
                        new THREE.Vector3(0, 1, 0),
                        yaw
                    );
                    this.cameraRig.quaternion.multiply(rotation);
                    moved = true;
                }

                // 🎯 Button-based speed control
                if (gp.buttons[0]?.pressed) {
                    this.speedMultiplier = 0.1;
                } else if (gp.buttons[1]?.pressed) {
                    this.speedMultiplier = 10;
                } else {
                    this.speedMultiplier = 1;
                }

            }

            // 🧾 Button inspection
            /* if (gp.buttons.length > 0) {
                const pressedButtons = gp.buttons
                    .map((btn, i) => btn.pressed ? `[#${i}]` : null)
                    .filter(Boolean)
                    .join(' ');

                const touchedButtons = gp.buttons
                    .map((btn, i) => btn.touched ? `t${i}` : null)
                    .filter(Boolean)
                    .join(' ');

                const analogValues = gp.buttons
                    .map((btn, i) => btn.value > 0 ? `${i}:${btn.value.toFixed(2)}` : null)
                    .filter(Boolean)
                    .join(' ');

                const msg = `Pressed: ${pressedButtons || 'none'}\nTouched: ${touchedButtons || 'none'}\nAnalog: ${analogValues || 'none'}`;

                if (inputSource.handedness === 'left') {
                    debugLeft = `🟦 Left\n${msg}`;
                } else if (inputSource.handedness === 'right') {
                    debugRight = `🟨 Right\n${msg}`;
                }
            } */
        }

        if (!inputDetected) {
            this.dummyCube.material.color.set('orange');
        } else if (!moved) {
            this.dummyCube.material.color.set('yellow');
        }

        // this.showText(`${debugLeft}\n\n${debugRight}`);
    }

    private createTextSprite(text: string): THREE.Sprite {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;

        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '24px sans-serif';
        ctx.fillText(text, 20, 50);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        return new THREE.Sprite(material);
    }

    private lastText: string = '';

    protected showText(text: string) {
        if (!this.textSprite) {
            this.textSprite = this.createTextSprite(text);
            this.textSprite.position.set(0, 0, -5);
            this.camera.add(this.textSprite);
            this.lastText = text;
        }

        if (!text || text.trim() === '') {
            this.textSprite.visible = false;
            this.lastText = '';
            return;
        }

        // If text hasn't changed and sprite is already visible, skip redraw
        if (this.textSprite.visible && text === this.lastText) {
            return;
        }

        this.textSprite.visible = true;
        this.lastText = text;

        const fontSize = 24;
        const padding = 40;
        const lineHeight = 28;
        const maxWidth = 512 - padding;

        // Word-wrap the text into lines
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.font = `${fontSize}px sans-serif`;

        const words = text.split(' ');
        let line = '';
        const lines: string[] = [];

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = tempCtx.measureText(testLine).width;

            if (testWidth > maxWidth && line !== '') {
                lines.push(line.trim());
                line = words[i] + ' ';
            } else {
                line = testLine;
            }
        }
        if (line !== '') lines.push(line.trim());

        // Resize and clear the canvas
        const canvas = this.textSprite.material.map!.image as HTMLCanvasElement;
        canvas.width = 512;
        canvas.height = lines.length * lineHeight + 60;

        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textBaseline = 'top';

        lines.forEach((line, i) => {
            ctx.fillText(line, 20, 30 + i * lineHeight);
        });

        (this.textSprite.material.map as THREE.Texture).needsUpdate = true;

        const aspect = canvas.width / canvas.height;
        this.textSprite.scale.set(1.5 * aspect, 1.5, 1);
    }


    private onSelectStart() {
        const intersected = this.raycastFromController();
        if (intersected) this.grabbedObject = intersected;
    }

    private onSelectEnd() {
        if (this.grabbedObject) {
            this.grabbedObject.position.copy(this.grabbedObjectOriginalPosition || new THREE.Vector3());
            this.grabbedObjectOriginalPosition = null;
        }
        this.grabbedObject = null;
    }

    private animate() {
        this.highlight();

        if (this.grabbedObject) {
            const pos = new THREE.Vector3();
            this.controller.getWorldPosition(pos);
            if (!this.grabbedObjectOriginalPosition) {
                this.grabbedObjectOriginalPosition = this.grabbedObject.position.clone();
            }
            this.grabbedObject.position.copy(pos);
        }

        // this.renderer.render(this.scene, this.camera);
    }

    private highlight() {
        const intersected = this.raycastFromController();

        this.scene.children.forEach(obj => {
            if (obj.userData?.type === this.targetType && obj instanceof THREE.Mesh) {
                const mat = obj.material as THREE.MeshStandardMaterial;
                mat.emissive.set(intersected === obj ? 'yellow' : 'black');
            }
        });
    }

    private raycastFromController(): THREE.Object3D | null {
        const tempMatrix = new THREE.Matrix4().identity().extractRotation(this.controller.matrixWorld);
        const raycaster = new THREE.Raycaster();
        raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const targets = this.scene.children.filter(obj => obj.userData?.type === this.targetType);
        const intersects = raycaster.intersectObjects(targets, false);
        return intersects.length > 0 ? intersects[0].object : null;
    }

}


export { XRWorld };
